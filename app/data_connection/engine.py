from . import schema
from . import auth
from ..data_set.schema import DataSetOut
from fastapi import HTTPException

# to Test Connection
from sqlalchemy import create_engine, inspect, MetaData, Table, true
from sqlalchemy.orm.session import Session
from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError
import urllib.parse

# ENV Variables
from .db_libraries import DB_LIBRARIES
from decouple import config
DB_SECRET = config("DB_SECRET")

db_pool = {}


def create_connection_string(dc: schema.DataConnectionIn, decrypted_password: str = None) -> str:
    vendor = dc.vendor
    library = DB_LIBRARIES[dc.vendor]
    server = dc.url
    database = dc.db_name
    username = dc.username
    port = dc.port
    # driver info is extra details and is only uesd for MS SQL Server
    driver = 'ODBC Driver 17 for SQL Server'
    # for test connection use fresh password from schema, for saved connection use decrypted pass
    # urllib.parse.quote_plus is used to encode if any special characters appear
    if decrypted_password == None:
        password = urllib.parse.quote_plus(dc.password)
    else:
        password = urllib.parse.quote_plus(decrypted_password)
    # construct Vendor specfic connection string
    if vendor == 'mssql':
        conn_str = f"{vendor}+{library}://{username}:{password}@{server}:{port}/{database}?driver={driver}"
    else:
        conn_str = f"{vendor}+{library}://{username}:{password}@{server}:{port}/{database}"
    return conn_str


async def test_connection(dc: schema.DataConnectionIn) -> dict:
    if dc.vendor in DB_LIBRARIES:
        conn_str = create_connection_string(dc)
        engine = create_engine(conn_str)
        try:
            # if can establish connection then success
            engine.connect()
            engine.dispose()
            return {"message": "Test Seems OK"}
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=400, detail=str(err.__cause__))
    else:
        raise HTTPException(
            status_code=403, detail="Database not yet supported")


async def close_connection(dc_uid: str) -> bool:
    global db_pool
    if db_pool.get(dc_uid):
        try:
            db_pool[dc_uid]["engine"].dispose()
            del db_pool[dc_uid]
            return True
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)
    else:
        raise HTTPException(
            status_code=404, detail="connection is not available")


# on receiving all user DC list, checks with active DC list and deletes from engine
async def close_all_connection(dc_list: list) -> bool:
    global db_pool
    try:
        if db_pool:
            # first get active dc list of the user from engine list
            user_active_dc_list = []
            for dc in db_pool.keys():
                for user_dc in dc_list:
                    if dc == user_dc:
                        user_active_dc_list.append(dc)
            # delete the active DC list of the user from engine
            for dc in user_active_dc_list:
                db_pool[dc]["engine"].dispose()
                del db_pool[dc]
            return True
        else:
            return True
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=err)


async def create_connection(dc: schema.DataConnectionPool) -> bool:
    global db_pool
    # if connection pool is already created for the DC
    if db_pool.get(dc.dc_uid):
        return True
    # fresh creation of connection pool for the DC
    else:
        decrypted_password = auth.decrypt_password(dc.password)
        # conn_str = f"{dc.vendor}+{DB_LIBRARIES[dc.vendor]}://{dc.username}:{urllib.parse.quote_plus(decrypted_password)}@{dc.url}:{dc.port}/{dc.db_name}"
        conn_str = create_connection_string(dc, decrypted_password)
        db_pool[dc.dc_uid] = {}
        db_pool[dc.dc_uid]["engine"] = create_engine(conn_str, echo=False,
                                                     pool_size=2, max_overflow=5)
        try:
            db_pool[dc.dc_uid]["engine"].connect()
            db_pool[dc.dc_uid]["insp"] = inspect(db_pool[dc.dc_uid]["engine"])
            db_pool[dc.dc_uid]["meta"] = MetaData()
            db_pool[dc.dc_uid]["vendor"] = dc.vendor
            # print("insp =================== ", db_pool[dc.dc_uid]["insp"])
            return True
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=500, detail=err)


async def is_ds_active(dc_uid: str, ds_uid: str) -> bool:
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="DC is not connected")
    if db_pool.get(dc_uid).get('data_schema') and db_pool[dc_uid]['data_schema'][ds_uid]:
        return True
    else:
        return False


async def is_dc_active(dc_uid: str) -> bool:
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        return False
    return True


async def activate_ds(ds: DataSetOut):
    global db_pool
    if not (db_pool and db_pool.get(ds.dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    if db_pool.get(ds.dc_uid).get('data_schema'):
        db_pool[ds.dc_uid]['data_schema'][ds.ds_uid] = ds.data_schema
    else:
        db_pool[ds.dc_uid]['data_schema'] = {}
        db_pool[ds.dc_uid]['data_schema'][ds.ds_uid] = ds.data_schema
    # print("data schema during activating ds ========\n",
        #   db_pool[ds.dc_uid]['data_schema'][ds.ds_uid])
    return True


async def get_data_schema(dc_uid: str, ds_uid: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    if not (db_pool.get(dc_uid).get('data_schema') and db_pool.get(dc_uid).get('data_schema').get(ds_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DS first")
    return db_pool.get(dc_uid).get('data_schema').get(ds_uid)


def get_schema_names(dc_uid: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    else:
        try:
            schemas = db_pool[dc_uid]["insp"].get_schema_names()
            # print(schemas)
            return schemas
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)


def get_table_names(dc_uid: str, schema_name: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    else:
        try:
            tables = db_pool[dc_uid]["insp"].get_table_names(schema_name)
            # print(tables)
            return tables
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)


def get_sample_records(dc_uid: str, schema_name: str, table_name: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    try:
        qry = text(f"select * from {schema_name}.{table_name} limit 100;")
        records = db_pool[dc_uid]['engine'].execute(qry)
        result = [dict(row) for row in records]
        return result
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=err)


async def get_vendor_name_from_db_pool(dc_uid: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        return False
    return db_pool[dc_uid]["vendor"]


async def run_query(dc_uid: str, query: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    try:
        records = db_pool[dc_uid]['engine'].execute(query)
        try:
            if records:
                result = [dict(row) for row in records]
                return result
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)
    except SQLAlchemyError as err:
        error = str(err.__dict__['orig'])
        # return error
        raise HTTPException(
            status_code=400, detail=error)


async def run_query_filter(dc_uid: str, query: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    try:
        records = db_pool[dc_uid]['engine'].execute(query)
        if records:
            result = [row for row in records]
            if result and len(result[0]) >= 2:
                res1 = [a[0] for a in result]
                res2 = [a[1] for a in result]
                _result = [res1, res2]
                return _result
            else:
                _result = [a[0] for a in result]
                return _result
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=err)


def get_columns(dc_uid: str, schema_name: str, table_name: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Connect to DC first")
    else:
        try:
            columns = db_pool[dc_uid]["insp"].get_columns(
                table_name, schema_name)
            cols = [{"column_name": col["name"], "data_type": str(
                col["type"])} for col in columns]
            # print(cols)
            # convert vendor specific data types into agnostic data types
            for col in cols:
                if 'INT' in col['data_type']:
                    col['data_type'] = 'integer'
                elif 'BOOL' in col['data_type']:
                    col['data_type'] = 'boolean'
                elif 'DECIMAL' in col['data_type'] or 'NUMERIC' in col['data_type']:
                    col['data_type'] = 'decimal'
                elif 'DATE' in col['data_type']:
                    col['data_type'] = 'date'
                elif 'TIME' in col['data_type']:
                    col['data_type'] = 'timestamp'
                elif 'VARCHAR' in col['data_type'] or 'TEXT' in col['data_type']:
                    col['data_type'] = 'text'
                else:
                    col['data_type'] = 'unsupported'
            return cols
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)

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


# this is where all data connection pools are saved as dict.
# each data connection will be added as key, value
db_pool = {}


# makes a connection string to be used for creating connection pool or test connection
def create_connection_string(dc: schema.DataConnectionIn, decrypted_password: str = None) -> str:
    vendor = dc.vendor
    library = DB_LIBRARIES[dc.vendor]
    server = dc.url
    database = dc.db_name
    username = dc.username
    port = dc.port
    # driver info is extra details and is only uesd for MS SQL Server
    driver = 'ODBC Driver 17 for SQL Server'
    # for test connection, use fresh password from schema
    # for saved connection, use decrypted pass
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


# tests the connection
async def test_connection(dc: schema.DataConnectionIn) -> dict:
    if dc.vendor in DB_LIBRARIES:
        conn_str = create_connection_string(dc)
        engine = create_engine(conn_str)
        try:
            # if can establish connection then success
            engine.connect()
            # close the connection pool
            engine.dispose()
            return {"message": "Test Seems OK"}
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=400, detail=str(err.__cause__))
    else:
        raise HTTPException(
            status_code=403, detail="Database not yet supported")


# closes an exsiting connection pool
async def close_connection(dc_uid: str) -> bool:
    global db_pool
    try:
        if db_pool:
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
        else:
            return True
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=err)


# gets all DC list of the user as parameter. Then checks with active DC list and
# deletes all active connection pool of the user from engine
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


# creates connection pool for a data connection
async def create_connection(dc: schema.DataConnectionPool) -> bool:
    global db_pool
    # when connection pool is already created for the DC, simply use it
    if db_pool.get(dc.dc_uid):
        return True
    # fresh creation of connection pool for the DC
    else:
        # decrypt the saved password before using it
        decrypted_password = auth.decrypt_password(dc.password)
        # conn_str = f"{dc.vendor}+{DB_LIBRARIES[dc.vendor]}://{dc.username}:{urllib.parse.quote_plus(decrypted_password)}@{dc.url}:{dc.port}/{dc.db_name}"
        conn_str = create_connection_string(dc, decrypted_password)
        db_pool[dc.dc_uid] = {}
        # create pool of min 2 connections and can go upto 5
        db_pool[dc.dc_uid]["engine"] = create_engine(conn_str, echo=False,
                                                     pool_size=2, max_overflow=5)
        try:
            db_pool[dc.dc_uid]["engine"].connect()
            db_pool[dc.dc_uid]["insp"] = inspect(db_pool[dc.dc_uid]["engine"])
            db_pool[dc.dc_uid]["meta"] = MetaData()
            db_pool[dc.dc_uid]["vendor"] = dc.vendor
            return True
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=500, detail=err)


# checks if data set is loaded in-memory
# in-momory loaded data set (tables & relationships) help reduce time
# for query building process while user interacts with data
async def is_ds_active(dc_uid: str, ds_uid: str) -> bool:
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    if db_pool.get(dc_uid) and db_pool.get(dc_uid).get('data_schema') and \
            db_pool.get(dc_uid).get('data_schema').get(ds_uid):
        return True
    else:
        return False


# checks if there is connection pool for the data connection
# connection pool helps reducing query run time
async def is_dc_active(dc_uid: str) -> bool:
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        return False
    return True


# loads data set into in-memory for fast query building
async def activate_ds(ds: DataSetOut):
    global db_pool
    if not (db_pool and db_pool.get(ds.dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    if db_pool.get(ds.dc_uid).get('data_schema'):
        db_pool[ds.dc_uid]['data_schema'][ds.ds_uid] = ds.data_schema
    else:
        db_pool[ds.dc_uid]['data_schema'] = {}
        db_pool[ds.dc_uid]['data_schema'][ds.ds_uid] = ds.data_schema
    return True


# re-loads data set when already loaded in-memory
# re-loading is needed when data set is already loaded and DS is edited by user
def reload_ds(ds: DataSetOut):
    global db_pool
    if not (db_pool and db_pool.get(ds.dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    if db_pool.get(ds.dc_uid).get('data_schema'):
        if db_pool.get(ds.dc_uid).get('data_schema').get(ds.ds_uid):
            db_pool[ds.dc_uid]['data_schema'][ds.ds_uid] = ds.data_schema
    return True


# fething set (tables & relationships) information saved in-memory
# further used for query building
async def get_data_schema(dc_uid: str, ds_uid: str):
    global db_pool
    # first checks if connection pool is available for the data connection
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    # then checks if data set details are loaded in-memory
    if not (db_pool.get(dc_uid).get('data_schema') and db_pool.get(dc_uid).get('data_schema').get(ds_uid)):
        raise HTTPException(
            status_code=500, detail="Data Set is loaded")
    # finally returns data set (tables & relationships) information
    return db_pool.get(dc_uid).get('data_schema').get(ds_uid)


# DB metadata - getting Schemas list from DB
def get_schema_names(dc_uid: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    else:
        try:
            schemas = db_pool[dc_uid]["insp"].get_schema_names()
            return schemas
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)

# DB metadata - getting tables list from DB -> schema


def get_table_names(dc_uid: str, schema_name: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    else:
        try:
            tables = db_pool[dc_uid]["insp"].get_table_names(schema_name)
            # print(tables)
            return tables
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=err)


# DB metadata - getting tables top 100 records from DB -> schema -> table
async def get_sample_records(dc_uid: str, schema_name: str, table_name: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
    # MS SQL dialect - TOP 100
    dialect = await get_vendor_name_from_db_pool(dc_uid)
    if dialect == 'mssql':
        # Other dialects - LIMIT 100
        qry = text(f"select top 100 * from {schema_name}.{table_name};")
    else:
        qry = text(f"select * from {schema_name}.{table_name} limit 100;")
    try:
        records = db_pool[dc_uid]['engine'].execute(qry)
        result = [dict(row) for row in records]
        return result
    except Exception as err:
        raise HTTPException(
            status_code=500, detail=err)


# dialect name (vendor name) is required to custom build query
# as syntax for each dialect is different
async def get_vendor_name_from_db_pool(dc_uid: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        return False
    return db_pool[dc_uid]["vendor"]


# executes the built query on the connection pool
async def run_query(dc_uid: str, query: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
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


# executes query for populating filter values
# returns as list of values instead of list of key values
async def run_query_filter(dc_uid: str, query: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection is not established")
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


# fetches column name and data type from a DB
# all data types are renamed and fit into only 5 Silzila specific types:
# boolean, integer, decimal, date & timestamp
# doesn't handle special columns like blob, list, geo code & others
def get_columns(dc_uid: str, schema_name: str, table_name: str):
    global db_pool
    if not (db_pool and db_pool.get(dc_uid)):
        raise HTTPException(
            status_code=500, detail="Data Connection not established")
    else:
        try:
            columns = db_pool[dc_uid]["insp"].get_columns(
                table_name, schema_name)
            cols = [{"column_name": col["name"], "data_type": str(
                col["type"])} for col in columns]
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

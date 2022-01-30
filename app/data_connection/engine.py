from . import schema
from . import auth
from ..data_set.schema import DataSetOut
from fastapi import HTTPException

# to Test Connection
from sqlalchemy import create_engine, inspect, MetaData, Table, true
from sqlalchemy.sql import text
from sqlalchemy.exc import SQLAlchemyError

# ENV Variables
from .db_libraries import DB_LIBRARIES
from decouple import config
DB_SECRET = config("DB_SECRET")

db_pool = {}


async def test_connection(dc: schema.DataConnectionIn) -> dict:
    if dc.vendor in DB_LIBRARIES:
        conn_str = f"{dc.vendor}+{DB_LIBRARIES[dc.vendor]}://{dc.username}:{dc.password}@{dc.url}:{dc.port}/{dc.db_name}"
        engine = create_engine(conn_str)
        try:
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


async def create_connection(dc: schema.DataConnectionPool):
    global db_pool
    if db_pool.get(dc.dc_uid):
        # print("create_connection fn calling...... engine already available")
        return True
    else:
        decrypted_password = auth.decrypt_password(dc.password)
        # print("decrypted Password =============", decrypted_password)
        conn_str = f"{dc.vendor}+{DB_LIBRARIES[dc.vendor]}://{dc.username}:{decrypted_password}@{dc.url}:{dc.port}/{dc.db_name}"
        db_pool[dc.dc_uid] = {}
        db_pool[dc.dc_uid]["engine"] = create_engine(conn_str, echo=False,
                                                     pool_size=2, max_overflow=5)
        try:
            db_pool[dc.dc_uid]["engine"].connect()
            db_pool[dc.dc_uid]["insp"] = inspect(db_pool[dc.dc_uid]["engine"])
            db_pool[dc.dc_uid]["meta"] = MetaData()
            db_pool[dc.dc_uid]["vendor"] = dc.vendor
            # print("create_connection fn calling...... engine created now")
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
        qry = text(f"select * from {schema_name}.{table_name} limit 200;")
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

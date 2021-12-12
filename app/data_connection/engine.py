from . import schema
from . import auth
from fastapi import HTTPException

# to Test Connection
from sqlalchemy import create_engine, inspect, MetaData
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


async def create_connection(dc: schema.DataConnectionPool):
    global db_pool
    if db_pool.get(dc.dc_uid):
        print("create_connection fn calling...... engine already available")
        return True
    else:
        decrypted_password = auth.decrypt_password(dc.password)
        print("decrypted Password =============", decrypted_password)
        conn_str = f"{dc.vendor}+{DB_LIBRARIES[dc.vendor]}://{dc.username}:{decrypted_password}@{dc.url}:{dc.port}/{dc.db_name}"
        db_pool[dc.dc_uid] = {}
        db_pool[dc.dc_uid]["engine"] = create_engine(conn_str, echo=False,
                                                     pool_size=2, max_overflow=5)
        try:
            db_pool[dc.dc_uid]["engine"].connect()
            db_pool[dc.dc_uid]["insp"] = inspect(db_pool[dc.dc_uid]["engine"])
            db_pool[dc.dc_uid]["meta"] = MetaData()
            # db_pool[dc.dc_uid]["engine"].dispose()
            print("create_connection fn calling...... engine created now")
            return True
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=500, detail=err)

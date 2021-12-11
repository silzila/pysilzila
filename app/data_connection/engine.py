from . import schema
from fastapi import HTTPException

# to Test Connection
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# ENV Variables
from .db_libraries import DB_LIBRARIES
from decouple import config
DB_SECRET = config("DB_SECRET")


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

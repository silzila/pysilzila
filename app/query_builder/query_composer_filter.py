# from turtle import st
from ..data_set import schema
from ..data_connection import engine
from .sql_dialect.filter_postgres import get_filter_values_pg
from .sql_dialect.filter_mysql import get_filter_values_mysql
from .sql_dialect.filter_mssql import get_filter_values_mssql

from fastapi import HTTPException


# for populating fields dropped into filter
async def compose_query(req: schema.ColumnFilter, dc_uid: str, ds_uid: str, vendor_name: str):
    req = req.dict()
    # print("request ========", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    table = list(filter(
        lambda obj: obj["id"] == req['table_id'], data_schema["tables"]))[0]
    FROM_TBL = f"{table['schema_name']}.{table['table_name']} AS {table['id']}"

    QUERY = ""
    ####################### Query changes as per dialect ############################
    if vendor_name == 'postgresql':
        QUERY = await get_filter_values_pg(req, FROM_TBL)
    elif vendor_name == 'mysql':
        QUERY = await get_filter_values_mysql(req, FROM_TBL)
    elif vendor_name == 'mssql':
        QUERY = await get_filter_values_mssql(req, FROM_TBL)
    return QUERY

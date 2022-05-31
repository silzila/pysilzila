from ..data_set import schema
from ..data_connection import engine
from .sql_dialect.filter_postgres import get_filter_values_pg
from .sql_dialect.filter_mysql import get_filter_values_mysql
from .sql_dialect.filter_mssql import get_filter_values_mssql

from fastapi import HTTPException


async def compose_query(req: schema.ColumnFilter, dc_uid: str, ds_uid: str, vendor_name: str):
    """for populating fields dropped into filter.
    TODO: implement in next version 
    """
    req = req.dict()
    # print("request ========", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    QUERY = ""
    FROM_TBL = ""
    if req['filter_type'] in ['binary_user_selection', 'text_user_selection', 'number_user_selection',  'number_search', 'date_user_selection', 'date_search']:
        table = list(filter(
            lambda obj: obj["id"] == req['table_id'], data_schema["tables"]))[0]
        FROM_TBL = f"{table['schema_name']}.{table['table_name']} AS {table['id']}"

    # elif req['relative_filter'] is not None and req['relative_filter']['table_id'] and \
    #         req['relative_filter']['field_name'] and req['relative_filter']['data_type']:
    #     table = list(filter(
    #         lambda obj: obj["id"] == req['relative_filter']['table_id'], data_schema["tables"]))[0]
    #     FROM_TBL = f"{table['schema_name']}.{table['table_name']} AS {table['id']}"
    else:
        FROM_TBL = ""
    ####################### Query changes as per dialect ############################
    if vendor_name == 'postgresql':
        QUERY = await get_filter_values_pg(req, FROM_TBL)
    elif vendor_name == 'mysql':
        QUERY = await get_filter_values_mysql(req, FROM_TBL)
    elif vendor_name == 'mssql':
        QUERY = await get_filter_values_mssql(req, FROM_TBL)
    return QUERY


# for getting date of today, yesterday, tomorrow
# used when dropping date, timestamp fields in filter and choose Relative span
# and choose today, yesterday, tomorrow
# if user chooses yesterday and today's date is 2022-12-30 then the API will give 2022-12-29
# async def compose_query_today_date(day: str, dc_uid: str, ds_uid: str, vendor_name: str):

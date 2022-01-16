from . import schema
from ..data_connection import engine

from fastapi import HTTPException


# for populating fields dropped into filter
async def compose_query(req: schema.ColumnFilter, dc_uid: str, ds_uid: str):
    req = req.dict()
    # print("request ========", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    table1 = list(filter(
        lambda obj: obj["id"] == req['table_id'], data_schema["tables"]))[0]
    FROM_TBL = f"{table1['schema_name']}.{table1['table_name']} AS {table1['id']}"
    # get distinct values - text & number fields
    if req['data_type'] in ('text', 'boolean') or (req['data_type']
                                                   in ('integer', 'decimal') and req['filter_type'] == 'select members'):
        _select = f"{req['table_id']}.{req['field_name']}"
        QUERY = f"SELECT DISTINCT \n\t{_select}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"
    # range values - number fields
    elif req['data_type'] in ('integer', 'decimal') and req['filter_type'] == 'select range':
        _min = f"SELECT MIN({req['table_id']}.{req['field_name']}) AS colmn\nFROM\n\t{FROM_TBL}"
        _max = f"SELECT MAX({req['table_id']}.{req['field_name']}) AS colmn\nFROM\n\t{FROM_TBL}"
        QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"
    # get DATE dictinct values
    elif req['data_type'] in ('date', 'timestamp'):
        if req['filter_type'] == 'select members':

            if req['aggr'] == 'year':
                _select = f"EXTRACT(YEAR FROM {req['table_id']}.{req['field_name']})::INTEGER AS colmn"
                QUERY = f"SELECT DISTINCT\n\t{_select}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'month':
                field1 = f"EXTRACT(MONTH FROM {req['table_id']}.{req['field_name']})::INTEGER AS index"
                field2 = f"TRIM(TO_CHAR({req['table_id']}.{req['field_name']}, 'Month')) AS name"
                QUERY = f"SELECT DISTINCT\n\t{field1}, \n\t{field2}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'quarter':
                _select = f"CONCAT('Q', EXTRACT(QUARTER FROM {req['table_id']}.{req['field_name']})::INTEGER) AS colmn"
                QUERY = f"SELECT DISTINCT\n\t{_select}\nFROM\n\t{FROM_TBL}\nORDER BY\n\t1"

            elif req['aggr'] == 'dayofweek':
                field1 = f"EXTRACT(DOW FROM {req['table_id']}.{req['field_name']})::INTEGER +1 AS dayofweek_index"
                field2 = f"TRIM(TO_CHAR({req['table_id']}.{req['field_name']}, 'Day')) AS dayofweek_name"
                QUERY = f"SELECT DISTINCT\n\t{field1}, \n\t{field2}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'day':
                _select = f"EXTRACT(DAY FROM {req['table_id']}.{req['field_name']})::INTEGER AS colmn"
                QUERY = f"SELECT DISTINCT \n\t{_select}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            else:
                raise HTTPException(
                    status_code=400, detail="Aggregation is wrong")

        # get DATE range values
        elif req['filter_type'] == 'select range':
            if req['aggr'] == 'year':
                _col = f"EXTRACT(YEAR FROM {req['table_id']}.{req['field_name']})::INTEGER"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'month':
                _col = f"EXTRACT(MONTH FROM {req['table_id']}.{req['field_name']})::INTEGER"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'quarter':
                _col = f"EXTRACT(QUARTER FROM {req['table_id']}.{req['field_name']})::INTEGER"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'dayofweek':
                _col = f"EXTRACT(DOW FROM {req['table_id']}.{req['field_name']})::INTEGER + 1"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'day':
                _col = f"EXTRACT(DAY FROM {req['table_id']}.{req['field_name']})::INTEGER"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"
            else:
                raise HTTPException(
                    status_code=400, detail="Aggregation is wrong")
        else:
            raise HTTPException(
                status_code=400, detail="Filter Type is wrong")
    else:
        raise HTTPException(
            status_code=400, detail="Data Type or Filter Type is wrong")

    print("\n===============QUERY=========================================")
    print(QUERY)

    return QUERY

from fastapi import HTTPException


async def get_filter_values_mssql(req, FROM_TBL):
    """This function is used to to show filter options when a user drags and drops a field into filter
    req parameter is the request object - contains only one field
    FROM_TBL parameter = schema_name.table_name.column_name as alias_name
    """
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
                _select = f"DATEPART(YEAR, {req['table_id']}.{req['field_name']}) AS colmn"
                QUERY = f"SELECT DISTINCT\n\t{_select}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'month':
                field1 = f"DATEPART(MONTH, {req['table_id']}.{req['field_name']}) AS indx"
                field2 = f"DATENAME(MONTH, {req['table_id']}.{req['field_name']}) AS name"
                QUERY = f"SELECT DISTINCT\n\t{field1}, \n\t{field2}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'quarter':
                field1 = f"DATEPART(QUARTER, {req['table_id']}.{req['field_name']}) AS indx"
                field2 = f"CONCAT('Q', DATENAME(QUARTER, {req['table_id']}.{req['field_name']})) AS name"
                QUERY = f"SELECT DISTINCT\n\t{field1}, \n\t{field2}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'dayofweek':
                field1 = f"DATEPART(WEEKDAY, {req['table_id']}.{req['field_name']}) AS indx"
                field2 = f"DATENAME(WEEKDAY, {req['table_id']}.{req['field_name']}) AS name"
                QUERY = f"SELECT DISTINCT\n\t{field1}, \n\t{field2}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            elif req['aggr'] == 'day':
                _select = f"DATEPART(DAY, {req['table_id']}.{req['field_name']}) AS colmn"
                QUERY = f"SELECT DISTINCT \n\t{_select}\nFROM\n\t{FROM_TBL}\n\nORDER BY\n\t1"

            else:
                raise HTTPException(
                    status_code=400, detail="Aggregation is wrong")

        # get DATE range values
        elif req['filter_type'] == 'select range':
            if req['aggr'] == 'year':
                _col = f"DATEPART(YEAR, {req['table_id']}.{req['field_name']})"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'month':
                _col = f"DATEPART(MONTH, {req['table_id']}.{req['field_name']})"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'quarter':
                _col = f"DATEPART(QUARTER, {req['table_id']}.{req['field_name']})"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'dayofweek':
                _col = f"DATEPART(WEEKDAY, {req['table_id']}.{req['field_name']})"
                _min = f"SELECT MIN({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                _max = f"SELECT MAX({_col}) AS colmn\nFROM\n\t{FROM_TBL}"
                QUERY = f"{_min}\nUNION ALL\n{_max}\nORDER BY\n\t1"

            elif req['aggr'] == 'day':
                _col = f"DATEPART(DAY, {req['table_id']}.{req['field_name']})"
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

    # print("\n===============QUERY=========================================")
    # print(QUERY)

    return QUERY

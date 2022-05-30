from fastapi import HTTPException


async def get_filter_values_pg(req, FROM_TBL):
    """This function is used to to show filter options when a user drags and drops a field into filter.
    req parameter is the request object - contains only one field
    FROM_TBL parameter = schema_name.table_name.column_name as alias_name
    """
    ##############################################
    # get distinct values - binary, text & number fields
    ##############################################
    if req['filter_type'] in ['binary_user_selection', 'text_user_selection', 'number_user_selection']:
        if req['table_id'] and req['field_name'] and req['display_name']:
            if (req['data_type'] in ('text', 'boolean') or (req['data_type'] in ('integer', 'decimal'))):
                _select = f"{req['table_id']}.{req['field_name']}"
                QUERY = f"SELECT DISTINCT {_select} FROM {FROM_TBL} ORDER BY 1"
            else:
                raise HTTPException(
                    status_code=400, detail="User Selection filter - data type is wrong")
        else:
            raise HTTPException(
                status_code=400, detail="User Selection filter - mandatory field is missing")

    ##############################################
    # range values - number fields
    ##############################################
    elif req['filter_type'] == 'number_search':
        if req['table_id'] and req['field_name'] and req['display_name']:
            if req['data_type'] in ('integer', 'decimal'):
                _min = f"SELECT MIN({req['table_id']}.{req['field_name']}) AS colmn FROM {FROM_TBL}"
                _max = f"SELECT MAX({req['table_id']}.{req['field_name']}) AS colmn FROM {FROM_TBL}"
                QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"
            else:
                raise HTTPException(
                    status_code=400, detail="Number Search filter - data type is wrong")
        else:
            raise HTTPException(
                status_code=400, detail="Number Search filter - mandatory field is missing")

    ##############################################
    # DATE - dictinct values & Search
    ##############################################
    elif req['data_type'] in ('date', 'timestamp'):
        ###########################
        # Date - dictinct values
        ###########################
        if req['filter_type'] == 'date_user_selection':
            if req['table_id'] and req['field_name'] and req['display_name'] and req['time_grain']:
                if req['time_grain'] == 'year':
                    _select = f"EXTRACT(YEAR FROM {req['table_id']}.{req['field_name']})::INTEGER AS colmn"
                    QUERY = f"SELECT DISTINCT {_select} FROM {FROM_TBL} ORDER BY 1"

                elif req['time_grain'] == 'quarter':
                    field = f"CONCAT('Q', EXTRACT(QUARTER FROM {req['table_id']}.{req['field_name']})::INTEGER) AS colmn"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"

                elif req['time_grain'] == 'month':
                    field1 = f"EXTRACT(MONTH FROM {req['table_id']}.{req['field_name']})::INTEGER"
                    field2 = f"TRIM(TO_CHAR({req['table_id']}.{req['field_name']}, 'Month'))"
                    QUERY = f"SELECT {field2} AS mnth FROM {FROM_TBL} GROUP BY {field1},{field2} ORDER BY {field1}"

                elif req['time_grain'] == 'yearquarter':
                    field = f"CONCAT(TO_CHAR({req['table_id']}.{req['field_name']}, 'YYYY'), '-Q', TO_CHAR({req['table_id']}.{req['field_name']}, 'Q'))"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"

                elif req['time_grain'] == 'yearmonth':
                    field = f"TO_CHAR({req['table_id']}.{req['field_name']}, 'YYYY-MM')"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"

                elif req['time_grain'] == 'date':
                    field = f"DATE({req['table_id']}.{req['field_name']})"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"
                # in postgres, dayofweek starts from 0. So we add +1 to be consistent across DB
                elif req['time_grain'] == 'dayofweek':
                    field1 = f"EXTRACT(DOW FROM {req['table_id']}.{req['field_name']})::INTEGER +1"
                    field2 = f"TRIM(TO_CHAR({req['table_id']}.{req['field_name']}, 'Day'))"
                    QUERY = f"SELECT {field2} AS dayofweek FROM {FROM_TBL} GROUP BY {field1},{field2} ORDER BY {field1}"

                elif req['time_grain'] == 'dayofmonth':
                    _select = f"EXTRACT(DAY FROM {req['table_id']}.{req['field_name']})::INTEGER AS colmn"
                    QUERY = f"SELECT DISTINCT {_select} FROM {FROM_TBL} ORDER BY 1"

                else:
                    raise HTTPException(
                        status_code=400, detail="Date User Selection - Time Grain is wrong")
            else:
                raise HTTPException(
                    status_code=400, detail="Number Search filter - mandatory field is missing")
        ###########################
        # Date - Search
        ###########################
        elif req['filter_type'] == 'date_search':
            if req['table_id'] and req['field_name'] and req['display_name'] and req['time_grain']:
                if req['time_grain'] == 'year':
                    _col = f"EXTRACT(YEAR FROM {req['table_id']}.{req['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif req['time_grain'] == 'month':
                    _col = f"EXTRACT(MONTH FROM {req['table_id']}.{req['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif req['time_grain'] == 'quarter':
                    _col = f"EXTRACT(QUARTER FROM {req['table_id']}.{req['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif req['time_grain'] == 'date':
                    _col = f"DATE({req['table_id']}.{req['field_name']})"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif req['time_grain'] == 'dayofweek':
                    _col = f"EXTRACT(DOW FROM {req['table_id']}.{req['field_name']})::INTEGER + 1"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif req['time_grain'] == 'dayofmonth':
                    _col = f"EXTRACT(DAY FROM {req['table_id']}.{req['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"
                else:
                    raise HTTPException(
                        status_code=400, detail="Aggregation is wrong")
            else:
                raise HTTPException(
                    status_code=400, detail="Number Search filter - mandatory field is missing")
        else:
            raise HTTPException(
                status_code=400, detail="Date/Timestamp - Fiter type is wrong")
    else:
        raise HTTPException(
            status_code=400, detail="Data Type or Filter Type is wrong")

    # print(" =============== Filter Options QUERY ==================================")
    # print(QUERY)
    return QUERY

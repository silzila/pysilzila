from fastapi import HTTPException


# This function is used to to show filter options when a user drags and drops a field into filter
# req parameter is the request object - contains only one field
# FROM_TBL parameter = schema_name.table_name.column_name as alias_name

async def get_filter_values_pg(req, FROM_TBL):
    ##############################################
    # get distinct values - text & number fields
    ##############################################
    if req['regular_filter'] is not None:
        filter = req['regular_filter']
        if (filter['data_type'] in ('text', 'boolean') or (filter['data_type']
                                                           in ('integer', 'decimal') and filter['filter_type'] == 'pick_from_list')):
            _select = f"{filter['table_id']}.{filter['field_name']}"
            QUERY = f"SELECT DISTINCT {_select} FROM {FROM_TBL} ORDER BY 1"
        ##############################################
        # range values - number fields
        ##############################################
        elif filter['data_type'] in ('integer', 'decimal') and filter['filter_type'] == 'search_condition':
            _min = f"SELECT MIN({filter['table_id']}.{filter['field_name']}) AS colmn FROM {FROM_TBL}"
            _max = f"SELECT MAX({filter['table_id']}.{filter['field_name']}) AS colmn FROM {FROM_TBL}"
            QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

        ##############################################
        # get DATE dictinct values
        ##############################################
        elif filter['data_type'] in ('date', 'timestamp'):
            ###########################
            # dictinct values
            ###########################
            if filter['filter_type'] == 'pick_from_list':
                if filter['time_grain'] == 'year':
                    _select = f"EXTRACT(YEAR FROM {filter['table_id']}.{filter['field_name']})::INTEGER AS colmn"
                    QUERY = f"SELECT DISTINCT {_select} FROM {FROM_TBL} ORDER BY 1"

                elif filter['time_grain'] == 'quarter':
                    field = f"CONCAT('Q', EXTRACT(QUARTER FROM {filter['table_id']}.{filter['field_name']})::INTEGER) AS colmn"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"

                elif filter['time_grain'] == 'month':
                    field1 = f"EXTRACT(MONTH FROM {filter['table_id']}.{filter['field_name']})::INTEGER"
                    field2 = f"TRIM(TO_CHAR({filter['table_id']}.{filter['field_name']}, 'Month'))"
                    QUERY = f"SELECT {field2} AS mnth FROM {FROM_TBL} GROUP BY {field1},{field2} ORDER BY {field1}"

                elif filter['time_grain'] == 'yearquarter':
                    field = f"CONCAT(TO_CHAR({filter['table_id']}.{filter['field_name']}, 'YYYY'), '-Q', TO_CHAR({filter['table_id']}.{filter['field_name']}, 'Q'))"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"

                elif filter['time_grain'] == 'yearmonth':
                    field = f"TO_CHAR({filter['table_id']}.{filter['field_name']}, 'YYYY-MM')"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"

                elif filter['time_grain'] == 'date':
                    field = f"DATE({filter['table_id']}.{filter['field_name']})"
                    QUERY = f"SELECT DISTINCT {field} FROM {FROM_TBL} ORDER BY 1"
                # in postgres, dayofweek starts from 0. So we add +1 to be consistent across DB
                elif filter['time_grain'] == 'dayofweek':
                    field1 = f"EXTRACT(DOW FROM {filter['table_id']}.{filter['field_name']})::INTEGER +1"
                    field2 = f"TRIM(TO_CHAR({filter['table_id']}.{filter['field_name']}, 'Day'))"
                    QUERY = f"SELECT {field2} AS dayofweek FROM {FROM_TBL} GROUP BY {field1},{field2} ORDER BY {field1}"

                elif filter['time_grain'] == 'dayofmonth':
                    _select = f"EXTRACT(DAY FROM {filter['table_id']}.{filter['field_name']})::INTEGER AS colmn"
                    QUERY = f"SELECT DISTINCT {_select} FROM {FROM_TBL} ORDER BY 1"

                else:
                    raise HTTPException(
                        status_code=400, detail="Aggregation is wrong in Date pick from list")

            ###########################
            # range values
            ###########################
            elif filter['filter_type'] == 'search_condition':
                if filter['time_grain'] == 'year':
                    _col = f"EXTRACT(YEAR FROM {filter['table_id']}.{filter['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif filter['time_grain'] == 'month':
                    _col = f"EXTRACT(MONTH FROM {filter['table_id']}.{filter['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif filter['time_grain'] == 'quarter':
                    _col = f"EXTRACT(QUARTER FROM {filter['table_id']}.{filter['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif filter['time_grain'] == 'date':
                    _col = f"DATE({filter['table_id']}.{filter['field_name']})"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif filter['time_grain'] == 'dayofweek':
                    _col = f"EXTRACT(DOW FROM {filter['table_id']}.{filter['field_name']})::INTEGER + 1"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"

                elif filter['time_grain'] == 'dayofmonth':
                    _col = f"EXTRACT(DAY FROM {filter['table_id']}.{filter['field_name']})::INTEGER"
                    _min = f"SELECT MIN({_col}) AS colmn FROM {FROM_TBL}"
                    _max = f"SELECT MAX({_col}) AS colmn FROM {FROM_TBL}"
                    QUERY = f"{_min} UNION ALL {_max} ORDER BY 1"
                else:
                    raise HTTPException(
                        status_code=400, detail="Aggregation is wrong")

    else:
        raise HTTPException(
            status_code=400, detail="Data Type or Filter Type is wrong")

    print(" ===============QUERY=========================================")
    print(QUERY)

    return QUERY

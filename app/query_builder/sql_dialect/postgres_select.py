def build_select_clause(req: list, select_dim_list: list) -> str:
    SELECT = ""
    _select = []
    # select_dim_list = []
    select_meas_list = []
    for val in req["dims"]:
        if val['data_type'] in ('text', 'boolean', 'integer', 'decimal'):
            field_string = f"{val['table_id']}.{val['field_name']}"
            select_dim_list.append(field_string)
        elif val['data_type'] in ('date', 'timestamp'):
            if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                # four digit year -> 1998
                if val['aggr'] == 'year':
                    field_string = f"EXTRACT(YEAR FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}_year"
                    select_dim_list.append(field_string)
                # month name -> August
                if val['aggr'] == 'month':
                    field_string1 = f"EXTRACT(MONTH FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}_month_index"
                    field_string2 = f"TRIM(TO_CHAR({val['table_id']}.{val['field_name']}, 'Month')) AS {val['field_name']}_month"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # quarter name -> Q3
                elif val['aggr'] == 'quarter':
                    field_string1 = f"EXTRACT(QUARTER FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}_quarter_index"
                    field_string2 = f"CONCAT('Q', EXTRACT(QUARTER FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}_quarter"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # day Name -> Wednesday
                elif val['aggr'] == 'dayofweek':
                    field_string1 = f"EXTRACT(DOW FROM {val['table_id']}.{val['field_name']})::INTEGER +1 AS {val['field_name']}_dayofweek_index"
                    field_string2 = f"TRIM(TO_CHAR({val['table_id']}.{val['field_name']}, 'Day')) AS {val['field_name']}_dayofweek"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # day of month -> 31
                elif val['aggr'] == 'day':
                    field_string = f"EXTRACT(DAY FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}_day"
                    select_dim_list.append(field_string)

    _select.extend(select_dim_list)

    for val in req["measures"]:
        if val['data_type'] in ('text'):
            field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}_count"
            select_meas_list.append(field_string)
        elif val['data_type'] in ('date', 'timestamp'):
            if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                # four digit year -> 1998
                if val['aggr'] == 'year':
                    field_string = f"COUNT(EXTRACT(YEAR FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}_year_count"
                    select_meas_list.append(field_string)
                # month number -> 12
                if val['aggr'] == 'month':
                    field_string = f"COUNT(EXTRACT(MONTH FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}_month_count"
                    select_meas_list.append(field_string)
                # quarter name -> 3
                elif val['aggr'] == 'quarter':
                    field_string = f"COUNT(EXTRACT(QUARTER FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}_quarter_count"
                    select_meas_list.append(field_string)
                # day Name -> 7
                elif val['aggr'] == 'dayofweek':
                    field_string = f"COUNT(EXTRACT(DOW FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}_dayofweek_count"
                    select_meas_list.append(field_string)
                # day of month -> 31
                elif val['aggr'] == 'day':
                    field_string = f"COUNT(EXTRACT(DAY FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}_day_count"
                    select_meas_list.append(field_string)
        elif val['data_type'] in ('integer', 'decimal'):
            aggrn = 'sum'
            if val['aggr'] in ('min', 'max', 'avg'):
                aggrn = val['aggr']
            field_string = f"{aggrn.upper()}({val['table_id']}.{val['field_name']}) AS {val['field_name']}_{aggrn}"
            select_meas_list.append(field_string)

    _select.extend(select_meas_list)

    SELECT = "\n\t" + ",\n\t".join(_select)
    # print(_select)
    print("dim selection ***** \n", select_dim_list)
    print("meas selection ***** \n", select_meas_list)
    print(SELECT)
    return SELECT

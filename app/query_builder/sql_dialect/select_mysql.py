def build_select_clause(req: list, select_dim_list: list) -> str:
    SELECT = ""  # holds final select clause string
    _select = []  # holds individual select column as list
    select_meas_list = []
    # iterating List of Dimension Fields
    for val in req["dims"]:
        # for non Date fields, Keep column as is
        if val['data_type'] in ('text', 'boolean', 'integer', 'decimal'):
            field_string = f"{val['table_id']}.{val['field_name']}"
            select_dim_list.append(field_string)
        # for date fields, need to Parse as year, month, etc.. to aggreate
        elif val['data_type'] in ('date', 'timestamp'):
            if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                # four digit year -> 1998
                if val['aggr'] == 'year':
                    field_string = f"YEAR({val['table_id']}.{val['field_name']}) AS {val['field_name']}_year"
                    select_dim_list.append(field_string)
                # month name -> August
                # for month, also give month number for column sorting
                if val['aggr'] == 'month':
                    field_string1 = f"MONTH({val['table_id']}.{val['field_name']}) AS {val['field_name']}_month_index"
                    field_string2 = f"MONTHNAME({val['table_id']}.{val['field_name']}) AS {val['field_name']}_month"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # quarter name -> Q3
                # for quarter, also give quarter number for column sorting
                elif val['aggr'] == 'quarter':
                    field_string1 = f"QUARTER({val['table_id']}.{val['field_name']}) AS {val['field_name']}_quarter_index"
                    field_string2 = f"CONCAT('Q', QUARTER({val['table_id']}.{val['field_name']})) AS {val['field_name']}_quarter"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # day Name -> Wednesday
                # for day of week, also give day of week number for column sorting
                elif val['aggr'] == 'dayofweek':
                    field_string1 = f"DAYOFWEEK({val['table_id']}.{val['field_name']}) AS {val['field_name']}_dayofweek_index"
                    field_string2 = f"DAYNAME({val['table_id']}.{val['field_name']}) AS {val['field_name']}_dayofweek"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # day of month -> 31
                elif val['aggr'] == 'day':
                    field_string = f"DAYOFMONTH({val['table_id']}.{val['field_name']}) AS {val['field_name']}_day"
                    select_dim_list.append(field_string)

    _select.extend(select_dim_list)
    # iterating List of Measure Fields
    for val in req["measures"]:
        # if text or boolean field in measure then just count the field
        if val['data_type'] in ('text', 'boolean'):
            field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}_count"
            select_meas_list.append(field_string)
        # for date fields, parse to year, month, etc.. and then COUNT the field
        # FUTURE WORK, add min, max to date fields
        elif val['data_type'] in ('date', 'timestamp'):
            if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                # four digit year -> 1998
                if val['aggr'] == 'year':
                    field_string = f"YEAR({val['table_id']}.{val['field_name']}) AS {val['field_name']}_year_count"
                    select_meas_list.append(field_string)
                # month number -> 12
                if val['aggr'] == 'month':
                    field_string = f"MONTH({val['table_id']}.{val['field_name']}) AS {val['field_name']}_month_count"
                    select_meas_list.append(field_string)
                # quarter name -> 3
                elif val['aggr'] == 'quarter':
                    field_string = f"QUARTER({val['table_id']}.{val['field_name']}) AS {val['field_name']}_quarter_count"
                    select_meas_list.append(field_string)
                # day Name -> 7
                elif val['aggr'] == 'dayofweek':
                    field_string = f"DAYOFWEEK({val['table_id']}.{val['field_name']}) AS {val['field_name']}_dayofweek_count"
                    select_meas_list.append(field_string)
                # day of month -> 31
                elif val['aggr'] == 'day':
                    field_string = f"DAYOFMONTH({val['table_id']}.{val['field_name']}) AS {val['field_name']}_day_count"
                    select_meas_list.append(field_string)
        # for number fields, do aggregationd
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

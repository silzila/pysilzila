from fastapi.exceptions import HTTPException

# to get respective function parameter for time_grain api call
period_dict = {
    'year': 'YEAR',
    'month': 'MONTH',
    'quarter': 'QUARTER',
    'date': 'DATE',
    'dayofweek': 'DAYOFWEEK',
    'dayofmonth': 'DAY'
}


def build_select_clause(req: list, select_dim_list: list, group_by_dim_list: list, order_by_dim_list: list) -> str:
    """SELECT clause for MySQL dialect
    """
    SELECT = ""  # holds final select clause string
    _select = []  # holds individual select column as list
    select_meas_list = []
    ###########################################################
    ############## iterating List of Dimension Fields #########
    ###########################################################
    for val in req["dims"]:
        # for non Date fields, Keep column as is
        if val['data_type'] in ('text', 'boolean', 'integer', 'decimal'):
            field_string = f"{val['table_id']}.{val['field_name']}"
            alias = f"{val['field_name']}"
            select_dim_list.append(f"{field_string} AS {alias}")
            group_by_dim_list.append(field_string)
            order_by_dim_list.append(field_string)

        # for date fields, need to Parse as year, month, etc.. to aggreate
        elif val['data_type'] in ('date', 'timestamp'):
            # time grain is needed for date/time formats
            # even when data_type key is not sent, it comes as {data_type: None}
            if val['time_grain'] is not None:
                ## checking ('year', 'quarter', 'month', 'yearmonth', 'yearquarter', 'dayofweek', 'date', 'dayofmonth')
                # year -> 2015
                if val['time_grain'] == 'year':
                    field_string = f"YEAR({val['table_id']}.{val['field_name']})"
                    alias = f"{val['field_name']}__year"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string)
                # quarter name -> Q3
                elif val['time_grain'] == 'quarter':
                    field_string = f"CONCAT('Q', QUARTER({val['table_id']}.{val['field_name']}))"
                    alias = f"{val['field_name']}__quarter"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string)
                # month name -> August
                # for month, also give month number for column sorting
                # which should be available in group by list but not in select list
                elif val['time_grain'] == 'month':
                    field_string_sort = f"MONTH({val['table_id']}.{val['field_name']})"
                    field_string = f"MONTHNAME({val['table_id']}.{val['field_name']})"
                    # alias for sorting column is not needed as it is used in GROUP BY only
                    alias = f"{val['field_name']}__month"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string_sort)
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string_sort)
                # yearquarter name -> 2015-Q3
                elif val['time_grain'] == 'yearquarter':
                    field_string = f"CONCAT(YEAR({val['table_id']}.{val['field_name']}), '-Q', QUARTER({val['table_id']}.{val['field_name']}))"
                    alias = f"{val['field_name']}__yearquarter"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string)
               # yearmonth name -> 2015-08
                elif val['time_grain'] == 'yearmonth':
                    # python is interpreting the % as a printf-like format character. Try using %%
                    field_string = f"DATE_FORMAT({val['table_id']}.{val['field_name']}, '%%Y-%%m')"
                    alias = f"{val['field_name']}__yearmonth"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string)
                # date -> 2021-08-31
                elif val['time_grain'] == 'date':
                    field_string = f"DATE({val['table_id']}.{val['field_name']})"
                    alias = f"{val['field_name']}__date"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string)
                # day Name -> Wednesday
                # for day of week, also give day of week number for column sorting
                # which should be available in group by list but not in select list
                elif val['time_grain'] == 'dayofweek':
                    field_string_sort = f"DAYOFWEEK({val['table_id']}.{val['field_name']})"
                    field_string = f"DAYNAME({val['table_id']}.{val['field_name']})"
                    # alias for sorting column is not needed as it is used in GROUP BY only
                    alias = f"{val['field_name']}__dayofweek"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string_sort)
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string_sort)
                # day of month -> 31
                elif val['time_grain'] == 'dayofmonth':
                    field_string = f"DAY({val['table_id']}.{val['field_name']})"
                    alias = f"{val['field_name']}__dayofmonth"
                    select_dim_list.append(f"{field_string} AS {alias}")
                    group_by_dim_list.append(field_string)
                    order_by_dim_list.append(field_string)
            else:
                raise HTTPException(
                    status_code=422, detail=f"Time Grain key/value is missing for dimension {val['display_name']}")
    # adding dim columns to select list
    _select.extend(select_dim_list)

    ###########################################################
    ############## iterating List of Measure Fields ###########
    ###########################################################
    for val in req["measures"]:
        # if text or boolean field in measure then use Text Aggregation Methods like COUNT
        if val['data_type'] in ('text', 'boolean'):
            # checking ('count', 'countnn', 'countn', 'countu')
            if val['aggr'] == 'count':
                field_string = f"COUNT(*) AS {val['field_name']}__count"
            elif val['aggr'] == 'countnn':
                field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnn"
            elif val['aggr'] == 'countu':
                field_string = f"COUNT(DISTINCT {val['table_id']}.{val['field_name']}) AS {val['field_name']}__countu"
            elif val['aggr'] == 'countn':
                field_string = f"SUM(CASE WHEN {val['table_id']}.{val['field_name']} IS NULL THEN 1 ELSE 0 END) AS {val['field_name']}__countn"
            else:
                raise HTTPException(
                    status_code=422, detail=f"Aggregation is not correct for measure {val['display_name']}")
            select_meas_list.append(field_string)

        # for date fields, parse to year, month, etc.. and then aggregate the field for Min & Max only
        elif val['data_type'] in ('date', 'timestamp'):
            # checking ('min', 'max', 'count', 'countnn', 'countn', 'countu')
            # checking ('year', 'quarter', 'month', 'yearmonth', 'yearquarter', 'dayofmonth')
            if val['aggr'] in ('min', 'max') and val['time_grain'] in ('year', 'quarter', 'month', 'dayofmonth', 'date', 'dayofweek'):
                field_string = f"{val['aggr'].upper()}({period_dict[val['time_grain']]}({val['table_id']}.{val['field_name']})) AS {val['field_name']}__{val['time_grain']}_{val['aggr']}"

            # countu is a special case & we can use time grain
            elif val['aggr'] == 'countu' and val['time_grain'] in ('year', 'quarter', 'month', 'dayofmonth', 'date', 'dayofweek'):
                field_string = f"COUNT(DISTINCT({period_dict[val['time_grain']]}({val['table_id']}.{val['field_name']}))) AS {val['field_name']}__{val['time_grain']}_{val['aggr']}"

            # no time grain for count & it's variants
            elif val['aggr'] == 'count':
                field_string = f"COUNT(*) AS {val['field_name']}__{val['time_grain']}_count"
            elif val['aggr'] == 'countnn':
                field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}__{val['time_grain']}_countnn"
            elif val['aggr'] == 'countn':
                field_string = f"SUM(CASE WHEN {val['table_id']}.{val['field_name']} IS NULL THEN 1 ELSE 0 END) AS {val['field_name']}__{val['time_grain']}_countn"
            else:
                raise HTTPException(
                    status_code=422, detail=f"Aggregation/Grain is not correct for date/time field {val['display_name']}")
            select_meas_list.append(field_string)

        # for number fields, do aggregation
        elif val['data_type'] in ('integer', 'decimal'):
            if val['aggr'] in ('sum', 'avg', 'min', 'max'):
                field_string = f"{val['aggr'].upper()}({val['table_id']}.{val['field_name']}) AS {val['field_name']}__{val['aggr']}"
            elif val['aggr'] == 'count':
                field_string = f"COUNT(*) AS {val['field_name']}__count"
            elif val['aggr'] == 'countnn':
                field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnn"
            elif val['aggr'] == 'countu':
                field_string = f"COUNT(DISTINCT {val['table_id']}.{val['field_name']}) AS {val['field_name']}__countu"
            elif val['aggr'] == 'countn':
                field_string = f"SUM(CASE WHEN {val['table_id']}.{val['field_name']} IS NULL THEN 1 ELSE 0 END) AS {val['field_name']}__countn"
            else:
                raise HTTPException(
                    status_code=422, detail=f"Aggregation is not correct for number field {val['display_name']}")
            select_meas_list.append(field_string)

    _select.extend(select_meas_list)

    SELECT = "\n\t" + ",\n\t".join(_select)
    # print(_select)
    # print("dim selection ***** \n", select_dim_list)
    # print("meas selection ***** \n", select_meas_list)
    # print(SELECT)
    return SELECT

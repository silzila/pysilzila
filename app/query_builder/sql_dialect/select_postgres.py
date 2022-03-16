from fastapi.exceptions import HTTPException

# to get respective function parameter for time_grain api call
period_dict = {
    'year': 'YEAR',
    'month': 'MONTH',
    'quarter': 'QUARTER',
    'dayofweek': 'DOW',
    'day': 'DAY'
}


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
            # time grain is needed for date/time formats
            # even when data_type key is not sent, it comes as {data_type: None}
            if val['time_grain'] is not None:
                ## checking ('year', 'month', 'quarter', 'dayofweek', 'day')
                # year -> 2015
                if val['time_grain'] == 'year':
                    field_string = f"EXTRACT(YEAR FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}__year"
                    select_dim_list.append(field_string)
                # month name -> August
                # for month, also give month number for column sorting
                elif val['time_grain'] == 'month':
                    field_string1 = f"EXTRACT(MONTH FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}__month_index"
                    field_string2 = f"TRIM(TO_CHAR({val['table_id']}.{val['field_name']}, 'Month')) AS {val['field_name']}__month"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # quarter name -> Q3
                # for quarter, also give quarter number for column sorting
                elif val['time_grain'] == 'quarter':
                    field_string1 = f"EXTRACT(QUARTER FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}__quarter_index"
                    field_string2 = f"CONCAT('Q', EXTRACT(QUARTER FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}__quarter"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # day Name -> Wednesday
                # for day of week, also give day of week number for column sorting
                elif val['time_grain'] == 'dayofweek':
                    field_string1 = f"EXTRACT(DOW FROM {val['table_id']}.{val['field_name']})::INTEGER +1 AS {val['field_name']}__dayofweek_index"
                    field_string2 = f"TRIM(TO_CHAR({val['table_id']}.{val['field_name']}, 'Day')) AS {val['field_name']}__dayofweek"
                    select_dim_list.append(field_string1)
                    select_dim_list.append(field_string2)
                # day of month -> 31
                elif val['time_grain'] == 'day':
                    field_string = f"EXTRACT(DAY FROM {val['table_id']}.{val['field_name']})::INTEGER AS {val['field_name']}__day"
                    select_dim_list.append(field_string)
            else:
                raise HTTPException(
                    status_code=422, detail=f"Time Grain key/value is missing for dimension {val['display_name']}")
    _select.extend(select_dim_list)

    # iterating List of Measure Fields
    for val in req["measures"]:
        # if text or boolean field in measure then use Text Aggregation Methods like COUNT
        if val['data_type'] in ('text', 'boolean'):
            # checking ('count', 'countnonnull', 'countnull', 'countunique')
            if val['aggr'] == 'count':
                field_string = f"COUNT(*) AS {val['field_name']}__count"
            elif val['aggr'] == 'countnonnull':
                field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnonnull"
            elif val['aggr'] == 'countunique':
                field_string = f"COUNT(DISTINCT {val['table_id']}.{val['field_name']}) AS {val['field_name']}__countunique"
            elif val['aggr'] == 'countnull':
                field_string = f"SUM(CASE WHEN {val['table_id']}.{val['field_name']} IS NULL THEN 1 ELSE 0 END) AS {val['field_name']}__countnull"
            else:
                raise HTTPException(
                    status_code=422, detail=f"Aggregation is not correct for measure {val['display_name']}")
            select_meas_list.append(field_string)

        # for date fields, parse to year, month, etc.. and then aggregate the field for Min & Max only
        elif val['data_type'] in ('date', 'timestamp'):
            # checking ('min', 'max', 'count', 'countnonnull', 'countnull', 'countunique')
            # checking ('year', 'month', 'quarter', 'dayofweek', 'day')
            if val['aggr'] in ('min', 'max') and val['time_grain'] in ('year', 'month', 'quarter', 'day'):
                field_string = f"{val['aggr'].upper()}(EXTRACT({period_dict[val['time_grain']]} FROM {val['table_id']}.{val['field_name']})::INTEGER) AS {val['field_name']}__{val['time_grain']}_{val['aggr']}"
            # in postgres, dayofweek starts at 0 not 1, so need to add 1 to the function
            elif val['aggr'] in ('min', 'max') and val['time_grain'] == 'dayofweek':
                field_string = f"{val['aggr'].upper()}(EXTRACT({period_dict[val['time_grain']]} FROM {val['table_id']}.{val['field_name']})::INTEGER) + 1 AS {val['field_name']}__{val['time_grain']}_{val['aggr']}"
            # no time grain for count & it's variants
            elif val['aggr'] == 'count':
                field_string = f"COUNT(*) AS {val['field_name']}__count"
            elif val['aggr'] == 'countnonnull':
                field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnonnull"
            elif val['aggr'] == 'countunique':
                field_string = f"COUNT(DISTINCT {val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnonunique"
            elif val['aggr'] == 'countnull':
                field_string = f"SUM(CASE WHEN {val['table_id']}.{val['field_name']} IS NULL THEN 1 ELSE 0 END) AS {val['field_name']}__countnull"
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
            elif val['aggr'] == 'countnonnull':
                field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnonnull"
            elif val['aggr'] == 'countunique':
                field_string = f"COUNT(DISTINCT {val['table_id']}.{val['field_name']}) AS {val['field_name']}__countnonunique"
            elif val['aggr'] == 'countnull':
                field_string = f"SUM(CASE WHEN {val['table_id']}.{val['field_name']} IS NULL THEN 1 ELSE 0 END) AS {val['field_name']}__countnull"
            else:
                raise HTTPException(
                    status_code=422, detail=f"Aggregation is not correct for number field {val['display_name']}")
            select_meas_list.append(field_string)

    _select.extend(select_meas_list)

    SELECT = "\n\t" + ",\n\t".join(_select)
    # print(_select)
    print("dim selection ***** \n", select_dim_list)
    print("meas selection ***** \n", select_meas_list)
    print(SELECT)
    return SELECT

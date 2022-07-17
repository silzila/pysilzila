from .helper_function import comparison_operator_name_to_symbol
number_search_conditions = ('greater_than', 'less_than', 'greater_than_or_equal_to',
                            'less_than_or_equal_to', 'equal_to', 'not_equal_to', 'between')
text_search_conditions = ('begins_with', 'ends_with', 'contains')

# to get respective function parameter for time_grain api call
period_dict_postgres = {
    'year': 'YEAR',
    'month': 'MONTH',
    'quarter': 'QUARTER',
    'dayofweek': 'DOW',
    'dayofmonth': 'DAY'
}

# to get respective function parameter for time_grain api call
period_dict_mysql = {
    'year': 'YEAR',
    'quarter': 'QUARTER',
    'month': 'MONTHNAME',
    'date': 'DATE',
    'dayofweek': 'DAYOFWEEK',
    'dayofmonth': 'DAY'
}

# to get respective function parameter for time_grain api call
period_dict_numeric_mysql = {
    'year': 'YEAR',
    'quarter': 'QUARTER',
    'month': 'MONTH',
    'date': 'DATE',
    'dayofweek': 'DAYOFWEEK',
    'dayofmonth': 'DAY'
}

# to get respective function parameter for time_grain api call
period_dict_mssql = {
    'year': 'YEAR',
    'quarter': 'QUARTER',
    'month': 'MONTH',
    'date': 'DATE',
    'dayofweek': 'WEEKDAY',
    'dayofmonth': 'DAY'
}


# check if Negative match or Positive match
def make_exclude_operator(exclude_flag: bool, user_selection: list) -> str:
    _exclude = ""
    if exclude_flag == True:
        # a. exclude single value, eg. city != 'Paris'
        if len(user_selection) == 1:
            _exclude = "!"
        # b. exclude multiple values, eg. city NOT IN ('Paris', 'Chennai')
        elif len(user_selection) > 1:
            _exclude = "NOT"
    return _exclude


def make_exclude_string(exclude_flag: bool) -> str:
    _exclude = ""
    if exclude_flag == True:
        _exclude = "NOT "
    else:
        _exclude = ""
    return _exclude


def build_where_clause(filter_list: list, vendor_name: str) -> str:
    """function to construct where clause of query.

    Where clause is optional in query, meaning there may be Query without Where condition
    in Query, "WHERE" key word should be kept only if there is Where condition expression
    Dialect specific and each dialect is handled as separate sections below
    """
    print("filter list ==========", filter_list)

    WHERE = ""  # holds final where clause string
    _where = []  # holds individual condition as list

    for val in filter_list[0]['filters']:

        # 1. DIRECT MATCH filter, eg. city = 'Paris',  sales = 210.5
        if val['filter_type'] in ('text_user_selection' 'number_user_selection') and val['data_type'] in ('text', 'integer', 'decimal', 'boolean'):
            # check if Negative match or Positive match
            _exclude = make_exclude_operator(
                val['exclude'], val['user_selection'])
            # if val['exclude'] == True:
            #     # a. exclude single value, eg. city != 'Paris'
            #     if len(val['user_selection']) == 1:
            #         _exclude = "!"
            #     # b. exclude multiple values, eg. city NOT IN ('Paris', 'Chennai')
            #     elif len(val['user_selection']) > 1:
            #         _exclude = "NOT"

            # a. match single value, eg. city = 'Paris'
            if len(val['user_selection']) == 1:
                if val['data_type'] in ('text'):
                    where = f"{val['table_id']}.{val['field_name']} {_exclude}= '{val['user_selection'][0]}'"
                elif val['data_type'] in ('integer', 'decimal', 'boolean'):
                    where = f"{val['table_id']}.{val['field_name']} {_exclude}= {val['user_selection'][0]}"
            # b. match multiple values, eg. city IN ('Paris', 'Chennai')
            elif len(val['user_selection']) > 1:
                # for text fields, enclose filter members with quote, for numbers don't
                if val['data_type'] in ('text'):
                    _options = ["'" + opt +
                                "'" for opt in val['user_selection']]
                elif val['data_type'] in ('integer', 'decimal', 'boolean'):
                    _options = val['user_selection']
                where = f"{val['table_id']}.{val['field_name']} {_exclude} IN ({', '.join(map(str,_options))})"

        # for expressions, eg.sales > 1000, age between 10 and 20
        elif val['filter_type'] == 'number_search' and val['data_type'] in ('integer', 'decimal') and val['condition'] in number_search_conditions:
            # check if Negative match or Positive match
            _exclude = make_exclude_string(val['exclude'])

            # a. range expression condition
            if val['condition'] == 'between':
                where = f"{_exclude}{val['table_id']}.{val['field_name']} BETWEEN {val['user_selection'][0]} AND {val['user_selection'][1]}"
            # b. sinlge (expression) condition
            elif val['condition'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to'):
                EXPRSN = comparison_operator_name_to_symbol(val['condition'])
                where = f"{_exclude}{val['table_id']}.{val['field_name']} {EXPRSN} {val['user_selection'][0]}"

        # for expressions, eg. product_name like 'Computer%'
        elif val['filter_type'] == 'text_search' and val['data_type'] == 'text' and val['condition'] in text_search_conditions:
            # check if Negative match or Positive match
            _exclude = make_exclude_string(val['exclude'])

            # a. wildcard match
            if val['condition'] == 'contains':
                where = f"{_exclude}{val['table_id']}.{val['field_name']} LIKE '%%{val['user_selection'][0]}%%'"
            # b. match the starting letter(s)
            if val['condition'] == 'begins_with':
                where = f"{_exclude}{val['table_id']}.{val['field_name']} LIKE '{val['user_selection'][0]}%%'"
            # b. match the ending letter(s)
            if val['condition'] == 'ends_with':
                where = f"{_exclude}{val['table_id']}.{val['field_name']} LIKE '%%{val['user_selection'][0]}'"

        # for date data types
        # Direct Match & Expressions, eg. MONTH(order_date) IN (1,3,6), YEAR(order_date) > 2015
        # different Dialects needs different functons for date data types
        elif val['data_type'] in ('date', 'timestamp'):
            #####################################################################
            ############################ POSTGRESQL #############################
            #####################################################################
            if vendor_name == 'postgresql':
                # a. Direct Matcheg. month(order_date) IN (1,3,6)
                if val['filter_type'] == 'date_user_selection':
                    if val['time_grain'] in ('year', 'quarter', 'month', 'yearquarter', 'yearmonth', 'date', 'dayofmonth', 'dayofweek'):
                        if val['time_grain'] == 'year':
                            field_string = f"EXTRACT(YEAR FROM {val['table_id']}.{val['field_name']})::INTEGER"
                        elif val['time_grain'] == 'quarter':
                            field_string = f"CONCAT('Q', EXTRACT(QUARTER FROM {val['table_id']}.{val['field_name']})::INTEGER)"
                        elif val['time_grain'] == 'month':
                            field_string = f"TRIM(TO_CHAR({val['table_id']}.{val['field_name']}, 'Month'))"
                        elif val['time_grain'] == 'yearquarter':
                            field_string = f"CONCAT(TO_CHAR({val['table_id']}.{val['field_name']}, 'YYYY'), '-Q', TO_CHAR({val['table_id']}.{val['field_name']}, 'Q'))"
                        elif val['time_grain'] == 'yearmonth':
                            field_string = f"TO_CHAR({val['table_id']}.{val['field_name']}, 'YYYY-MM')"
                        elif val['time_grain'] == 'date':
                            field_string = f"DATE({val['table_id']}.{val['field_name']})"
                        elif val['time_grain'] == 'dayofweek':
                            field_string = f"TRIM(TO_CHAR({val['table_id']}.{val['field_name']}, 'Day'))"
                        elif val['time_grain'] == 'dayofmonth':
                            field_string = f"EXTRACT(DAY FROM {val['table_id']}.{val['field_name']})::INTEGER"

                        _exclude = make_exclude_operator(
                            val['exclude'], val['user_selection'])

                        if len(val['user_selection']) == 1:
                            where = f"{field_string} {_exclude}= '{val['user_selection'][0]}'"
                        elif len(val['user_selection']) > 1:
                            _options = "', '".join(
                                map(str, val['user_selection']))
                            where = f"{field_string} {_exclude} IN ('{_options}')"

                # b. Expressions, eg. YEAR(order_date) > 2015, YEAR(order_date) BETWEEN 2015 AND 2020
                elif val['filter_type'] == 'date_search':
                    # get user input as string
                    if len(val['user_selection']) == 1:
                        _options = f"'{val['user_selection'][0]}'"
                    elif len(val['user_selection']) > 1:
                        _options = "', '".join(
                            map(str, val['user_selection']))

                    _exclude = make_exclude_string(val['exclude'])

                    # this code is simplified, so not needed.
                    # # range expression condition
                    # if val['condition'] == 'between':
                    #     if val['time_grain'] in ('year', 'quarter', 'month', 'dayofmonth'):
                    #         where = f"{_exclude}(EXTRACT({period_dict_postgres[val['time_grain']]} FROM {val['table_id']}.{val['field_name']})::INTEGER) BETWEEN {val['user_selection'][0]} AND {val['user_selection'][1]}"
                    #     elif val['time_grain'] == 'date':
                    #         where = f"{_exclude}DATE({val['table_id']}.{val['field_name']}) BETWEEN '{val['user_selection'][0]}' AND '{val['user_selection'][1]}'"
                    #     # In postgres, dayofweek starts at 0 not 1, so need to add 1 to the function
                    #     elif val['time_grain'] == 'dayofweek':
                    #         where = f"{_exclude}(EXTRACT(DOW FROM {val['table_id']}.{val['field_name']})::INTEGER) + 1 BETWEEN {val['user_selection'][0]} AND {val['user_selection'][1]}"

                    # # single (expresssion) condition
                    # elif val['condition'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to'):
                    #     EXPRSN = comparison_operator_name_to_symbol(
                    #         val['condition'])

                    #     if val['time_grain'] in ('year', 'quarter', 'month', 'dayofmonth'):
                    #         where = f"{_exclude}(EXTRACT({period_dict_postgres[val['time_grain']]} FROM {val['table_id']}.{val['field_name']})::INTEGER) {EXPRSN} {val['user_selection'][0]}"
                    #     elif val['time_grain'] == 'date':
                    #         where = f"{_exclude}DATE({val['table_id']}.{val['field_name']}) {EXPRSN} '{val['user_selection'][0]}'"
                    #     # In postgres, dayofweek starts at 0 not 1, so need to add 1 to the function
                    #     elif val['time_grain'] == 'dayofweek':
                    #         where = f"{_exclude}(EXTRACT(DOW FROM {val['table_id']}.{val['field_name']})::INTEGER) + 1 {EXPRSN} {val['user_selection'][0]}"

                    if val['time_grain'] in ('year', 'quarter', 'month', 'dayofmonth'):
                        field_string = f"{_exclude}(EXTRACT({period_dict_postgres[val['time_grain']]} FROM {val['table_id']}.{val['field_name']})::INTEGER)"
                    elif val['time_grain'] == 'date':
                        field_string = f"{_exclude}DATE({val['table_id']}.{val['field_name']})"
                    # In postgres, dayofweek starts at 0 not 1, so need to add 1 to the function
                    elif val['time_grain'] == 'dayofweek':
                        field_string = f"{_exclude}(EXTRACT(DOW FROM {val['table_id']}.{val['field_name']})::INTEGER) + 1"

                    # range expression condition
                    if val['condition'] == 'between':
                        where = f"{_exclude}{field_string} BETWEEN '{val['user_selection'][0]}' AND '{val['user_selection'][1]}'"

                    # single (expresssion) condition
                    elif val['condition'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to'):
                        EXPRSN = comparison_operator_name_to_symbol(
                            val['condition'])
                        where = f"{_exclude}{field_string} {EXPRSN} '{val['user_selection'][0]}'"

            #####################################################################
            ############################    MYSQL   #############################
            #####################################################################
            elif vendor_name == 'mysql':
                # a. Direct Matcheg. month(order_date) IN (1,3,6)
                if val['filter_type'] == 'date_user_selection':
                    _exclude = make_exclude_string(val['exclude'])

                    if val['time_grain'] in ('year', 'month', 'date', 'dayofmonth', 'dayofweek'):
                        field_string = f"{period_dict_mysql[val['time_grain']]}({val['table_id']}.{val['field_name']})"
                    elif val['time_grain'] == 'quarter':
                        field_string = f"CONCAT('Q', QUARTER({val['table_id']}.{val['field_name']}))"
                    elif val['time_grain'] == 'yearquarter':
                        field_string = f"CONCAT(YEAR({val['table_id']}.{val['field_name']}), '-Q', QUARTER({val['table_id']}.{val['field_name']}))"
                    elif val['time_grain'] == 'yearmonth':
                        field_string = f"DATE_FORMAT({val['table_id']}.{val['field_name']}, '%%Y-%%m')"

                    _exclude = make_exclude_operator(
                        val['exclude'], val['user_selection'])

                    if len(val['user_selection']) == 1:
                        where = f"{field_string} {_exclude}= '{val['user_selection'][0]}'"
                    elif len(val['user_selection']) > 1:
                        _options = "', '".join(
                            map(str, val['user_selection']))
                        where = f"{field_string} {_exclude} IN ('{_options}')"

                # b. Expressions, eg. YEAR(order_date) > 2015, YEAR(order_date) BETWEEN 2015 AND 2020
                elif val['filter_type'] == 'date_search':

                    # get user input as string
                    if len(val['user_selection']) == 1:
                        _options = f"'{val['user_selection'][0]}'"
                    elif len(val['user_selection']) > 1:
                        _options = "', '".join(
                            map(str, val['user_selection']))

                    _exclude = make_exclude_string(val['exclude'])

                    if val['time_grain'] in ('year', 'quarter', 'month', 'date', 'dayofmonth', 'dayofweek'):
                        field_string = f"{period_dict_numeric_mysql[val['time_grain']]}({val['table_id']}.{val['field_name']})"

                    # range expression condition
                    if val['condition'] == 'between':
                        where = f"{_exclude}{field_string} BETWEEN '{val['user_selection'][0]}' AND '{val['user_selection'][1]}'"

                    # single (expresssion) condition
                    elif val['condition'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to'):
                        EXPRSN = comparison_operator_name_to_symbol(
                            val['condition'])
                        where = f"{_exclude}{field_string} {EXPRSN} '{val['user_selection'][0]}'"

            #####################################################################
            ################################ MS SQL #############################
            #####################################################################
            elif vendor_name == 'mssql':
                # a. Direct Matcheg. month(order_date) IN (1,3,6)
                if val['filter_type'] == 'date_user_selection':
                    _exclude = make_exclude_string(val['exclude'])

                    if val['time_grain'] in ('year', 'dayofmonth', 'dayofweek'):
                        field_string = f"DATEPART({period_dict_mssql[val['time_grain']]}, {val['table_id']}.{val['field_name']})"
                    elif val['time_grain'] == 'month':
                        field_string = f"DATENAME({period_dict_mssql[val['time_grain']]}, {val['table_id']}.{val['field_name']})"
                    elif val['time_grain'] == 'quarter':
                        field_string = f"CONCAT('Q', DATEPART(QUARTER, {val['table_id']}.{val['field_name']}))"
                    elif val['time_grain'] == 'yearquarter':
                        field_string = f"CONCAT(DATEPART(YEAR, {val['table_id']}.{val['field_name']}), '-Q', DATEPART(QUARTER, {val['table_id']}.{val['field_name']}))"
                    elif val['time_grain'] == 'yearmonth':
                        field_string = f"FORMAT({val['table_id']}.{val['field_name']}, 'yyyy-MM')"
                    elif val['time_grain'] == 'date':
                        field_string = f"CONVERT(DATE, {val['table_id']}.{val['field_name']})"

                    _exclude = make_exclude_operator(
                        val['exclude'], val['user_selection'])

                    if len(val['user_selection']) == 1:
                        where = f"{field_string} {_exclude}= '{val['user_selection'][0]}'"
                    elif len(val['user_selection']) > 1:
                        _options = "', '".join(
                            map(str, val['user_selection']))
                        where = f"{field_string} {_exclude} IN ('{_options}')"

                # b. Expressions, eg. YEAR(order_date) > 2015, YEAR(order_date) BETWEEN 2015 AND 2020
                elif val['filter_type'] == 'date_search':

                    # get user input as string
                    if len(val['user_selection']) == 1:
                        _options = f"'{val['user_selection'][0]}'"
                    elif len(val['user_selection']) > 1:
                        _options = "', '".join(
                            map(str, val['user_selection']))

                    _exclude = make_exclude_string(val['exclude'])

                    if val['time_grain'] in ('year', 'quarter', 'month', 'dayofmonth', 'dayofweek'):
                        field_string = f"DATEPART({period_dict_mssql[val['time_grain']]}, {val['table_id']}.{val['field_name']})"
                    elif val['time_grain'] == 'date':
                        field_string = f"CONVERT(DATE, {val['table_id']}.{val['field_name']})"
                    # range expression condition
                    if val['condition'] == 'between':
                        where = f"{_exclude}{field_string} BETWEEN '{val['user_selection'][0]}' AND '{val['user_selection'][1]}'"

                    # single (expresssion) condition
                    elif val['condition'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to'):
                        EXPRSN = comparison_operator_name_to_symbol(
                            val['condition'])
                        where = f"{_exclude}{field_string} {EXPRSN} '{val['user_selection'][0]}'"

        _where.append(where)

    condition = " AND\n\t" if filter_list[0]['any_condition_match'] == False else " OR\n\t"

    if _where:
        WHERE = "\nWHERE\n\t" + condition.join(_where)
    else:
        WHERE = ""

    return WHERE

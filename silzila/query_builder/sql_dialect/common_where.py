from .helper_function import comparison_operator_name_to_symbol


def build_where_clause(filter_list: list, vendor_name: str) -> str:
    """function to construct where clause of query.

    Where clause is optional in query, meaning there may be Query without Where condition
    in Query, "WHERE" key word should be kept only if there is Where condition expression
    Dialect specific and each dialect is handled as separate sections below
    """
    WHERE = ""  # holds final where clause string
    _where = []  # holds individual condition as list
    for val in filter_list:
        # 1. check if Negative match or Positive match
        _negate = ""
        if val['negate'] == True and val['user_selection']:
            # a. negate single value, eg. city != 'Paris'
            if len(val['user_selection']) == 1:
                _negate = "!"
            # b. negate multiple values, eg. city NOT IN ('Paris', 'Chennai')
            elif len(val['user_selection']) >= 1:
                _negate = "NOT"
        # 2. DIRECT MATCH filter, eg. city = 'Paris'
        if val['data_type'] in ('text', 'integer', 'decimal', 'boolean') and val['user_selection']:
            # a. match single value, eg. city = 'Paris'
            if len(val['user_selection']) == 1:
                if val['data_type'] in ('text'):
                    where = f"{val['table_id']}.{val['field_name']} {_negate}= '{val['user_selection'][0]}'"
                elif val['data_type'] in ('integer', 'decimal', 'boolean'):
                    where = f"{val['table_id']}.{val['field_name']} {_negate}= {val['user_selection'][0]}"
            # b. match multiple values, eg. city IN ('Paris', 'Chennai')
            elif len(val['user_selection']) > 1:
                # for text fields, enclose filter members with quote, for numbers don't
                if val['data_type'] in ('text'):
                    _options = ["'" + opt +
                                "'" for opt in val['user_selection']]
                elif val['data_type'] in ('integer', 'decimal', 'boolean'):
                    _options = val['user_selection']
                where = f"{val['table_id']}.{val['field_name']} {_negate} IN ({', '.join(map(str,_options))})"
        # for expressions, eg.sales > 1000, age between 10 and 20
        elif val['data_type'] in ('integer', 'decimal') and val['expr_type'] and val['expr']:
            # a. range expression condition
            if val['expr_type'] == 'between':
                where = f"{val['table_id']}.{val['field_name']} BETWEEN {val['expr'][0]} AND {val['expr'][1]}"
            # b. sinlge (expression) condition
            elif val['expr_type'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_equal_to', 'less_than_equal_to'):
                EXPRSN = comparison_operator_name_to_symbol(val['expr_type'])
                where = f"{val['table_id']}.{val['field_name']} {EXPRSN} {val['expr'][0]}"
        # for date data types
        # Direct Match & Expressions, eg. MONTH(order_date) IN (1,3,6), YEAR(order_date) > 2015
        # different Dialects needs different functons for date data types
        elif val['data_type'] in ('date', 'timestamp'):
            #####################################################################
            ############################ POSTGRESQL #############################
            #####################################################################
            if vendor_name == 'postgresql':
                if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                    if val['aggr'] == 'year':
                        AGGRGN = 'YEAR'
                    elif val['aggr'] == 'month':
                        AGGRGN = 'MONTH'
                    elif val['aggr'] == 'quarter':
                        AGGRGN = 'QUARTER'
                    elif val['aggr'] == 'dayofweek':
                        AGGRGN = 'DOW'
                    elif val['aggr'] == 'day':
                        AGGRGN = 'DAY'
                # a. Direct Matcheg. month(order_date) IN (1,3,6)
                if val['user_selection']:
                    if len(val['user_selection']) == 1:
                        where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER {_negate}= {val['user_selection'][0]}"
                    elif len(val['user_selection']) > 1:
                        _options = val['user_selection']
                        where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER {_negate} IN ({', '.join(map(str, _options))})"
                # b. Expressions, eg. YEAR(order_date) > 2015, YEAR(order_date) BETWEEN 2015 AND 2020
                elif val['expr_type'] and val['expr']:
                    # range expression condition
                    if val['expr_type'] == 'between':
                        where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER BETWEEN {val['expr'][0]} AND {val['expr'][1]}"
                    # single (expresssion) condition
                    elif val['expr_type'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_equal_to', 'less_than_equal_to'):
                        EXPRSN = comparison_operator_name_to_symbol(
                            val['expr_type'])
                        where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER {EXPRSN} {val['expr'][0]}"
            #####################################################################
            ############################    MYSQL   #############################
            #####################################################################
            elif vendor_name == 'mysql':
                if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                    if val['aggr'] == 'year':
                        AGGRGN = 'YEAR'
                    elif val['aggr'] == 'month':
                        AGGRGN = 'MONTH'
                    elif val['aggr'] == 'quarter':
                        AGGRGN = 'QUARTER'
                    elif val['aggr'] == 'dayofweek':
                        AGGRGN = 'DAYOFWEEK'
                    elif val['aggr'] == 'day':
                        AGGRGN = 'DAYOFMONTH'
                # a. Direct Matcheg. month(order_date) IN (1,3,6)
                if val['user_selection']:
                    if len(val['user_selection']) == 1:
                        where = f"{AGGRGN}({val['table_id']}.{val['field_name']}) {_negate}= {val['user_selection'][0]}"
                    elif len(val['user_selection']) > 1:
                        _options = val['user_selection']
                        where = f"{AGGRGN}({val['table_id']}.{val['field_name']}) {_negate} IN ({', '.join(map(str, _options))})"
                # b. Expressions, eg. YEAR(order_date) > 2015, YEAR(order_date) BETWEEN 2015 AND 2020
                elif val['expr_type'] and val['expr']:
                    # range expression condition
                    if val['expr_type'] == 'between':
                        where = f"{AGGRGN}({val['table_id']}.{val['field_name']}) BETWEEN {val['expr'][0]} AND {val['expr'][1]}"
                    # single (expresssion) condition
                    elif val['expr_type'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_equal_to', 'less_than_equal_to'):
                        EXPRSN = comparison_operator_name_to_symbol(
                            val['expr_type'])
                        where = f"{AGGRGN}({val['table_id']}.{val['field_name']}) {EXPRSN} {val['expr'][0]}"
            #####################################################################
            ################################ MS SQL #############################
            #####################################################################
            elif vendor_name == 'mssql':
                if val['aggr'] in ('year', 'month', 'quarter', 'dayofweek', 'day'):
                    if val['aggr'] == 'year':
                        AGGRGN = 'YYYY'
                    elif val['aggr'] == 'month':
                        AGGRGN = 'MM'
                    elif val['aggr'] == 'quarter':
                        AGGRGN = 'QQ'
                    elif val['aggr'] == 'dayofweek':
                        AGGRGN = 'W'
                    elif val['aggr'] == 'day':
                        AGGRGN = 'DD'
                # a. Direct Matcheg. month(order_date) IN (1,3,6)
                if val['user_selection']:
                    if len(val['user_selection']) == 1:
                        where = f"DATEPART({AGGRGN}, {val['table_id']}.{val['field_name']}) {_negate}= {val['user_selection'][0]}"
                    elif len(val['user_selection']) > 1:
                        _options = val['user_selection']
                        where = f"DATEPART({AGGRGN}, {val['table_id']}.{val['field_name']}) {_negate} IN ({', '.join(map(str, _options))})"
                # b. Expressions, eg. YEAR(order_date) > 2015, YEAR(order_date) BETWEEN 2015 AND 2020
                elif val['expr_type'] and val['expr']:
                    # range expression condition
                    if val['expr_type'] == 'between':
                        where = f"DATEPART({AGGRGN}, {val['table_id']}.{val['field_name']}) BETWEEN {val['expr'][0]} AND {val['expr'][1]}"
                    # single (expresssion) condition
                    elif val['expr_type'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_equal_to', 'less_than_equal_to'):
                        EXPRSN = comparison_operator_name_to_symbol(
                            val['expr_type'])
                        where = f"DATEPART({AGGRGN}, {val['table_id']}.{val['field_name']}) {EXPRSN} {val['expr'][0]}"
        _where.append(where)
    if _where:
        WHERE = "\nWHERE\n\t" + " AND\n\t".join(_where)
    else:
        WHERE = ""

    return WHERE

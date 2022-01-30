def expression_name_to_symbol(exprs):
    EXPRSN = None
    if exprs == 'equal_to':
        EXPRSN = '='
    elif exprs == 'not_equal_to':
        EXPRSN = '!='
    elif exprs == 'greater_than':
        EXPRSN = '>'
    elif exprs == 'less_than':
        EXPRSN = '<'
    elif exprs == 'greater_than_equal_to':
        EXPRSN = '>='
    elif exprs == 'less_than_equal_to':
        EXPRSN = '<='
    return EXPRSN


def build_where_clause(filter_list: list) -> str:
    WHERE = ""
    _where = []
    for val in filter_list:
        # check if Negative match or Positive match
        _negate = ""
        if val['negate'] == True and val['user_selection']:
            if len(val['user_selection']) == 1:
                _negate = "!"
            elif len(val['user_selection']) >= 1:
                _negate = "NOT"
        # DIRECT MATCH filter
        if val['data_type'] in ('text', 'integer', 'decimal', 'boolean') and val['user_selection']:
            if len(val['user_selection']) == 1:
                if val['data_type'] in ('text'):
                    where = f"{val['table_id']}.{val['field_name']} {_negate}= '{val['user_selection'][0]}'"
                elif val['data_type'] in ('integer', 'decimal', 'boolean'):
                    where = f"{val['table_id']}.{val['field_name']} {_negate}= {val['user_selection'][0]}"
            elif len(val['user_selection']) > 1:
                # for text fields, enclose filter members with quote, for numbers don't
                if val['data_type'] in ('text'):
                    _options = ["'" + opt +
                                "'" for opt in val['user_selection']]
                elif val['data_type'] in ('integer', 'decimal', 'boolean'):
                    _options = val['user_selection']
                where = f"{val['table_id']}.{val['field_name']} {_negate} IN ({', '.join(map(str,_options))})"
        # expressions like sales > 1000 or age between 10 and 20
        elif val['data_type'] in ('integer', 'decimal') and val['expr_type'] and val['expr']:
            if val['expr_type'] == 'between':
                where = f"{val['table_id']}.{val['field_name']} BETWEEN {val['expr'][0]} AND {val['expr'][1]}"
            elif val['expr_type'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_equal_to', 'less_than_equal_to'):
                EXPRSN = expression_name_to_symbol(val['expr_type'])
                where = f"{val['table_id']}.{val['field_name']} {EXPRSN} {val['expr'][0]}"

        elif val['data_type'] in ('date', 'timestamp'):
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
            if val['user_selection']:
                if len(val['user_selection']) == 1:
                    where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER {_negate}= {val['user_selection'][0]}"
                elif len(val['user_selection']) > 1:
                    _options = val['user_selection']
                    where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER {_negate} IN ({', '.join(map(str, _options))})"
            elif val['expr_type'] and val['expr']:
                if val['expr_type'] == 'between':
                    where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER BETWEEN {val['expr'][0]} AND {val['expr'][1]}"
                elif val['expr_type'] in ('equal_to', 'not_equal_to', 'greater_than', 'less_than', 'greater_than_equal_to', 'less_than_equal_to'):
                    EXPRSN = expression_name_to_symbol(val['expr_type'])
                    where = f"EXTRACT({AGGRGN} FROM {val['table_id']}.{val['field_name']})::INTEGER {EXPRSN} {val['expr'][0]}"
        _where.append(where)
    WHERE = "\n\t" + " AND\n\t".join(_where)
    return WHERE

def comparison_operator_name_to_symbol(exprs):
    """function to return SYMBOL for the comparison operator name
    """
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

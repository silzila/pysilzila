from . import schema
from ..data_connection import engine

'''
************************ Recursive Function *******************************
this function traverses in Relationship Network (list of object) and finds
if the path is needed or not.

tbls = user given table list for which we need to fing relationships
rlss = contains all relationships - ref node diagram
x = table to be searched iteratively till the breadh and depth
i = current index where x is starting to travel
ok = dict holds if both node in a relationship is valid
fs_no_match = flag - indicating both tables in this relationship
    don't have initial match
fs = flag - first or second table in relationship. This helps
tracking if origin X table is table1 or table2 and helps to mark
in ok dict as complete
'''


def recursive_search(tbls: list, rlss: list, x: str, i: int, ok: dict, fs_no_match: bool, fs: str):
    # print("\tRecursive Fn ( ",  x, ", Indx = ",  i,  " )")

    for j, v in enumerate(rlss):
        if j != i:
            fst2 = rlss[j]["table1"]
            sec2 = rlss[j]["table2"]
            # print("\t\tFor Loop, j = ", j, " ( ", fst2, " ", sec2, " )")

            if x == fst2 and sec2 in tbls:
                if fs == "first":
                    ok["t1Ok"] = True
                elif fs == "second":
                    ok["t2Ok"] = True
                # print("\t\t\tIf 1 ---------------- ", ok["t1Ok"], " ", ok["t2Ok"])
                if (fs_no_match == True and ok["t2Ok"] == True) or (ok["t1Ok"] == True and ok["t2Ok"] == True):
                    break
            elif x == sec2 and fst2 in tbls:
                if fs == "first":
                    ok["t1Ok"] = True
                elif fs == "second":
                    ok["t2Ok"] = True
                # print("\t\t\tIf 2 ---------------- ", ok["t1Ok"], " ", ok["t2Ok"])
                if (fs_no_match == True and ok["t1Ok"] == True) or (ok["t1Ok"] == True and ok["t2Ok"] == True):
                    break
            elif x == fst2 and sec2 not in tbls:
                # print("\t\t\tIf 3 ---------------- ", ok["t1Ok"], " ", ok["t2Ok"])
                recursive_search(tbls, rlss, sec2, j, ok, fs_no_match, fs)
                if ok["t1Ok"] == True and ok["t2Ok"] == True:
                    break
            elif x == sec2 and fst2 not in tbls:
                # print("\t\t\tIf 4 ---------------- ", ok["t1Ok"], " ", ok["t2Ok"])
                recursive_search(tbls, rlss, fst2, j, ok, fs_no_match, fs)
                if ok["t1Ok"] == True and ok["t2Ok"] == True:
                    break


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


async def compose_query(req: schema.Query, dc_uid: str, ds_uid: str):
    req = req.dict()
    print("------------Query -----------\n", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    # print("------------Schema -----------\n", data_schema)

    # unique_tables will hold all unique requested tables
    unique_tables = {
        "dims": [],
        "measures": [],
        "fields": [],
        "filters": [],
        "all": []  # to contain all tables used in the query

    }

    # populate unique_tables
    for key, value in (req).items():
        for table in value:
            if table["table_id"] not in unique_tables.get(key):
                unique_tables.get(key).append(table["table_id"])
    unique_tables["all"].extend(unique_tables["dims"] + unique_tables["fields"] +
                                unique_tables["filters"] + unique_tables["measures"])
    unique_tables["all"] = list(set(unique_tables["all"]))
    print("unique_tables ========== \n", unique_tables, "\n")

    FROM_TBL = ""
    relationships = []  # holds all required relations

    # Build relationship - when only one table in qry
    if len(unique_tables["all"]) == 1:
        table1 = list(filter(
            lambda obj: obj["id"] == unique_tables["all"][0], data_schema["tables"]))[0]
        # print("table1 ===", table1)
        FROM_TBL = f"\n\t{table1['schema_name']}.{table1['table_name']} AS {table1['id']}"
        # print("FROM_TBL ===", FROM_TBL)

    # Build relationship - when many tables in qry
    elif len(unique_tables["all"]) > 1:
        # iterte the relationship schema network
        for i, val in enumerate(data_schema["relationships"]):
            ok = {"t1Ok": False, "t2Ok": False}
            tbl1 = val["table1"]
            tbl2 = val["table2"]
            # print(tbl1, " ", tbl2)
            # when both tables present in request list - keep it
            if tbl1 in unique_tables["all"] and tbl2 in unique_tables["all"]:
                ok["t1Ok"] = True
                ok["t2Ok"] = True
                # print("* YES YES")
            # if from table matches, pass the other table to recursive search to find
            # if that is required, means a must in between the network
            elif tbl1 in unique_tables["all"]:
                ok["t1Ok"] = True
                # print("* YES NO")
                recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl2, i, ok, False, "second")
            # pass the to table to recursive search
            elif tbl2 in unique_tables["all"]:
                ok["t2Ok"] = True
                # print("* NO YES")
                recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl1, i, ok, False, "first")
            # pass both table to recursive search
            else:
                # print("* NO  NO")
                # print("* Calling First")
                recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl1, i, ok, True, "first")
                # print("* Calling Second")
                recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl2, i, ok, True, "second")
            # after recursive search, if the connection is needed for final network, keep it
            if ok["t1Ok"] == True and ok["t2Ok"] == True:
                relationships.append(val)
                # print("#################################")
            # else:
            #     # print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")# Build relationship - when many tables in qry

    # print("--------------------------------------")
    for val in relationships:
        print(val["table1"], " ", val["table2"])

    relationships2 = []  # holds all relations in ORDER

    while len(relationships2) < len(relationships):
        # while x <= 10:
        # print("while loop, rel2 len = ", len(relationships2))
        for i, v in enumerate(relationships):
            if not relationships2:
                relationships2.append(v)
            elif v not in relationships2:
                # print("v ====== ", str(v))
                for j, v2 in enumerate(relationships2):
                    # print("\tv2-1 ====== ", str(v2))
                    if v not in relationships2:
                        if v["table1"] == v2["table1"]:
                            relationships2.append(v)
                            break
                for j, v2 in enumerate(relationships2):
                    # print("\tv2-1 ====== ", str(v2))
                    if v not in relationships2:
                        if v["table1"] == v2["table2"]:
                            relationships2.append(v)
                            break
                for j, v2 in enumerate(relationships2):
                    # print("\tv2-1 ====== ", str(v2))
                    if v not in relationships2:
                        if v["table2"] == v2["table1"]:
                            relationships2.insert(j, v)
                            break
                for j, v2 in enumerate(relationships2):
                    # print("\tv2-1 ====== ", str(v2))
                    if v not in relationships2:
                        if v["table2"] == v2["table2"]:
                            relationships2.append(v)
                            break

    print("--------------------------------------")
    for val in relationships2:
        print(val["table1"], " ", val["table2"])

    print("======================================")
    '''
    RELATIONSHIP SECTION
    '''
    joins = {
        "inner": "INNER JOIN",
        "left": "LEFT OUTER JOIN",
        "right": "RIGHT OUTER JOIN",
        "full": "FULL OUTER JOIN"
    }
    mirror_joins = {
        "inner": "INNER JOIN",
        "left": "RIGHT OUTER JOIN",
        "right": "LEFT OUTER JOIN",
        "full": "FULL OUTER JOIN"
    }

    for i, val in enumerate(relationships2):
        _from = list(
            filter(lambda obj: obj["id"] == val["table1"], data_schema["tables"]))[0]
        _to = list(filter(lambda obj: obj["id"] ==
                          val["table2"], data_schema["tables"]))[0]
        _join = []
        for idx, rel in enumerate(val["table1_columns"]):
            joinn = f"{val['table1']}.{rel} = {val['table2']}.{val['table2_columns'][idx]}"
            _join.append(joinn)
        _join = " AND\n\t".join(_join)
        # print("!!!!!!!!!\n _from: ", _from, "\n_to: ", _to, "\n_join", _join)
        if i == 0:
            FROM_TBL += f"\n\t{_from['schema_name']}.{_from['table_name']} AS {_from['id']} \
                \n\t{joins[val['ref_integrity']]} {_to['schema_name']}.{_to['table_name']}  AS {_to['id']} ON \n\t\t {_join}"
        if i > 0:
            if val["table1"] == relationships2[i-1]["table1"] or val["table1"] == relationships2[i-1]["table2"]:
                FROM_TBL += f"\n\t{joins[val['ref_integrity']]} {_to['schema_name']}.{_to['table_name']} AS {_to['id']} ON \n\t\t{_join}"

            elif val["table2"] == relationships2[i-1]["table1"] or val["table2"] == relationships2[i-1]["table2"]:
                print("&&&&&&&&&&&&&&& Mirror join 1 &&&&&&&&&&&&&&&&&")
                FROM_TBL += f"\n\t{mirror_joins[val['ref_integrity']]} {_from['schema_name']}.{_from['table_name']} AS {_from['id']} ON \n\t\t{_join}"
            # when not matching with one level above - need to check the whole list
            else:
                existing_tables = [r['table1']
                                   for r in relationships2[:i]]
                existing_tables_t2 = [r['table2']
                                      for r in relationships2[:i]]
                existing_tables.extend(existing_tables_t2)
                # print("** existing_tables_t1 = ", existing_tables_t1)
                # print("** existing_tables_t2 = ", existing_tables_t2)
                if val['table1'] in existing_tables:
                    _to = list(filter(lambda obj: obj["id"] ==
                                      val["table2"], data_schema["tables"]))[0]
                    FROM_TBL += f"\n\t{joins[val['ref_integrity']]} {_to['schema_name']}.{_to['table_name']} AS {_to['id']} ON \n\t\t{_join}"
                elif val['table2'] in existing_tables:
                    _from = list(
                        filter(lambda obj: obj["id"] == val["table1"], data_schema["tables"]))[0]
                    print("&&&&&&&&&&&&&&& Mirror join 2 &&&&&&&&&&&&&&&&&")
                    FROM_TBL += f"\n\t{mirror_joins[val['ref_integrity']]} {_from['schema_name']}.{_from['table_name']} AS {_from['id']} ON \n\t\t{_join}"
    # print(FROM_TBL)

    print("===============WHERE=================")
    WHERE = ""
    _where = []
    for val in req['filters']:
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
    print(WHERE)

    print("===============SELECT=================")
    '''
    SELECT SECTION
    '''
    SELECT = ""
    _select = []
    select_dim_list = []
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

    # print("===============GROUP BY=================")
    '''
    GROUP BY SECTION
    '''
    _group_by = []
    for i, val in enumerate(select_dim_list):
        _group_by.append(str(i+1))
    GROUP_BY = "\n\t" + ",".join(_group_by)

    print("\n===============QUERY=========================================")
    if req["dims"]:
        QUERY = f"SELECT {SELECT}\nFROM{FROM_TBL}\nWHERE{WHERE}\nGROUP BY{GROUP_BY}\nORDER BY{GROUP_BY}"
    elif req["measures"]:
        QUERY = f"SELECT {SELECT}\nFROM\n{FROM_TBL}\nWHERE{WHERE}"
    # print(QUERY)

    return QUERY

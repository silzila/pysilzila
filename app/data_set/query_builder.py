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


async def compose_query(req: schema.Query, dc_uid: str, ds_uid: str):
    req = req.dict()
    print("------------Query -----------\n", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    print("------------Schema -----------\n", data_schema)

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
        if i == 0:
            FROM_TBL += f"\n\t{_from['schema_name']}.{_from['table_name']} AS {_from['id']} \
                \n\tINNER JOIN {_to['schema_name']}.{_to['table_name']}  AS {_to['id']} ON \n\t\t {_join}"
        if i > 0:
            if val["table1"] == relationships2[i-1]["table1"]:
                FROM_TBL += f"\n\tINNER JOIN {_to['schema_name']}.{_to['table_name']} AS {_to['id']} ON \n\t\t{_join}"
            elif val["table1"] == relationships2[i-1]["table2"]:
                FROM_TBL += f"\n\tINNER JOIN {_to['schema_name']}.{_to['table_name']} AS {_to['id']} ON \n\t\t {_join}"

            elif val["table2"] == relationships2[i-1]["table2"]:
                FROM_TBL += f"\n\tINNER JOIN {_from['schema_name']}.{_from['table_name']} AS {_from['id']} ON \n\t\t{_join}"

    # print(FROM_TBL)

    print("===============SELECT=================")
    '''
    SELECT SECTION
    '''
    SELECT = ""
    _select = []
    select_dim_list = []
    select_meas_list = []
    for val in req["dims"]:
        if val['data_type'] in ('string', 'varchar', 'char', 'float', 'int', 'integer', 'decimal', 'double'):
            field_string = f"{val['table_id']}.{val['field_name']}"
            select_dim_list.append(field_string)
        elif val['data_type'] in ('date', 'timestamp', 'datetime'):
            if val['aggr'] in ('', 'y', 'm', 'w', 'd'):
                aggr = 'yyyy'
                if val['aggr'] == 'm':
                    aggr = 'mm'
                elif val['aggr'] == 'w':
                    aggr = 'w'
                if val['aggr'] == 'd':
                    aggr = 'dd'
                field_string = f"TO_CHAR({val['table_id']}.{val['field_name']}, '{aggr}') AS {val['field_name']}_{aggr}"
                select_dim_list.append(field_string)

    _select.extend(select_dim_list)

    for val in req["measures"]:
        if val['data_type'] in ('string', 'varchar', 'char'):
            field_string = f"COUNT({val['table_id']}.{val['field_name']}) AS {val['field_name']}_count"
            select_meas_list.append(field_string)
        elif val['data_type'] in ('date', 'timestamp', 'datetime'):
            if val['aggr'] in ('', 'y', 'm', 'w', 'd'):
                aggr = 'yyyy'
                if val['aggr'] == 'm':
                    aggr = 'mm'
                elif val['aggr'] == 'w':
                    aggr = 'w'
                if val['aggr'] == 'd':
                    aggr = 'dd'
                field_string = f"COUNT(TO_CHAR({val['table_id']}.{val['field_name']}, '{aggr}')) AS {val['field_name']}_{aggr}_count"
                select_meas_list.append(field_string)
        elif val['data_type'] in ('float', 'int', 'integer', 'decimal', 'double', 'numeric'):
            if val['aggr'] in ('sum', 'min', 'max', 'avg'):
                aggrn = val['aggr']
            else:
                aggrn = 'sum'
            field_string = f"{aggrn.upper()}({val['table_id']}.{val['field_name']}) AS {val['field_name']}_{aggrn}"
            select_meas_list.append(field_string)

    _select.extend(select_meas_list)

    SELECT = "\n\t" + ",\n\t".join(_select)
    # print(_select)
    print("dim selection ***** \n", select_dim_list)
    print("meas selection ***** \n", select_meas_list)
    print(SELECT)

    print("===============GROUP BY=================")
    '''
    GROUP BY SECTION
    '''
    _group_by = []
    for i, val in enumerate(select_dim_list):
        _group_by.append(str(i+1))
    GROUP_BY = "\n\t" + ",".join(_group_by)

    print("\n===============QUERY=========================================")
    if req["dims"]:
        QUERY = f"SELECT {SELECT}\nFROM{FROM_TBL}\nGROUP BY{GROUP_BY}\nORDER BY{GROUP_BY}"
    elif req["measures"]:
        QUERY = f"SELECT {SELECT}\nFROM\n{FROM_TBL}"
    # print(QUERY)

    return QUERY

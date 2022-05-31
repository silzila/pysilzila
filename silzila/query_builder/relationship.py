from .schema_recursive_search import schema_recursive_search


async def build_relationship(req, data_schema) -> str:
    """constructs JOIN clause of the query
    Same for all sql dialects.
    For now, it doesn't handle the following scenarios:
        1. self join (same table joined multiple times)
        2. more than one possibility of join between 2 tables
            eg: a, b, c tables, a to b, b to c relationship.
            if we add a to c then there are two ways of joining a to c.
            a to c directly and via b. 
    """

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
    # print("unique_tables ========== \n", unique_tables, "\n")

    FROM_TBL = ""
    relationships = []  # holds all required relations

    # Build relationship - when only one table in qry
    if len(unique_tables["all"]) == 1:
        table1 = list(filter(
            lambda obj: obj["id"] == unique_tables["all"][0], data_schema["tables"]))[0]
        FROM_TBL = f"\n\t{table1['schema_name']}.{table1['table_name']} AS {table1['id']}"

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
                schema_recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl2, i, ok, False, "second")
            # pass the to table to recursive search
            elif tbl2 in unique_tables["all"]:
                ok["t2Ok"] = True
                # print("* NO YES")
                schema_recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl1, i, ok, False, "first")
            # pass both table to recursive search
            else:
                # print("* NO  NO")
                # print("* Calling First")
                schema_recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl1, i, ok, True, "first")
                # print("* Calling Second")
                schema_recursive_search(
                    unique_tables["all"], data_schema["relationships"], tbl2, i, ok, True, "second")
            # after recursive search, if the connection is needed for final network, keep it
            if ok["t1Ok"] == True and ok["t2Ok"] == True:
                relationships.append(val)
                # print("#################################")
            # else:
            #     # print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")# Build relationship - when many tables in qry

    # print("--------------------------------------")
    # for val in relationships:
        # print(val["table1"], " ", val["table2"])

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

    # print("--------------------------------------")
    # for val in relationships2:
    #     print(val["table1"], " ", val["table2"])

    # print("======================================")

    # RELATIONSHIP SECTION
    # eg. a left join b.
    # if we traverse a first then b, use joins (left: Left outer join, a left join b)
    # if we traverse b first then a, use mirror_joins (left: Right outer join, b right join a)
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
                # print("&&&&&&&&&&&&&&& Mirror join 1 &&&&&&&&&&&&&&&&&")
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
                    # print("&&&&&&&&&&&&&&& Mirror join 2 &&&&&&&&&&&&&&&&&")
                    FROM_TBL += f"\n\t{mirror_joins[val['ref_integrity']]} {_from['schema_name']}.{_from['table_name']} AS {_from['id']} ON \n\t\t{_join}"
    # print(FROM_TBL)
    return FROM_TBL

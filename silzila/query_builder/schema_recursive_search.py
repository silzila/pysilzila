def schema_recursive_search(tbls: list, rlss: list, x: str, i: int, ok: dict, fs_no_match: bool, fs: str):
    """ Recursively searches relationships to build network of tabels & joins
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
    """
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
                schema_recursive_search(
                    tbls, rlss, sec2, j, ok, fs_no_match, fs)
                if ok["t1Ok"] == True and ok["t2Ok"] == True:
                    break
            elif x == sec2 and fst2 not in tbls:
                # print("\t\t\tIf 4 ---------------- ", ok["t1Ok"], " ", ok["t2Ok"])
                schema_recursive_search(
                    tbls, rlss, fst2, j, ok, fs_no_match, fs)
                if ok["t1Ok"] == True and ok["t2Ok"] == True:
                    break

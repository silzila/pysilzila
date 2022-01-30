from ..data_set import schema
from ..data_connection import engine
from .sql_dialect import postgres_select, postgres_where
# from .schema_recursive_search import schema_recursive_search
from .relationship import build_relationship


async def compose_query(req: schema.Query, dc_uid: str, ds_uid: str, vendor_name: str) -> str:
    req = req.dict()
    print("------------Query -----------\n", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    # print("------------Schema -----------\n", data_schema)

    FROM_TBL = await build_relationship(req, data_schema)

    select_dim_list = []
    print("===============WHERE Postgresql=================")
    if vendor_name == 'postgresql':
        WHERE = postgres_where.build_where_clause(req['filters'])
        SELECT = postgres_select.build_select_clause(req, select_dim_list)
    print(WHERE)

    print("===============SELECT Postgresql=================")
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

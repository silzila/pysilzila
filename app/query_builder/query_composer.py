from ..data_set import schema
from ..data_connection import engine
from .sql_dialect import common_where, select_postgres, select_mysql, select_mssql
# from .schema_recursive_search import schema_recursive_search
from .relationship import build_relationship


async def compose_query(req: schema.Query, dc_uid: str, ds_uid: str, vendor_name: str) -> str:
    req = req.dict()
    print("------------Query -----------\n", req)
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    # print("------------Schema -----------\n", data_schema)

    FROM_TBL = await build_relationship(req, data_schema)

    select_dim_list = []
    group_by_dim_list = []
    order_by_dim_list = []
    print("===============WHERE =================")
    WHERE = common_where.build_where_clause(req['filters'], vendor_name)
    print(WHERE)

    print("===============SELECT =================")
    SELECT = ""
    if vendor_name == 'postgresql':
        SELECT = select_postgres.build_select_clause(
            req, select_dim_list, group_by_dim_list, order_by_dim_list)
    elif vendor_name == 'mysql':
        SELECT = select_mysql.build_select_clause(
            req, select_dim_list, group_by_dim_list, order_by_dim_list)
    elif vendor_name == 'mssql':
        SELECT = select_mssql.build_select_clause(
            req, select_dim_list, group_by_dim_list, order_by_dim_list)
    else:
        print("--------------- vendor name is wrong!")
    # print("===============GROUP BY=================")
    '''
    GROUP BY SECTION
    '''
    # _group_by = []
    # for i in range(len(group_by_dim_list)):
    #     _group_by.append(group_by_dim_list[i])
    GROUP_BY = "\n\t" + ",\n\t".join(group_by_dim_list)
    # _group_by = []
    # for i in range(len(select_dim_list)):
    #     if vendor_name == 'mssql':
    #         _group_by.append(group_by_dim_list[i])
    #         GROUP_BY = "\n\t" + ",\n\t".join(_group_by)
    #     else:
    #         _group_by.append(str(i+1))
    #         GROUP_BY = "\n\t" + ",".join(_group_by)

    '''
    ORDER BY SECTION
    '''
    # _order_by = []
    # for i in range(len(group_by_dim_list)):
    #     if i >= 1 and group_by_dim_list[i-1][:6] == '__sort':
    #         pass
    #     else:
    #         _order_by.append(group_by_dim_list[i])
    ORDER_BY = "\n\t" + ",\n\t".join(order_by_dim_list)
    # _order_by = []
    # for i in range(len(select_dim_list)):
    #     _order_by.append(str(i+1))
    # ORDER_BY = "\n\t" + ",".join(_order_by)

    print("\n===============QUERY=========================================")
    if req["dims"]:
        QUERY = f"SELECT {SELECT}\nFROM{FROM_TBL}{WHERE}\nGROUP BY{GROUP_BY}\nORDER BY{ORDER_BY}"
    elif req["measures"]:
        QUERY = f"SELECT {SELECT}\nFROM\n{FROM_TBL}{WHERE}"
    # print(QUERY)

    return QUERY

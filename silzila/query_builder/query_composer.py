from fastapi import HTTPException

from ..data_set import schema
from ..data_connection import engine
from .sql_dialect import common_where, select_postgres, select_mysql, select_mssql
from .relationship import build_relationship


async def compose_query(req: schema.Query, dc_uid: str, ds_uid: str, vendor_name: str) -> str:
    """Builds query based on Dimensions and Measures of user selection.

    Query building is split into many sections:
    like Select clause, Join clause, Where clause, Group By clause & Order By clause
    Different dialects will have different syntaxes.
    """
    req = req.dict()
    # get data set (Tables & it's relatonships) for building query
    data_schema = await engine.get_data_schema(dc_uid, ds_uid)
    # builds JOIN Clause of SQL - same for all dialects
    FROM_TBL = await build_relationship(req, data_schema)
    # empty list to get populated by added columns
    select_dim_list = []
    group_by_dim_list = []
    order_by_dim_list = []
    # builds WHERE Clause of SQL
    WHERE = common_where.build_where_clause(req['filters'], vendor_name)

    # builds SELECT Clause of SQL
    # SELECT clause is the most varying of all clauses, different for each dialect
    # select_dim_list columns are used in group_by_dim_list & order_by_dim_list except that
    # select_dim_list has column alias and group_by_dim_list & order_by_dim_list don't have alias
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
        raise HTTPException(
            status_code=500, detail="Vendor name is wrong")

    # builds GROUP BY Clause of SQL
    GROUP_BY = "\n\t" + ",\n\t".join(group_by_dim_list)

    # builds ORDER BY Clause of SQL
    ORDER_BY = "\n\t" + ",\n\t".join(order_by_dim_list)

    # if request has dimensions then add group by and order by clause
    if req["dims"]:
        QUERY = f"SELECT {SELECT}\nFROM{FROM_TBL}{WHERE}\nGROUP BY{GROUP_BY}\nORDER BY{ORDER_BY}"
    # if request has only measures then no need of group by and order by clause
    elif req["measures"]:
        QUERY = f"SELECT {SELECT}\nFROM\n{FROM_TBL}{WHERE}"

    return QUERY

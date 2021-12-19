from sqlalchemy import select
from sqlalchemy.orm import Session, session
import json

from . import model, schema


async def create_data_set(db: Session,
                          ds: schema.DataSetIn):
    # print("tables ============\n", ds.dict()["tables"])
    data_schema = ds.dict()['data_schema']
    # _tables = ds.dict()["tables"]
    data_schema["tables"] = [{**table, "table_id": table['table_name'][:3]}
                             for table in data_schema["tables"]]
    # print("tables ------------\n", tables)
    ds_item = model.DataSet(dc_uid=ds.dc_uid,
                            friendly_name=ds.friendly_name,
                            data_schema=data_schema)
    print("type ============\n", type(
        ds.dict()["data_schema"]), "tables =======\n", ds.dict()["data_schema"])
    print("tables ============\n", json.dumps(ds.dict()["data_schema"]))
    print("------------------------")
    db.add(ds_item)
    await db.flush()
    return ds_item
    # resp = {"dc_uid": ds_item.dc_uid,
    #         "friendly_name": ds_item.friendly_name,
    #         "ds_uid": ds_item.ds_uid,
    #         "data_schema": ds_item.data_schema}
    # # return resp
    # return ds.dict()["data_schema"]

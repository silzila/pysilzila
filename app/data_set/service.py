from sqlalchemy import select
from sqlalchemy.orm import Session, session
import json

from . import model, schema


async def create_data_set(db: Session,
                          ds: schema.DataSetIn):
    print("tables ============\n", ds.dict()["tables"])
    _tables = ds.dict()["tables"]
    tables = [{**table, "table_id": table['table_name'][:3]}
              for table in _tables]
    print("tables ------------\n", tables)
    ds_item = model.DataSet(dc_uid=ds.dc_uid,
                            friendly_name=ds.friendly_name,
                            data_schema=json.dumps(ds.dict()))
    db.add(ds_item)
    await db.flush()
    resp = {"dc_uid": ds_item.dc_uid,
            "friendly_name": ds_item.friendly_name,
            "ds_uid": ds_item.ds_uid,
            "tables": ds.tables,
            "relationships": ds.relationships}
    return resp

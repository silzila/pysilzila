from sqlalchemy import select
from sqlalchemy.orm import Session, Bundle
from sqlalchemy.sql.elements import and_
import json

from . import model, schema
from .model import DataSet
# from ..user.model import User
from ..data_connection.model import DataConnection


async def get_ds_by_friendly_name(db: Session, uid: str, friendly_name: str):
    stmt = select(DataSet).join(DataConnection).where(
        and_(
            DataConnection.user_id == uid,
            DataSet.friendly_name == friendly_name
        )
    )
    ds = await db.execute(stmt)
    return ds.scalars().first()


async def create_ds(db: Session,
                    ds: schema.DataSetIn):
    data_schema = ds.dict()['data_schema']
    data_schema["tables"] = [{**table, "id2": table['table_name'][:]}
                             for table in data_schema["tables"]]
    _rel = {}
    for i, rel in enumerate(data_schema['relationships']):
        for tbl in data_schema['tables']:
            if rel['table1'] == tbl['id']:
                if i in _rel:
                    _rel[i]['table1'] = tbl['id2']
                else:
                    _rel[i] = {"table1": tbl['id2']}
            if rel['table2'] == tbl['id']:
                if i in _rel:
                    _rel[i]['table2'] = tbl['id2']
                else:
                    _rel[i] = {"table2": tbl['id2']}

    for idx, val in enumerate(_rel):
        data_schema['relationships'][idx]['table1'] = _rel[idx]['table1']
        data_schema['relationships'][idx]['table2'] = _rel[idx]['table2']

    data_schema["tables"] = [{**table, "id": table['id2'][:]}
                             for table in data_schema["tables"]]
    data_schema["tables"] = [{k: v for k, v in table.items(
    ) if k != 'id2'} for table in data_schema["tables"]]

    ds_item = model.DataSet(dc_uid=ds.dc_uid,
                            friendly_name=ds.friendly_name,
                            data_schema=data_schema)
    db.add(ds_item)
    await db.flush()
    resp = {"dc_uid": ds_item.dc_uid,
            "friendly_name": ds_item.friendly_name,
            "ds_uid": ds_item.ds_uid,
            "data_schema": ds_item.data_schema}
    return resp


async def get_all_ds(db: Session, user_id: str):
    stmt = select(Bundle("dataset", DataSet.friendly_name, DataSet.dc_uid, DataSet.ds_uid)).join(DataConnection).where(
        DataConnection.user_id == user_id
    )
    all_ds = await db.execute(stmt)
    return all_ds.scalars().all()


async def get_ds_by_id(db: Session, ds_uid: str):
    stmt = select(Bundle("dataset", DataSet.friendly_name, DataSet.dc_uid, DataSet.ds_uid, DataSet.data_schema)).where(
        model.DataSet.ds_uid == ds_uid
    )
    ds = await db.execute(stmt)
    return ds.scalars().first()

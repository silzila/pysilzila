from fastapi.exceptions import HTTPException
from sqlalchemy import select, update
from sqlalchemy.orm import Session, Bundle
from sqlalchemy.sql.elements import and_
import json

from . import model, schema
from .model import DataSet
from ..data_connection.model import DataConnection
from ..data_connection import engine
from ..play_book.service import get_all_pb_by_ds


# gets Data Source by Name
async def get_ds_by_friendly_name(db: Session, uid: str, friendly_name: str):
    stmt = select(DataSet).join(DataConnection).where(
        and_(
            DataConnection.user_id == uid,
            DataSet.friendly_name == friendly_name
        )
    )
    ds = await db.execute(stmt)
    if ds is None:
        raise HTTPException(
            status_code=400, detail="No Data Set has the Friendlly Name")
    return ds.scalars().first()


# gets all data sources by data connection
async def get_all_ds_by_dc_uid(db: Session, dc_uid: str):
    stmt = select(DataSet.friendly_name).where(
        DataSet.dc_uid == dc_uid
    )
    ds = await db.execute(stmt)
    # convert result to list
    res_ds = ds.scalars().all()
    return res_ds


# checks if data set name is alreay taken for the user
async def check_friendly_name_in_other_ds(db: Session, uid: str, friendly_name: str, ds_uid: str):
    stmt = select(DataSet).join(DataConnection).where(
        and_(
            DataConnection.user_id == uid,
            DataSet.friendly_name == friendly_name,
            DataSet.ds_uid != ds_uid
        )
    )
    ds = await db.execute(stmt)
    if ds is None:
        raise HTTPException(
            status_code=400, detail="No Data Set has the Friendlly Name")
    return ds.scalars().first()


def create_alias_names_for_tables(tables: list) -> list:
    """In Data Set, each table is given short, meaningful & unique alias name.

    This alias is used in query building. eg. product AS p, sub_category as sc
    single word table names gets first letter. If multiple tables start with
    the same letter then numbers are suffixed.
    eg. product AS p, process AS p2, pointofsales as p3
    if table names have hyphen symbol, then first letters are combined
    eg. point_of_sales AS pos, sub_category AS sc
    """
    table_names = [table['table_name'] for table in tables]
    alias_names = []
    alias_names_without_suffix_number = {}
    # iterate incoming list to get table names
    for table_name in table_names:
        # split table name to list. eg. sub_category will be split into ['sub', 'category']
        table_name_split_array = table_name.split('_')
        alias_name = ""

        ################ To take one or multiple letters #################
        # if the split list has one word, get first letter of the word
        if len(table_name_split_array) == 1:
            alias_name = table_name_split_array[0][0]
        # for >1 word in list, get first letter of only first three words
        else:
            for word in table_name_split_array[:3]:
                alias_name += word[0]

        ################ To add number suffix or not #################
        # first time an alias name comes
        if alias_names_without_suffix_number.get(alias_name) == None:
            alias_names_without_suffix_number[alias_name] = 1
            alias_names.append(alias_name)

        else:
            # second time same alias name comes
            # if alias name x is already there and new x also comes,
            # then first x is renamed x1 and second x as x2
            # if alias_name in alias_names:
            #     same_alias_name_index = alias_names.index(alias_name)
            #     number_suffix = 1
            #     # alias_names[same_alias_name_index] = f"{alias_name}{number_suffix}"
            #     alias_names.append(f"{alias_name}{number_suffix+1}")
            #     alias_names_without_suffix_number[alias_name] += 1
            # print("    else except appended alias name ++++++2= ",
            #       f"{alias_name}{number_suffix+1}")
            # print("alias_names =", alias_names)
            # if same alias comes from third time onwards
            # from alias_names_without_suffix_number, check how many times already there and add one number
            if alias_name in alias_names:
                alias_names_without_suffix_number[alias_name] += 1
                alias_name = f"{alias_name}{alias_names_without_suffix_number[alias_name]}"
                alias_names.append(alias_name)
    return alias_names


# create Data Set
async def create_ds(db: Session, ds: schema.DataSetIn):
    data_schema = ds.dict()['data_schema']

    # get & add alias names as id2
    alias_names = create_alias_names_for_tables(data_schema['tables'])
    data_schema["tables"] = [{**table, "id2": alias_names[i]}
                             for i, table in enumerate(data_schema["tables"])]

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


# update Data Set
async def update_data_set(db: Session, ds_uid: str, ds: schema.DataSetIn, uid: str):
    # check if DS exists
    _ds_info = await db.execute(select(DataSet).where(
        DataSet.ds_uid == ds_uid
    ))
    ds_info = _ds_info.scalars().first()
    if ds_info is None:
        raise HTTPException(
            status_code=404, detail="Data Set does not exist")
    # check if incoming friendly name is used in another DS
    ds_data = await check_friendly_name_in_other_ds(db, uid, ds.friendly_name, ds_uid)
    if ds_data:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already taken")

    # preparing data_schema to be modified
    data_schema = ds.dict()['data_schema']
    # get & add alias names as id2
    alias_names = create_alias_names_for_tables(data_schema['tables'])
    data_schema["tables"] = [{**table, "id2": alias_names[i]}
                             for i, table in enumerate(data_schema["tables"])]
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

    # update data_schema & friendy name
    ds_info.data_schema = data_schema
    ds_info.friendly_name = ds.friendly_name
    # execute update in DB
    await db.execute(update(DataSet).values(
        friendly_name=ds.friendly_name, data_schema=data_schema).where(
        DataSet.ds_uid == ds_uid
    ))
    await db.flush()

    # if the DS is already loded into in-memory, then need to load updated DS
    is_reloaded = engine.reload_ds(ds_info)
    if is_reloaded is None:
        raise HTTPException(
            status_code=404, detail="Data Set Could not be Reloaded")

    # returning of model will be thrown error because of serialization of data_schema, so custom dict
    resp = {"dc_uid": ds_info.dc_uid,
            "friendly_name": ds_info.friendly_name,
            "ds_uid": ds_info.ds_uid,
            "data_schema": ds_info.data_schema}
    return resp


# delete data set
async def delete_ds(db: Session, ds_uid: str, uid: str):
    # get the DS record
    ds_item = await get_ds_by_id(db, ds_uid)
    # if DS record not exists, throw error
    if ds_item is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    # if DS is present, then check if any Playbook is dependant on it.
    # if any dependency on Playbook then shoudn't delete
    dependant_pb_list = await get_all_pb_by_ds(ds_uid, db, uid)
    if len(dependant_pb_list) >= 1:
        raise HTTPException(
            status_code=401, detail="Cannot delete Datasource. There are dependent Playbook(s)")
    qry_del_ds = DataSet.__table__.delete().where(DataSet.ds_uid == ds_uid)
    await db.execute(qry_del_ds)
    await db.commit()
    return 1


# gets all data set for the user
async def get_all_ds(db: Session, user_id: str):
    stmt = select(Bundle("dataset", DataSet.friendly_name, DataSet.dc_uid, DataSet.ds_uid)).join(DataConnection).where(
        DataConnection.user_id == user_id
    )
    all_ds = await db.execute(stmt)
    return all_ds.scalars().all()


# get Data Set by ID
async def get_ds_by_id(db: Session, ds_uid: str):
    stmt = select(Bundle("dataset", DataSet.friendly_name, DataSet.dc_uid, DataSet.ds_uid, DataSet.data_schema)).where(
        model.DataSet.ds_uid == ds_uid
    )
    ds = await db.execute(stmt)
    return ds.scalars().first()

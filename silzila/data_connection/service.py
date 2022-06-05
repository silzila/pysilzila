from fastapi.exceptions import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import and_

from . import model, schema, auth
from ..data_set.model import DataSet
from ..data_set.service import get_all_ds_by_dc_uid


# adding data connection record to DB
async def create_data_connection(db: Session,
                                 dc: schema.DataConnectionIn,
                                 uid: str):
    # connectionpassword is encrypted before saving
    dc.password = auth.encrypt_password(dc.password)
    dc_item = model.DataConnection(**dc.dict(), user_id=uid)
    db.add(dc_item)
    await db.flush()
    return dc_item


# deleting data connection
async def delete_data_connection(db: Session, dc_uid: str, uid: str):
    # checks if connection details exists for the user
    dc_item = await get_dc_by_id(db, dc_uid, uid)
    if dc_item is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    # if connection is present, then check if any Data Set is dependant on it.
    # if any dependency on Data Set then shouldn't delete Connection
    available_ds = await get_all_ds_by_dc_uid(db, dc_uid)
    # print("available_ds ==========", available_ds.__dict__)
    if available_ds and len(available_ds) >= 1:
        raise HTTPException(
            status_code=403, detail="Cannot delete Connection. There are dependent Dataset(s)")
    qry_del_ds = DataSet.__table__.delete().where(DataSet.dc_uid == dc_uid)
    await db.execute(qry_del_ds)
    await db.delete(dc_item)
    await db.commit()
    return 1


# updating data connection
async def update_data_connection(db: Session, dc_uid: str,
                                 dc: schema.DataConnectionIn, uid: str):
    dc_info = await get_dc_by_id(db, dc_uid, uid)
    if dc_info is None:
        raise HTTPException(
            status_code=404, detail="Data Connection does not exist")
    # before updating, check if friendly-name is used
    # in other saved connections for the user
    db_dc = await check_friendly_name_in_other_dc(db, uid, dc.friendly_name, dc_uid)
    if db_dc:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already taken")
    # encrypt the password
    dc_info.password = auth.encrypt_password(dc.password)
    dc_info.friendly_name = dc.friendly_name
    dc_info.vendor = dc.vendor
    dc_info.url = dc.url
    dc_info.username = dc.username
    dc_info.port = dc.port
    dc_info.db_name = dc.db_name
    db.commit()
    db.refresh(dc_info)
    return dc_info


# list out all data connections for the user
async def get_all_dc(db: Session, user_id: str):
    all_dc = await db.execute(select(model.DataConnection).where(
        model.DataConnection.user_id == user_id))
    return all_dc.scalars().all()


# check if friendly-name is used elsewhere in other saved data connections for the user
async def check_friendly_name_in_other_dc(db: Session, uid: str, friendly_name: str, dc_uid: str):
    dc = await db.execute(select(model.DataConnection).where(
        and_(
            model.DataConnection.user_id == uid,
            model.DataConnection.friendly_name == friendly_name,
            model.DataConnection.dc_uid != dc_uid)))
    return dc.scalars().first()


# gets connection details by connection friendly-name
async def get_dc_by_friendly_name(db: Session, uid: str, friendly_name: str):
    dc = await db.execute(select(model.DataConnection).where(
        and_(
            model.DataConnection.user_id == uid,
            model.DataConnection.friendly_name == friendly_name)))
    return dc.scalars().first()


# gets connection details by connection ID
async def get_dc_by_id(db: Session, dc_uid: str, uid: str):
    dc = await db.execute(select(model.DataConnection).where(
        and_(
            model.DataConnection.dc_uid == dc_uid,
            model.DataConnection.user_id == uid
        )
    ))
    return dc.scalars().first()


# gets list of all connection details for the user
async def get_dc_by_user(db: Session, uid: str):
    stmt = select(model.DataConnection.dc_uid).where(
        model.DataConnection.user_id == uid
    )
    dc_items = await db.execute(stmt)
    # convert result to list
    dc_list = dc_items.scalars().all()
    if not dc_list:
        raise HTTPException(
            status_code=404, detail="User does not have any Data Connection")
    return dc_list

from fastapi.exceptions import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import and_
from sqlalchemy.sql.expression import update

from . import model, schema, auth


async def create_data_connection(db: Session,
                                 dc: schema.DataConnectionIn,
                                 uid: str):
    dc.password = auth.encrypt_password(dc.password)
    dc_item = model.DataConnection(**dc.dict(), user_id=uid)
    db.add(dc_item)
    await db.flush()
    return dc_item


async def delete_data_connection(db: Session, dc_uid: str):
    dc_item = await get_dc_by_id(db, dc_uid)
    if dc_item is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    await db.delete(dc_item)
    await db.commit()
    # db.flush()
    return 1


async def update_data_connection(db: Session, dc_uid: str,
                                 dc: schema.DataConnectionIn, uid: str):
    dc_info = await get_dc_by_id(db, dc_uid)
    if dc_info is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    db_dc = await get_dc_by_friendly_name(db, uid, dc.friendly_name)
    if db_dc:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already taken")

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


async def get_all_dc(db: Session, user_id: str):
    all_dc = await db.execute(select(model.DataConnection).where(
        model.DataConnection.user_id == user_id))
    return all_dc.scalars().all()


async def get_dc_by_friendly_name(db: Session, uid: str, friendly_name: str):
    dc = await db.execute(select(model.DataConnection).where(
        and_(
            model.DataConnection.user_id == uid,
            model.DataConnection.friendly_name == friendly_name)))
    return dc.scalars().first()


async def get_dc_by_id(db: Session, dc_uid: str):
    dc = await db.execute(select(model.DataConnection).where(
        model.DataConnection.dc_uid == dc_uid))
    return dc.scalars().first()

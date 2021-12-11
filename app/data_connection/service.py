from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import and_

from .import model, schema, auth


async def create_data_connection(db: Session,
                                 dc: schema.DataConnectionIn,
                                 uid: str):
    dc.password = auth.encrypt_password(dc.password)
    dc_item = model.DataConnection(**dc.dict(), user_id=uid)
    db.add(dc_item)
    await db.flush()
    return dc_item


# async def get_dc(db: Session, dc_uid: str):
#     return db.query(model.DataConnection).filter(
#         model.DataConnection.dc_uid == dc_uid).first()


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

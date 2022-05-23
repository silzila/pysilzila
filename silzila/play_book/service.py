from unicodedata import name
from fastapi.exceptions import HTTPException
from sqlalchemy import text, select
from sqlalchemy.orm import Session, Bundle
from sqlalchemy.sql.elements import and_

from . import model, schema
from .model import PlayBook
from ..user.model import User


# to check if play book name is already taken Before Creating
async def get_pb_by_name(db: Session, uid: str, name: str):
    qry_statment = select(PlayBook).join(User).where(
        and_(
            User.uid == uid,
            PlayBook.name == name
        )
    )
    pb = await db.execute(qry_statment)
    pb_info = pb.scalars().first()
    if pb_info:
        return 1
    else:
        return 0


# CREATE PB
async def create_pb(db: Session, uid: str, pb: schema.PlayBook):
    pb_info = model.PlayBook(user_uid=uid, name=pb.name,
                             description=pb.description, content=pb.content)
    db.add(pb_info)
    await db.flush()
    resp = {
        "pb_uid": pb_info.pb_uid,
        "name": pb_info.name,
        "description": pb_info.description,
        "content": pb_info.content
        # time_created & time_updated could not be added
        # "time_created": pb_info.time_created
        # "time_updated": pb_info.time_updated
    }
    return resp


# to check if incoming name is already used in another PB while UPDATING PB
async def check_name_in_other_pb(name: str, pb_uid: str, user_uid: str, db: Session):
    stmt = select(PlayBook).where(
        and_(
            PlayBook.pb_uid != pb_uid,
            PlayBook.name == name,
            PlayBook.user_uid == user_uid
        )
    )
    pb = await db.execute(stmt)
    return pb.scalars().first()


async def update_pb(uid: str, pb_uid: str, db: Session, pb: PlayBook):
    # check if PB exists
    stmt = select(PlayBook).where(
        PlayBook.pb_uid == pb_uid
    )
    _pb_info = await db.execute(stmt)
    pb_info = _pb_info.scalars().first()
    if pb_info is None:
        raise HTTPException(
            status_code=404, detail="Playbook does not exist"
        )
    # check if incoming name is already used in another PB
    pb_data = await check_name_in_other_pb(pb.name, pb_uid, uid, db)
    if pb_data:
        raise HTTPException(
            status_code=400, detail="Play Book Name is already taken"
        )
    # preparing play book data to be modified
    pb_info.name = pb.name
    pb_info.description = pb.description
    pb_info.content = pb.content
    db.commit()
    db.refresh(pb_info)
    # returning of model will be thrown error because of serialization of pb_info, so custom dict
    # return pb_info
    resp = {
        "pb_uid": pb_info.pb_uid,
        "name": pb_info.name,
        "description": pb_info.description,
        "content": pb_info.content,
        "time_created": pb_info.time_created,
        "time_updated": pb_info.time_updated
    }
    return resp


# used in Read & Delete Methods
async def get_pb_by_uid(db: Session, pb_uid: str):
    stmt = select(Bundle("playbook", PlayBook.pb_uid, PlayBook.name, PlayBook.description, PlayBook.time_created, PlayBook.time_updated, PlayBook.content)).where(
        PlayBook.pb_uid == pb_uid
    )
    pb_item = await db.execute(stmt)
    return pb_item.scalars().first()


# List out all PBs. Only Metadata, not PB content
async def get_all_pb(db: Session, user_uid: str):
    stmt = select(Bundle("playbook", PlayBook.pb_uid, PlayBook.name, PlayBook.description, PlayBook.time_created, PlayBook.time_updated)).join(User).where(
        User.uid == user_uid
    )
    pb_records = await db.execute(stmt)
    return pb_records.scalars().all()


# List out names of all PBs which is using a specific DS
async def get_all_pb_by_ds(ds_uid: str, db: Session, user_uid: str):
    stmt = select(Bundle("playbook", PlayBook.pb_uid, PlayBook.name, PlayBook.description, PlayBook.content)).join(User).where(
        User.uid == user_uid
    )
    pb_records = await db.execute(stmt)
    pb_list = pb_records.scalars().all()
    pbs_containing_ds = []  # will hold the final result
    # iterating all the PlayBooks
    for pb in pb_list:
        # iterating all the data sources in the PB
        for ds in pb['content']['tabTileProps']['selectedDataSetList']:
            if ds['ds_uid'] == ds_uid:
                pbs_containing_ds.append(
                    {'pb_uid': pb['pb_uid'], 'name': pb['name']})
    return pbs_containing_ds


# Delete PB


async def delete_by_pb_uid(db: Session, pb_uid: str):
    pb_item = await get_pb_by_uid(db, pb_uid)
    if pb_item is None:
        raise HTTPException(
            status_code=404, detail="Play Book does not exist"
        )
    qry = PlayBook.__table__.delete().where(PlayBook.pb_uid == pb_uid)
    await db.execute(qry)
    await db.commit()
    return 1

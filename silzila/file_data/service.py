from fastapi.exceptions import HTTPException
from sqlalchemy import select, update
from sqlalchemy.orm import Session, Bundle
from sqlalchemy.sql.elements import and_

from . import model, schema
from .model import FileData


# adding file record record to DB
async def create_file_data(db: Session,
                           fd: schema.FileData,
                           uid: str):
    fd_item = model.FileData(**fd, user_id=uid)
    db.add(fd_item)
    await db.flush()
    return fd_item


async def get_fd_by_name(db: Session, fd_name: str, uid: str):
    print("inside get_fd_by_name fn -----------")
    fd = await db.execute(select(model.FileData).where(
        and_(
            model.FileData.user_id == uid,
            model.FileData.table_name == fd_name
        )
    ))
    print("end of get_fd_by_name fn -----------")
    return fd.scalars().first()


# get all file data list
async def get_all_fd(db: Session, user_id: str):
    stmt = select(Bundle("filedata", FileData.fd_uid, FileData.table_name)).where(
        FileData.user_id == user_id
    )
    all_fd = await db.execute(stmt)
    return all_fd.scalars().all()


# gets file data metadata & sample records by file data ID
async def get_fd_by_id(db: Session, fd_uid: str, uid: str):
    dc = await db.execute(select(FileData).where(
        and_(
            FileData.fd_uid == fd_uid,
            FileData.user_id == uid
        )
    ))
    return dc.scalars().first()


# gets sample records by file data ID
async def get_fd_sample_records_by_id(db: Session, fd_uid: str, uid: str):
    stmt = select(Bundle("filedata", FileData.fd_uid, FileData.table_name, FileData.sample_records)).where(
        and_(
            FileData.fd_uid == fd_uid,
            FileData.user_id == uid
        )
    )
    dc = await db.execute(stmt)
    return dc.scalars().first()


# gets table metadata by file data ID
async def get_fd_meta_data_by_id(db: Session, fd_uid: str, uid: str):
    stmt = select(Bundle("filedata", FileData.fd_uid, FileData.table_name, FileData.meta_data)).where(
        and_(
            FileData.fd_uid == fd_uid,
            FileData.user_id == uid
        )
    )
    dc = await db.execute(stmt)
    return dc.scalars().first()

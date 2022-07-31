from fastapi.exceptions import HTTPException
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import and_

from . import model, schema


# adding file record record to DB
async def create_file_data(db: Session,
                           fd: schema.FileData,
                           uid: str):
    fd_item = model.FileData(**fd, user_id=uid)
    db.add(fd_item)
    await db.flush()
    return fd_item

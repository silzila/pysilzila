from sqlalchemy.orm import Session
from sqlalchemy import select
from passlib.hash import bcrypt
from sqlalchemy.sql.functions import mode

from .import model, schema


async def get_user(db: Session, uid: str):
    user = await db.execute(select(model.User).where(model.User.uid == uid))
    # print(user.all())
    # return user.all()
    return user.scalars().first()


async def get_user_by_email(db: Session, email: str):
    # return db.execute(select(model.User).filter(model.User.email == email))
    user = await db.execute(select(model.User).where(model.User.email == email))
    return user.scalars().first()


async def create_user(db: Session, user: schema.UserIn):
    password_hash = bcrypt.hash(user.password)
    db_user = model.User(name=user.name, email=user.email,
                         password_hash=password_hash)
    db.add(db_user)
    await db.flush()
    return db_user

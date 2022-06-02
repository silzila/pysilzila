from sqlalchemy.orm import Session
from sqlalchemy import select
from passlib.hash import bcrypt
from sqlalchemy.sql.functions import mode

from .import model, schema


# search User by User ID
async def get_user(db: Session, uid: str):
    user = await db.execute(select(model.User).where(model.User.uid == uid))
    return user.scalars().first()


# search User by Email ID
async def get_user_by_email(db: Session, email: str):
    user = await db.execute(select(model.User).where(model.User.email == email))
    return user.scalars().first()


# Add user to DB with encrypted password
async def create_user(db: Session, user: schema.UserIn):
    password_hash = bcrypt.hash(user.password)
    db_user = model.User(name=user.name, email=user.email,
                         password_hash=password_hash)
    db.add(db_user)
    await db.flush()
    return db_user

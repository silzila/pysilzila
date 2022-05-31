from passlib.hash import bcrypt
import shortuuid
from pydantic import BaseModel
from pydantic.networks import EmailStr
from sqlalchemy import Column, Integer, String, func
from sqlalchemy.sql.sqltypes import Boolean, DateTime
from ..database.config import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    uid = Column(String, nullable=False, unique=True, index=True,
                 default=lambda: shortuuid.ShortUUID().random(length=10))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(),
                        onupdate=func.current_timestamp())
    is_active = Column(Boolean, default=False)
    confirmation = Column(String, nullable=False,
                          default=lambda: shortuuid.ShortUUID().random(length=32))

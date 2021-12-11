from pydantic.main import BaseModel
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.config import Base
import shortuuid
# from pydantic.networks import AnyUrl


class DataConnection(Base):
    __tablename__ = "data_connection"

    id = Column(Integer, primary_key=True)
    dc_uid = Column(String, nullable=False, unique=True, index=True
                    default=lambda: shortuuid.ShortUUID().random(length=4))
    friendly_name = Column(String, nullable=False, unique=True)
    vendor = Column(String, nullable=False)
    url = Column(String, nullable=False)
    port = Column(Integer, nullable=False)
    db_name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

from email.policy import default
from sqlalchemy.sql.sqltypes import JSON
from ..database.config import Base
import shortuuid
from sqlalchemy import Column, ForeignKey, String, Integer, DateTime
from sqlalchemy.sql import func


class PlayBook(Base):
    __tablename__ = "play_book"

    id = Column(Integer, primary_key=True)
    pb_uid = Column(String, nullable=False, unique=True, index=True,
                    default=lambda: shortuuid.ShortUUID().random(length=8))
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    # create_time = Column(DateTime(timezone=True), server_default=func.now()
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    content = Column(JSON, nullable=False)
    user_uid = Column(String, ForeignKey("user.uid"), nullable=False)

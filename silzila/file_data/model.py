from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.sql.sqltypes import JSON

from ..database.config import Base

import shortuuid


# class used for creating file data table
class FileData(Base):
    __tablename__ = "file_data"

    id = Column(Integer, primary_key=True)
    fd_uid = Column(String, nullable=False, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    table_name = Column(String, nullable=False)
    meta_data = Column(JSON, nullable=False)
    sample_records = Column(JSON, nullable=False)

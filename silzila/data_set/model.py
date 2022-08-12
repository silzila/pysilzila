from sqlalchemy.sql.sqltypes import JSON
from ..database.config import Base
import shortuuid
from sqlalchemy import Column, String, Integer, ForeignKey, Boolean


# class for Dataset Table
class DataSet(Base):
    __tablename__ = "data_set"

    id = Column(Integer, primary_key=True)
    ds_uid = Column(String, nullable=False, unique=True, index=True,
                    default=lambda: shortuuid.ShortUUID().random(length=6))
    dc_uid = Column(String, ForeignKey(
                    "data_connection.dc_uid"), nullable=True)
    friendly_name = Column(String, nullable=False, unique=True)
    is_file_data = Column(Boolean, nullable=False, default=False)
    user_uid = Column(String, ForeignKey("user.uid"), nullable=False)
    data_schema = Column(JSON, nullable=False)

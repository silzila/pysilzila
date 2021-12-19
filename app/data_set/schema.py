from pydantic import BaseModel
from typing import Optional, List


class Table(BaseModel):
    table_name: str
    schema_name: str


class Relationship(BaseModel):
    table1: str
    table2: str
    type: str
    table1_columns: List[str]
    table2_columns: List[str]


class DataSchema(BaseModel):
    tables: List[Table]
    relationships: Optional[List[Relationship]]


class DataSetIn(BaseModel):
    dc_uid: str
    friendly_name: str
    data_schema: DataSchema


class DataSetOut(BaseModel):
    dc_uid: str
    ds_uid: str
    friendly_name: str
    data_schema: DataSchema

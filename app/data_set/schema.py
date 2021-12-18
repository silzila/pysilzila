from pydantic import BaseModel


class Table(BaseModel):
    table_name: str
    schema_name: str


class Relationship(BaseModel):
    table1: str
    table2: str
    type: str
    table1_columns: list[str]
    table2_columns: list[str]


# class Tables(Table):
#     tables: list[Table]


# class Relationships(Relationship):
#     relationships: list[Relationship]


class DataSetIn(BaseModel):
    dc_uid: str
    friendly_name: str
    tables: list[Table]
    relationships: list[Relationship]


class DataSetOut(BaseModel):
    dc_uid: str
    ds_uid: str
    friendly_name: str
    tables: list[Table]
    relationships: list[Relationship]

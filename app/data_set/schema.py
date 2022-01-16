from pydantic import BaseModel
from typing import Optional, List

####################### Data Set Creation #########################


class Table(BaseModel):
    table_name: str
    schema_name: str
    id: str


class Relationship(BaseModel):
    table1: str
    table2: str
    cardinality: str
    ref_integrity: str
    table1_columns: List[str]
    table2_columns: List[str]


class RelationshipOut(BaseModel):
    table1: str
    table2: str
    cardinality: str
    ref_integrity: str
    table1_columns: List[str]
    table2_columns: List[str]


class DataSchema(BaseModel):
    tables: List[Table]
    relationships: Optional[List[Relationship]]


class DataSchemaOut(BaseModel):
    tables: List[Table]
    relationships: Optional[List[RelationshipOut]]


class DataSetIn(BaseModel):
    dc_uid: str
    friendly_name: str
    data_schema: DataSchema


class DataSetOut(BaseModel):
    dc_uid: str
    ds_uid: str
    friendly_name: str
    data_schema: DataSchemaOut

####################### Data Set Query #########################


class Dim(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: str
    aggr: str
    expr: str


class Field(BaseModel):
    table_id: str
    field_name: str
    display_name: str


class Filter(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: str
    aggr: str
    include_exclude: str
    expr_type: str
    expr: str


class Query(BaseModel):
    dims: Optional[List[Dim]]
    measures: Optional[List[Dim]]
    fields: Optional[List[Field]]
    filters: Optional[List[Filter]]


class ColumnFilter(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: str
    filter_type: Optional[str]
    aggr: Optional[str]

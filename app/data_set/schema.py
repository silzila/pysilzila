from pydantic import BaseModel
from typing import Optional, List, Any
# from typing import Literal # 3.8 and above
from typing_extensions import Literal  # 3.7 and below

####################### Data Set Creation #########################


class Table(BaseModel):
    table_name: str
    schema_name: str
    id: str
    alias: str


class Tables(BaseModel):
    __root__: List[Table]


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
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    time_grain: Optional[Literal['year',
                                 'month', 'quarter', 'dayofweek', 'day']]
    expr: Optional[str]


class Measure(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    aggr: Literal['sum', 'avg', 'min', 'max', 'count',
                  'countnonnull', 'countnull', 'countunique']
    time_grain: Optional[Literal['year',
                                 'month', 'quarter', 'dayofweek', 'day']]
    expr: Optional[str]


class Field(BaseModel):
    table_id: str
    field_name: str
    display_name: str


class Filter(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    user_selection: Optional[List[Any]]
    aggr: Optional[Literal['year', 'month', 'quarter', 'dayofweek', 'day']]
    negate: Optional[bool]
    expr_type: Optional[Literal['equal_to', 'not_equal_to', 'greater_than', 'less_than',
                                'greater_than_equal_to', 'less_than_equal_to', 'between']]
    expr: Optional[List[Any]]


class Query(BaseModel):
    dims: Optional[List[Dim]]
    measures: Optional[List[Measure]]
    fields: Optional[List[Field]]
    filters: Optional[List[Filter]]


class ColumnFilter(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: str
    filter_type: Optional[str]
    aggr: Optional[str]

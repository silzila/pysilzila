from pydantic import BaseModel
from typing import Optional, List, Any
# from typing import Literal # 3.8 and above
from typing_extensions import Literal  # 3.7 and below

####################### Data Set Creation #########################


class TablePosition(BaseModel):
    x: int
    y: int


class Table(BaseModel):
    table_name: str
    schema_name: str
    id: str
    file_data_id: Optional[str]
    alias: str
    table_position: Optional[TablePosition]


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
    dc_uid: Optional[str]
    friendly_name: str
    is_file_data: bool
    data_schema: DataSchema


class DataSetOut(BaseModel):
    dc_uid: Optional[str]
    ds_uid: str
    friendly_name: str
    is_file_data: bool
    data_schema: DataSchemaOut

####################### Data Set Query #########################


class Dim(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    time_grain: Optional[Literal['year', 'quarter', 'month',
                                 'yearquarter', 'yearmonth', 'date', 'dayofweek', 'dayofmonth']]
    expr: Optional[str]


class Measure(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    aggr: Literal['sum', 'avg', 'min', 'max', 'count',
                  'countnn', 'countn', 'countu']
    time_grain: Optional[Literal['year', 'quarter',
                                 'month', 'date', 'dayofweek', 'dayofmonth']]
    expr: Optional[str]


class Field(BaseModel):
    table_id: str
    field_name: str
    display_name: str


class Filter(BaseModel):
    filter_type: Literal['text_user_selection', 'text_search', 'number_user_selection',
                         'number_search', 'date_user_selection', 'date_search']
    table_id: str
    field_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    exclude: Optional[bool]
    time_grain: Optional[Literal['year', 'quarter', 'month',
                                 'yearquarter', 'yearmonth', 'date', 'dayofmonth', 'dayofweek']]
    condition: Optional[Literal['equal_to', 'not_equal_to', 'greater_than', 'less_than',
                                'greater_than_or_equal_to', 'less_than_or_equal_to', 'between',
                                'begins_with', 'ends_with', 'contains']]
    user_selection: List[Any]


class FiltersPanel(BaseModel):
    panel_name: str
    any_condition_match: bool
    filters: List[Filter]


class Query(BaseModel):
    dims: Optional[List[Dim]]
    measures: Optional[List[Measure]]
    fields: Optional[List[Field]]
    filters: Optional[List[FiltersPanel]]


############################################################################
#################### To populte dropped fields in Filter ###################
############################################################################
# API: /ds/filter-options/<dc uid>/<ds uid>

# class CalendarPeriod(BaseModel):
#     span_type: Literal['calendar']
#     last: int
#     next: int


# class RollingPeriod(BaseModel):
#     span_type: Literal['rolling']
#     last: int
#     next: int


# class CalendarToRollingPeriod(BaseModel):
#     span_type: Literal['calendar_to_rolling']
#     last: int
#     next: int


# class RollingToCalendarPeriod(BaseModel):
#     span_type: Literal['rolling_to_calendar']
#     last: int
#     next: int


class ColumnFilterRegular(BaseModel):
    table_id: str
    field_name: str
    display_name: str
    data_type: Literal['text', 'integer',
                       'decimal', 'boolean', 'date', 'timestamp']
    filter_type: Literal['pick_from_list',
                         'search_condition', 'aggregate_level_match']
    aggr: Optional[Literal['sum', 'avg', 'min', 'max', 'count',
                           'countnn', 'countn', 'countu']]
    time_grain: Optional[Literal['year', 'quarter',
                                 'month', 'yearquarter', 'yearmonth', 'date', 'dayofweek', 'dayofmonth']]


# class ColumnFilterRelativeSpan(BaseModel):
#     table_id: Optional[str]
#     field_name: Optional[str]
#     display_name: Optional[str]
#     data_type: Literal['date', 'timestamp']
#     filter_type: Literal['today', 'tomorrow',
#                          'yesterday', 'column_latest_date']
#     time_grain: Optional[Literal['year', 'quarter', 'month',
#                                  'day', 'week', 'week2']]
#     relative_span_options: Optional[Union[CalendarPeriod, RollingPeriod,
#                                           CalendarToRollingPeriod, RollingToCalendarPeriod]]


# class ColumnFilter(BaseModel):
#     regular_filter: Optional[ColumnFilterRegular]
#     # relative_filter: Optional[ColumnFilterRelativeSpan]


class ColumnFilter(BaseModel):
    filter_type: Literal['text_user_selection', 'number_user_selection',
                         'number_search', 'date_user_selection', 'date_search', 'today', 'tomorrow', 'yesterday', 'column_latest_date']
    table_id: Optional[str]
    field_name: Optional[str]
    display_name: Optional[str]
    data_type: Optional[Literal['text', 'integer',
                                'decimal', 'boolean', 'date', 'timestamp']]
    # filter_type: Optional[Literal['pick_from_list',
    #                      'search_condition', 'aggregate_level_match']]
    # aggr: Optional[Literal['sum', 'avg', 'min', 'max', 'count',
    #                        'countnn', 'countn', 'countu']]
    time_grain: Optional[Literal['year', 'quarter',
                                 'month', 'yearquarter', 'yearmonth', 'date', 'dayofweek', 'dayofmonth']]

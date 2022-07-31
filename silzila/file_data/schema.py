from pydantic import BaseModel
from typing import Optional, List, Any
# from typing import Literal # 3.8 and above
from typing_extensions import Literal  # 3.7 and below


class Column(BaseModel):
    column_name: str
    data_type: Literal['integer', 'text',
                       'decimal', 'boolean', 'date', 'timestamp']
    new_data_type: Optional[Literal['integer', 'text',
                                    'decimal', 'boolean', 'date', 'timestamp']]
    decimal_place: Optional[List[int]]
    new_column_name: Optional[str]
    column_format: Optional[str]


class EditTableSchema(BaseModel):
    file_id: str
    table_name: str
    meta_cols: Optional[List[Column]]


class FileData(BaseModel):
    fd_uid: str
    table_name: str
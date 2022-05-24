from pydantic import BaseModel, Json
from typing import Optional, List, Any
from datetime import datetime
# from typing import Literal # 3.8 and above
from typing_extensions import Literal

from sqlalchemy import true  # 3.7 and below


class PlayBook(BaseModel):
    name: str
    description: Optional[str]
    content: dict


class PlayBookOut(BaseModel):
    pb_uid: str
    name: str
    description: Optional[str]
    time_updated: Optional[datetime]
    time_created: Optional[datetime]
    content: dict

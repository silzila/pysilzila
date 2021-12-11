from pydantic import BaseModel


class DataConnectionIn(BaseModel):
    friendly_name: str
    vendor: str
    url: str
    port: int
    db_name: str
    username: str
    password: str


class DataConnectionOut(BaseModel):
    friendly_name: str
    vendor: str
    url: str
    port: int
    db_name: str
    username: str

    class Config:
        orm_mode = True

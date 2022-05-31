from pydantic import BaseModel


# incoming request Data connection details
class DataConnectionIn(BaseModel):
    friendly_name: str
    vendor: str
    url: str
    port: int
    db_name: str
    username: str
    password: str


# to hold data in-memory for data connection
class DataConnectionPool(DataConnectionIn):
    dc_uid: str
    decrypted_password: str


# outgoing response of Data connection details
class DataConnectionOut(BaseModel):
    dc_uid: str
    friendly_name: str
    vendor: str
    url: str
    port: int
    db_name: str
    username: str

    class Config:
        orm_mode = True

from pydantic import BaseModel
from pydantic.networks import EmailStr


# user base model
class UserBase(BaseModel):
    uid: str

    class Config:
        orm_mode = True


# for user request
class UserIn(BaseModel):
    name: str
    email: EmailStr
    password: str


# for user response
class UserOut(BaseModel):
    uid: str
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

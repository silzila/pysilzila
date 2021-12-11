from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.service import get_db
from . import model, schema, service

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/")
async def user_home():
    return {"message": "You are in User Home"}


# , response_model=schema.UserOut
@router.post("/user", response_model=schema.UserOut)
async def create_user(user: schema.UserIn, db: Session = Depends(get_db)):
    db_user = await service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email alreay registered")
    else:
        # return {"one": "two"}
        return await service.create_user(db=db, user=user)


@router.get("/user/{uid}", response_model=schema.UserOut)
async def read_user(uid: str,  db: Session = Depends(get_db)):
    db_user = await service.get_user(db, uid=uid)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

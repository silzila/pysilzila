from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette.requests import Request
from passlib.hash import bcrypt

from ..database.service import get_db
from . import model, schema, service
from . import auth

router = APIRouter(prefix="/user", tags=["User"])

# this is endpoint where DOCS Authorize end point will check
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/signin")


@router.get("/")
async def user_home():
    return {"message": "You are in User Home"}


@router.get("/protected", dependencies=[Depends(auth.JWTBearer())])
async def protected_route(request: Request) -> dict:
    return {"UID": request.state.uid}


@router.post("/signup", response_model=schema.UserOut)
async def create_user(user: schema.UserIn, db: Session = Depends(get_db)):
    db_user = await service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email alreay registered")
    else:
        # return {"one": "two"}
        return await service.create_user(db=db, user=user)


@router.post("signin")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(),
                     db: Session = Depends(get_db)):
    db_user = await service.get_user_by_email(db, email=form_data.username)
    if not db_user:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password")
    if not bcrypt.verify(form_data.password, db_user.password_hash):
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password")
    return auth.signJWT(db_user.uid)


@router.get("/user/{uid}", response_model=schema.UserOut)
async def read_user(uid: str,  db: Session = Depends(get_db)):
    db_user = await service.get_user(db, uid=uid)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette.requests import Request
from passlib.hash import bcrypt

from ..database.service import get_db
from . import model, schema, service
from . import auth

# any API in this route gets /user Prefix
router = APIRouter(prefix="/user", tags=["User"])

# this is endpoint where Swagger DOCS Authorize end point will check
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/signin")


# end point where only logged in user can get response
# testing purpose - not used by Frontend
@router.get("/protected", dependencies=[Depends(auth.JWTBearer())])
async def protected_route(request: Request) -> dict:
    return {"UID": request.state.uid}


# New Signup for any user
@router.post("/signup", response_model=schema.UserOut)
async def create_user(user: schema.UserIn, db: Session = Depends(get_db)):
    # check if the email is already in use
    db_user = await service.get_user_by_email(db, email=user.email)
    # if email already exists, send out error
    if db_user:
        raise HTTPException(status_code=400, detail="Email alreay registered")
    # on success, create user in DB and return response
    return await service.create_user(db=db, user=user)


# Signin for user
@router.post("/signin")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(),
                     db: Session = Depends(get_db)):
    # check if the email is already in use
    db_user = await service.get_user_by_email(db, email=form_data.username)
    # if email not exists, send out error
    if not db_user:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password")
    # compare password, if not matchnig, send out error
    if not bcrypt.verify(form_data.password, db_user.password_hash):
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password")
    # on success, send out JWT TOKEN
    return auth.signJWT(db_user.uid)


# to get user details
# testing purpose - not used by Frontend
@router.get("/user/{uid}", response_model=schema.UserOut)
async def read_user(uid: str,  db: Session = Depends(get_db)):
    db_user = await service.get_user(db, uid=uid)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

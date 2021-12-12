from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette.requests import Request

from ..database.service import get_db
from . import model, schema, service, auth
from . import engine
from ..user.auth import JWTBearer


router = APIRouter(prefix="/dc", tags=["Data Connection"],
                   dependencies=[Depends(JWTBearer())])


@router.get("/")
async def dc_home():
    return {"message": "You are in DC Home"}


@router.post("/test-dc")
async def test_dc(dc: schema.DataConnectionIn,
                  db: Session = Depends(get_db)):
    return await engine.test_connection(dc)


@router.post("/create-dc", response_model=schema.DataConnectionOut)
async def create_dc(request: Request,
                    dc: schema.DataConnectionIn,
                    db: Session = Depends(get_db)):
    uid = request.state.uid
    db_dc = await service.get_dc_by_friendly_name(db, uid, dc.friendly_name)
    if db_dc:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already used")
    db_dc = await service.create_data_connection(db, dc, uid)
    if db_dc is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return db_dc


@router.get("/connect-dc/{dc_uid}")
async def connect_dc(dc_uid: str, db: Session = Depends(get_db)):
    db_dc = await service.get_dc_by_id(db, dc_uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    # db_dc.de = auth.decrypt_password(db_dc.password)
    # return {"message": db_dc}
    is_connected = await engine.create_connection(db_dc)
    if is_connected:
        return {"message": "success"}
    else:
        raise HTTPException(
            status_code=500, detail="Could not make Data Connection")


@router.get("/get-dc/{dc_uid}", response_model=schema.DataConnectionOut)
async def read_dc(dc_uid: str, db: Session = Depends(get_db)):
    db_dc = await service.get_dc_by_id(db, dc_uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    return db_dc


@router.get("/get-all-dc", response_model=List[schema.DataConnectionOut])
async def get_all_dc(request: Request, db: Session = Depends(get_db)):
    db_dc = await service.get_all_dc(db, request.state.uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    return db_dc

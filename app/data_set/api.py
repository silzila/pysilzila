from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette.requests import Request
import json

from ..database.service import get_db
from . import model, schema, service

router = APIRouter(prefix="/ds", tags=["Data Set"])


@router.get("/")
async def ds_home():
    return {"message": "You are in DS Home"}


@router.post("/create-ds")  # , response_model=schema.DataSetOut)
async def create_ds(ds: schema.DataSetIn, db: Session = Depends(get_db)):
    # print("--------------------------------")
    # print(ds.dict())
    # print("--------------------------------")
    # print(json.dumps(ds.dict()))
    # return {"x": "y"}
    db_ds = await service.create_data_set(db, ds)
    if db_ds is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return db_ds

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette.requests import Request


from ..database.service import get_db
from . import model, schema, service
from . import query_builder
from ..user.auth import JWTBearer
from ..data_connection import engine

router = APIRouter(prefix="/ds", tags=["Data Set"])


@router.get("/")
async def ds_home():
    return {"message": "You are in DS Home"}


@router.post("/create-ds", response_model=schema.DataSetOut, dependencies=[Depends(JWTBearer())])
async def create_ds(request: Request, ds: schema.DataSetIn, db: Session = Depends(get_db)):
    uid = request.state.uid
    friendly_name_taken = await service.get_ds_by_friendly_name(db, uid, ds.friendly_name)
    if friendly_name_taken:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already used")
    # return {"dummy": "things"}
    db_ds = await service.create_ds(db, ds)
    if db_ds is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return db_ds


@router.get("/get-all-ds", dependencies=[Depends(JWTBearer())])
async def get_all_ds(request: Request, db: Session = Depends(get_db)):
    db_ds = await service.get_all_ds(db, request.state.uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    return db_ds


@router.get("/get-ds/{ds_uid}", response_model=schema.DataSetOut)
async def read_ds(ds_uid: str, db: Session = Depends(get_db)):
    db_ds = await service.get_ds_by_id(db, ds_uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    return db_ds


@router.get("/connect-ds/{ds_uid}")
async def connect_ds(ds_uid: str, db: Session = Depends(get_db)):
    # first, check if DS available
    db_ds = await service.get_ds_by_id(db, ds_uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    is_activated = await engine.activate_ds(db_ds)
    if is_activated is None:
        raise HTTPException(
            status_code=404, detail="Data Set Could not be activated")
    return {"message": "Data Set is Activated"}


@router.post("/query/{dc_uid}/{ds_uid}")
async def query(query: schema.Query, dc_uid: str, ds_uid: str):
    qry_composed = await query_builder.compose_query(query, dc_uid, ds_uid)
    print("^^^^^^^^^^^^^^^^ final Query ^^^^^^^^^^\n", qry_composed)
    try:
        qry_result = engine.run_query(dc_uid, qry_composed)
        # print("++++++++++++++++ qry result +++++++++++++++++", qry_result)
        return {"query": qry_composed, "result": qry_result}
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=error)

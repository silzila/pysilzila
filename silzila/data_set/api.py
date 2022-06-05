from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette.requests import Request

# from ...silzila import logger
from ..query_builder import query_composer
from ..query_builder import query_composer_filter
from ..database.service import get_db
from . import model, schema, service
from ..user.auth import JWTBearer
from ..data_connection import engine
from ..data_connection.service import get_dc_by_id

# any API in this route gets /ds Prefix and requires TOKEN
router = APIRouter(prefix="/ds", tags=["Data Set"],
                   dependencies=[Depends(JWTBearer())])


# create Data Set
@router.post("/create-ds", response_model=schema.DataSetOut)
async def create_ds(request: Request, ds: schema.DataSetIn, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    # check if DC exists
    db_dc = await get_dc_by_id(db, ds.dc_uid, uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    # check if friendly name is already taken
    friendly_name_taken = await service.get_ds_by_friendly_name(db, uid, ds.friendly_name)
    if friendly_name_taken:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already used")
    # add DS record to table
    db_ds = await service.create_ds(db, ds)
    if db_ds is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return db_ds


# update Data Set
@router.put("/update-ds/{ds_uid}", response_model=schema.DataSetOut)
async def update_ds(ds_uid: str, request: Request, ds: schema.DataSetIn, db: Session = Depends(get_db)):
    uid = request.state.uid
    # checking friendly name is handled in service call
    ds_info = await service.update_data_set(db, ds_uid, ds, uid)
    if ds_info:
        return ds_info
    else:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")


# get all Data Set of User
@router.get("/get-all-ds")
async def get_all_ds(request: Request, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    db_ds = await service.get_all_ds(db, uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    return db_ds


# get all Data Set by Data Connection
@router.get("/get-all-ds-by-dc_uid/{dc_uid}")
async def get_ds_by_dc_uid(dc_uid: str, request: Request, db: Session = Depends(get_db)):
    db_ds = await service.get_all_ds_by_dc_uid(db, dc_uid)
    if db_ds is None or len(db_ds) == 0:
        raise HTTPException(
            status_code=404, detail="No Data Set available for the Data Connection")
    return {"friendly_name": db_ds}


# get Data Set by it's ID
@router.get("/get-ds/{ds_uid}", response_model=schema.DataSetOut)
async def read_ds(ds_uid: str, db: Session = Depends(get_db)):
    db_ds = await service.get_ds_by_id(db, ds_uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    return db_ds


# get table names used in Data Set
@router.get("/get-ds-tables/{ds_uid}", response_model=schema.Tables)
async def read_ds(ds_uid: str, db: Session = Depends(get_db)):
    db_ds = await service.get_ds_by_id(db, ds_uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="Data Set not exists")
    return dict(db_ds).get('data_schema').get('tables')


# delete Data Set
@router.delete("/delete-ds/{ds_uid}")
async def delete_ds(ds_uid: str, request: Request, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    deleted = await service.delete_ds(db, ds_uid, uid)
    if deleted is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return {"message": "Data Set is deleted"}


# loads data set into in-memory for fast query building
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


async def activate_dc_ds(dc_uid: str, ds_uid: str, uid: str, db: Session) -> str:
    """this function activates both DC & DS if not activated

    RUNNING QUERY requires 4 steps:
    1. create DB pool for the DC (One time. Subsequently used from in-memorry for fast operation)
    2. Load Schema of DS (One time. Subsequently used from in-memorry for fast operation)
    3. Get Vendor (Dialect) Name and Build Query (Every time. Query is built based on Dialect)
    4. Run the built query with the DB Pool

    if pool available for the DC, get dialect name
    else activate pool for the DC and then get dialect name
    dialect name (vendor name) is required to custom build query
    """
    vendor_name = False
    vendor_name = await engine.get_vendor_name_from_db_pool(dc_uid)
    if vendor_name == False:
        db_dc = await get_dc_by_id(db, dc_uid, uid)
        if db_dc is None:
            raise HTTPException(
                status_code=404, detail="Data Connection not exists")
        connected = await engine.create_connection(db_dc)
        if not connected:
            raise HTTPException(
                status_code=500, detail="Could not make Data Connection")
        vendor_name = await engine.get_vendor_name_from_db_pool(dc_uid)
    #################################################################################
    # loads DS. checks if already loaded, if not loaded, loads it
    is_ds_loaded = await engine.is_ds_active(dc_uid, ds_uid)
    if is_ds_loaded == False:
        # first, check if DS available
        db_ds = await service.get_ds_by_id(db, ds_uid)
        if db_ds is None:
            raise HTTPException(
                status_code=404, detail="Data Set not exists")
        is_activated = await engine.activate_ds(db_ds)
        if is_activated is None:
            raise HTTPException(
                status_code=404, detail="Data Set Could not be activated")
    return vendor_name


# gets user interaction as DIMS and Measure and
# returns SQL Query and Result
@router.post("/query/{dc_uid}/{ds_uid}")
async def query(request: Request, query: schema.Query, dc_uid: str, ds_uid: str, db: Session = Depends(get_db)):
    # at least one column should be sent in query, else raise error
    if not (query.dims or query.measures):
        # logger.exception("one Dim or one Mesure is needed")
        raise HTTPException(
            status_code=401, detail="At least one dim or measue should be provided")
    # get User ID from JWT token coming in request
    uid = request.state.uid
    vendor_name = await activate_dc_ds(dc_uid, ds_uid, uid, db)
    qry_composed = await query_composer.compose_query(query, dc_uid, ds_uid, vendor_name)
    # print("^^^^^^^^^^^^^^^^ final Query ^^^^^^^^^^\n", qry_composed)
    try:
        qry_result = await engine.run_query(dc_uid, qry_composed)
        return {"query": qry_composed, "result": qry_result}
    except Exception as error:
        # logger.exception("Something Wrong in query execution")
        raise HTTPException(
            status_code=401, detail="something went wrong in running query")


# Future Development
# Gets Column name and returns Column Values to be populated in Filter
@ router.post("/filter-options/{dc_uid}/{ds_uid}")
async def query_filter(request: Request, query: schema.ColumnFilter, dc_uid: str, ds_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    vendor_name = await activate_dc_ds(dc_uid, ds_uid, uid, db)
    qry_composed = await query_composer_filter.compose_query(query, dc_uid, ds_uid, vendor_name)
    # try:
    qry_result = await engine.run_query_filter(dc_uid, qry_composed)
    return qry_result
    # except Exception as error:
    #     raise HTTPException(
    #         status_code=500, detail=error)


# Future Development
# Testing
# @ router.post("/filter-options-get-today-date/{day}")
# async def query_filter_date(day: str, dc_uid: str, ds_uid: str, db: Session = Depends(get_db)):
#     vendor_name = await activate_dc_ds(dc_uid, ds_uid, db)
#     print("Vendor Name =====", vendor_name)
#     qry_composed = await query_composer_filter.compose_query(query, dc_uid, ds_uid, vendor_name)
#     # try:
#     qry_result = await engine.run_query_filter(dc_uid, qry_composed)
#     return qry_result

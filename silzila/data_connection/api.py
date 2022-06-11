from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette.requests import Request

from ..database.service import get_db
from . import model, schema, service, auth
from . import engine
from ..user.auth import JWTBearer


# any API in this route gets /dc Prefix and requires TOKEN
router = APIRouter(prefix="/dc", tags=["Data Connection"],
                   dependencies=[Depends(JWTBearer())])


# tells if test connection can be estabilished with the user's DB
@router.post("/test-dc")
async def test_dc(dc: schema.DataConnectionIn,
                  db: Session = Depends(get_db)):
    return await engine.test_connection(dc)


# closes a connection pool of a data connection
@router.post("/close-dc/{dc_uid}")
async def close_dc(dc_uid: str):
    closed = await engine.close_connection(dc_uid)
    if closed:
        return {"message": "Connection is closed"}


# closes all connection pool of a user
@router.post("/close-all-dc")
async def close_all_dc(request: Request, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    # get DC list for the user
    user_dc_list = await service.get_dc_by_user(db, uid)
    # closes all connection pool
    closed = await engine.close_all_connection(user_dc_list)
    if closed is not True:
        raise HTTPException(
            status_code=500, detail="Connections could not be closed")
    return {"message": "All Connections are closed for the user"}


# create new data connection
@router.post("/create-dc", response_model=schema.DataConnectionOut)
async def create_dc(request: Request,
                    dc: schema.DataConnectionIn,
                    db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    # first check if data connection name is already taken for another dc
    db_dc = await service.get_dc_by_friendly_name(db, uid, dc.friendly_name)
    if db_dc:
        raise HTTPException(
            status_code=400, detail="Friendlly Name is already used")
    db_dc = await service.create_data_connection(db, dc, uid)
    if db_dc is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return db_dc


# delete data connection
@router.delete("/delete-dc/{dc_uid}")
async def delete_dc(request: Request, dc_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    deleted = await service.delete_data_connection(db, dc_uid, uid)
    if deleted is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return {"message": "Data Connection is deleted"}


# update data connection
@router.put("/update-dc/{dc_uid}", response_model=schema.DataConnectionOut)
async def update_dc(dc_uid: str, request: Request,
                    dc: schema.DataConnectionIn,
                    db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    dc_info = await service.update_data_connection(db, dc_uid, dc, uid)
    if dc_info:
        return dc_info
    else:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")


# creates connection pool
@router.get("/connect-dc/{dc_uid}")
async def connect_dc(request: Request, dc_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    # get the saved connection details
    db_dc = await service.get_dc_by_id(db, dc_uid, uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    # creating connection pool
    # once connection pool is created, it will be simply used until user logs off
    connect = await engine.create_connection(db_dc)
    if not connect:
        raise HTTPException(
            status_code=500, detail="Could not make Data Connection")
    return {"message": "success"}


# helper function to run before getting meta data from DBs
# sets up connection pool if not created before
async def activate_dc(dc_uid: str, uid: str, db: Session):
    # checks if connection pool exists
    dc_activated = await engine.is_dc_active(dc_uid)
    # if not connection pool exists, get connection details & create pool
    if not dc_activated:
        db_dc = await service.get_dc_by_id(db, dc_uid, uid)
        if db_dc is None:
            raise HTTPException(
                status_code=404, detail="Data Connection not exists")
        connect = await engine.create_connection(db_dc)
        if not connect:
            raise HTTPException(
                status_code=500, detail="Could not make Data Connection")
        return True
    return True


# get data connection details
@router.get("/get-dc/{dc_uid}", response_model=schema.DataConnectionOut)
async def read_dc(request: Request, dc_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    db_dc = await service.get_dc_by_id(db, dc_uid, uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    return db_dc


##########################################################################
#########  Get Metadata from DB of the Data Connection ###################
##########################################################################

# get schema list from the DB
@router.get("/schemas/{dc_uid}")
async def read_schema_names(request: Request, dc_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    await activate_dc(dc_uid, uid, db)
    return engine.get_schema_names(dc_uid)


# get tables list from the schema of DB
@router.get("/tables/{dc_uid}/{schema_name}")
async def read_table_names(request: Request, dc_uid: str, schema_name: str,
                           db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    await activate_dc(dc_uid, uid, db)
    return engine.get_table_names(dc_uid, schema_name)


# get Columns list from the table of the schema of DB
@ router.get("/columns/{dc_uid}/{schema_name}/{table_name}")
async def read_column_names(request: Request, dc_uid: str, schema_name: str, table_name: str,
                            db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    await activate_dc(dc_uid, uid, db)
    return engine.get_columns(dc_uid, schema_name, table_name)


# get top 100 records from the table of the schema of DB
@ router.get("/sample-records/{dc_uid}/{schema_name}/{table_name}")
async def read_sample_records(request: Request, dc_uid: str, schema_name: str, table_name: str,
                              db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    await activate_dc(dc_uid, uid, db)
    return await engine.get_sample_records(dc_uid, schema_name, table_name)


# get all data connection list of User
# this does't expose even the encrypted password of the saved connections
@ router.get("/get-all-dc", response_model=List[schema.DataConnectionOut])
async def get_all_dc(request: Request, db: Session = Depends(get_db)):
    db_dc = await service.get_all_dc(db, request.state.uid)
    if db_dc is None:
        raise HTTPException(
            status_code=404, detail="Data Connection not exists")
    return db_dc

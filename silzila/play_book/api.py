from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm.session import Session
from starlette.requests import Request

# from ...silzila import logger
from ..database.service import get_db
from . import model, schema, service

from ..user.auth import JWTBearer


router = APIRouter(prefix="/pb", tags=["Play Book"])


@router.get("/")
async def ds_home():
    return {"message": "You are in PB Home"}


@router.post("/create-pb", dependencies=[Depends(JWTBearer())])
async def create_pb(request: Request, pb: schema.PlayBook, db: Session = Depends(get_db)):
    # uid is the user ID
    uid = request.state.uid

    # check if play book name is already taken
    is_pb_name_taken = await service.get_pb_by_name(db, uid, pb.name)
    # print("is_pb_name_taken ==================================", is_pb_name_taken)
    if is_pb_name_taken:
        # print("already taken @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        raise HTTPException(
            status_code=400, detail="Name is already taken")

    # save playbook by callling service function
    pb_uid = await service.create_pb(db, uid, pb)

    # send response
    if pb_uid is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server")
    return pb_uid


@router.put("/update-pb/{pb_uid}", response_model=schema.PlayBookOut, dependencies=[Depends(JWTBearer())])
async def update_pb(pb_uid: str, request: Request, pb: schema.PlayBook, db: Session = Depends(get_db)):
    uid = request.state.uid
    pb_info = await service.update_pb(uid, pb_uid, db, pb)
    if pb_info:
        return pb_info
    else:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server"
        )


@router.get("/get-pb/{pb_uid}", dependencies=[Depends(JWTBearer())])
async def read_pb(pb_uid: str, db: Session = Depends(get_db)):
    playbook = await service.get_pb_by_uid(db, pb_uid)
    if playbook is None:
        raise HTTPException(
            status_code=404, detail="Play Book not exists"
        )
    return playbook


@router.get("/get-all-pb", dependencies=[Depends(JWTBearer())])
async def get_all_pb(request: Request, db: Session = Depends(get_db)):
    # print(request.state.__dict__)
    uid = request.state.uid
    pb_records = await service.get_all_pb(db, uid)
    if pb_records is None:
        raise HTTPException(
            status_code=404, detail="No Play Book available"
        )
    return pb_records


@router.get("/get-all-pb-by-ds/{ds_uid}", dependencies=[Depends(JWTBearer())])
async def get_all_pb_by_ds(ds_uid: str, request: Request, db: Session = Depends(get_db)):
    # print(request.state.__dict__)
    uid = request.state.uid
    pb_records = await service.get_all_pb_by_ds(ds_uid, db, uid)
    if pb_records is None:
        raise HTTPException(
            status_code=404, detail="No Play Book available"
        )
    return pb_records


@router.delete("/delete-pb/{pb_uid}")
async def delete_pb(pb_uid: str, db: Session = Depends(get_db)):
    deleted = await service.delete_by_pb_uid(db, pb_uid)
    if deleted is None:
        raise HTTPException(
            status_code=500, detail="Something went wrong in server"
        )
    return {"message": "Play Book is deleted"}

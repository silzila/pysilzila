from genericpath import exists
import shutil
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm.session import Session
from starlette.requests import Request
import os
import datetime
import csv

from ..database.service import get_db
from . import model, schema, service

from ..user.auth import JWTBearer

from .spark_engine import create_spark_engine, edit_table, read_csv

# any API in this route gets /ds Prefix and requires TOKEN
router = APIRouter(prefix="/fd", tags=["File Data"],
                   dependencies=[Depends(JWTBearer())])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_name, file_extension = os.path.splitext(file.filename)
    if file_extension not in ('.csv', '.txt'):
        raise HTTPException(
            status_code=400, detail="Only CSV or TXT files are allowed")
    # remove special characters
    file_name = "".join(x for x in file_name if (x.isalnum() or x in "_"))
    timestamp = datetime.datetime.now().strftime("%Y%m%dT%H%M%S")
    new_file_name = f"{timestamp}_{file_name}"
    save_file_path = os.path.join(os.path.expanduser(
        '~'), '.silzila', new_file_name)
    # path_checked_exist = os.path.join(save_file_path, file_extension[1:])
    # if not os.path.exists(path_checked_exist):
    #     os.makedirs(path_checked_exist)

    try:
        with open(save_file_path, 'wb+') as file_obj:
            file_obj.write(file.file.read())

        records = []
        with open(save_file_path) as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            for row in csv_reader:
                records.append(row)
                line_count += 1
                if line_count > 99:
                    break
        # get column names
        meta_cols = []
        if len(records) == 0 and len(records[0]) == 0:
            raise HTTPException(
                status_code=400, detail="file is empty")
        col_names = [key for key in records[0].keys()]
        for col in col_names:
            _dict = {}
            _dict['column_name'] = col
            _dict['data_type'] = 'text'
            _dict['include'] = True
            meta_cols.append(_dict)
        return {"file_id": new_file_name,
                "table_name": file_name,
                "date_format": "MM/dd/yyyy",
                "timestamp_format": "yyyy-MM-dd HH:mm:ss[.SSS]",
                "timestamp_with_timezone_format": "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]",
                "meta_cols": meta_cols,
                "sample_records": records}

    except Exception as ex:

        print("exception ==============\n", ex)
        raise HTTPException(
            status_code=500, detail="Error in uploading File")


@router.post("/upload-change-metadata")
async def upload_change_metadata(request: Request, meta_info: schema.EditTableSchema, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    # first check if table name already exists for the user
    db_fd = await service.get_fd_by_name(db, meta_info.table_name, uid)
    print("after calling get_fd_by_name fn -----------")
    if db_fd:
        print("if fd row is present - get_fd_by_name fn -----------")
        raise HTTPException(
            status_code=400, detail="File Data Name is already used")
    try:
        sample_data = await edit_table(meta_info)

    except Exception as ex:
        print("exception ==============\n", ex)
        raise HTTPException(
            status_code=500, detail="Something error in changing metadataa")

    file_meta = {'fd_uid': sample_data['table_id'],
                 'table_name': sample_data['table_name'], 'meta_data': sample_data['meta_cols'], 'sample_records': sample_data['sample_records']}

    # return sample_data
    db_record = await service.create_file_data(db, file_meta, uid)
    if db_record:
        return sample_data
    else:
        raise HTTPException(
            status_code=500, detail="failed to save in database")


@router.post("/check-fd-name-exists/{fd_name}")
async def check_fd_name_exists(request: Request, fd_name: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    db_fd = await service.get_fd_by_name(db, fd_name, uid)
    if db_fd:
        return {'message': True}
    else:
        return {'message': False}


# list all file data of a user
@router.get("/get-all-fd")
async def get_all_fd(request: Request, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    fd_list = await service.get_all_fd(db, uid)
    if fd_list is None or len(fd_list) == 0:
        raise HTTPException(
            status_code=404, detail="No File Data exists")
    return fd_list


# get File Data by it's ID
@router.get("/get-fd/{fd_uid}")
async def read_fd(request: Request, fd_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    db_ds = await service.get_fd_by_id(db, fd_uid, uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="No File Data exists")
    return db_ds


# get File Data column metadata by it's ID
@router.get("/columns/{fd_uid}")
async def fd_saple_records(request: Request, fd_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    db_ds = await service.get_fd_meta_data_by_id(db, fd_uid, uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="No File Data exists")
    return db_ds


# get File Data Sample Records by it's ID
@router.get("/sample-records/{fd_uid}")
async def fd_saple_records(request: Request, fd_uid: str, db: Session = Depends(get_db)):
    # get User ID from JWT token coming in request
    uid = request.state.uid
    db_ds = await service.get_fd_sample_records_by_id(db, fd_uid, uid)
    if db_ds is None:
        raise HTTPException(
            status_code=404, detail="No File Data exists")
    return db_ds

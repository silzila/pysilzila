import os
import pathlib
from starlette.responses import FileResponse
from starlette.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ..database.config import engine, Base

from ..user.api import router as user_router
from ..data_connection.api import router as dc_router
from ..data_set.api import router as ds_router
from ..play_book.api import router as pb_router

# HERE = pathlib.Path(__file__).resolve().parent
# print('PATHLIB ===============================', HERE)

# from ..main.__main__ import root_folder
# # html_file_path = os.path.join(root_folder, 'static', 'index.html')

# HERE = pathlib.Path(__file__).resolve().parent.parent
# print('Install path -------------------------', str(HERE))
# static_path = os.path.realpath(os.path.join(HERE, 'static'))
# print('static path ==========', static_path)

# ROUTERS
app = FastAPI()
app.include_router(user_router)
app.include_router(dc_router)
app.include_router(ds_router)
app.include_router(pb_router)


origins = [
    "http://silzila.org",
    "https://silzila.org",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5000",
    "http://localhost:5001",
    "http://localhost:5002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# app.mount("/", StaticFiles(
#     directory=static_path, html=True), name='static')
# # app.mount("/", StaticFiles(directory="backend/ui/"), name="ui")


# @ app.get("/", tags=["Home"])
# async def root():
# print('static path ==========', static_path)
#     return FileResponse("/index.html")


@ app.get("/")
async def home() -> dict:
    return {"message": "Welcome to Silila, from Server"}


@ app.get("/")
async def home() -> dict:
    return {"message": "Welcome to Silila, from Server"}


@ app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        '''
        If needed, drop old Tables and create Fresh DB Tables when application starts
        '''
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

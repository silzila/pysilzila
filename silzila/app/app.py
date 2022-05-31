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

# ROUTERS to be added to the APP
app = FastAPI()
app.include_router(user_router)
app.include_router(dc_router)
app.include_router(ds_router)
app.include_router(pb_router)

# Exceptions for CORS
origins = [
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


@ app.get("/")
async def home() -> dict:
    """Root API
    Just to Test if it works
    """
    return {"message": "Welcome to Silila, from Server"}


@ app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        """If needed, drop old Tables and create Fresh DB Tables when application starts
        """
        # this will recreate SQLite tables for metadata storage everytime app is starting.
        # await conn.run_sync(Base.metadata.drop_all)
        # this will recreate SQLite once if Tables are not existing
        await conn.run_sync(Base.metadata.create_all)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.config import engine, Base
from .user.api import router as user_router
from .data_connection.api import router as dc_router
from .data_set.api import router as ds_router

# ROUTERS
app = FastAPI()
app.include_router(user_router)
app.include_router(dc_router)
app.include_router(ds_router)

origins = [
    "http://silzila.org",
    "https://silzila.org",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Home"])
async def home() -> dict:
    return {"message": "Welcome to Silila"}


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        '''
        If needed, drop old Tables and create Fresh DB Tables when application starts
        '''
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

import os
import pathlib

from ..main.__main__ import root_folder

from decouple import config
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = config("LOCAL_DB_DRIVER") + \
    os.path.join(root_folder, config("LOCAL_DB_NAME"))

HERE = pathlib.Path(__file__).resolve().parent
# print('PATHLIB ===============================', HERE)


engine = create_async_engine(
    DATABASE_URL,
    future=True,
    echo=False,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(
    bind=engine, autocommit=False,
    expire_on_commit=False,
    class_=AsyncSession)

Base = declarative_base()

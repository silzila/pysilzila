from decouple import config
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = config("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL,
    future=True,
    echo=True,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(
    bind=engine, autocommit=False,
    expire_on_commit=False,
    class_=AsyncSession)

Base = declarative_base()

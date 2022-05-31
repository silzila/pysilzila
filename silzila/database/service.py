from .config import SessionLocal


async def get_db():
    async with SessionLocal() as db:
        async with db.begin():
            yield db

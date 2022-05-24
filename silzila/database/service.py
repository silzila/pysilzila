from .config import SessionLocal

# async def get_db():
#     async with SessionLocal() as db:
#         try:
#             await db
#         finally:
#             await db.close()

# async def get_db():
#     async with SessionLocal() as db:
#         try:
#             await db
#         finally:
#             await db.close()

# Dependency


# async def get_db():
#     db = SessionLocal()
#     try:
#         await db
#     finally:
#         await db.close()

async def get_db():
    async with SessionLocal() as db:
        async with db.begin():
            yield db

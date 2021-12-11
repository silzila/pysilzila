from sqlalchemy.orm import Session

from .import model, schema


async def create_data_connection(db: Session,
                                 dc: schema.DataConnectionIn, uid: str):
    dc_item = model.DataConnection(**dc.dict(), user_id=uid)
    db.add(dc_item)
    db.commit()
    db.refresh(dc_item)
    return dc_item


async def get_data_connection(db: Session, dc_uid: str):
    return db.query(model.DataConnection).filter(
        model.DataConnection.dc_uid == dc_uid).first()


async def get_all_data_connections(db: Session, user_id: str):
    return db.query(model.DataConnection).filter(
        model.DataConnection.user_id == user_id).all()

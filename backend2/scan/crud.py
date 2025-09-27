from sqlalchemy.orm import Session
from . import models,schemas


def create_scan(db: Session, scan: schemas.ScanCreate):
    db_scan = models.Scan(**scan.dict())
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

def get_scans_by_user(db: Session, user_id: int):
    return db.query(models.Scan).filter(models.Scan.user_id == user_id).all()

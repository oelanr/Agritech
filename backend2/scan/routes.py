from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from . import schemas,crud

router = APIRouter()

# Dependency DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/save", response_model=schemas.ScanResponse)
def save_scan(scan: schemas.ScanCreate, db: Session = Depends(get_db)):
    return crud.create_scan(db, scan)

@router.get("/history/{user_id}", response_model=list[schemas.ScanResponse])
def get_history(user_id: int, db: Session = Depends(get_db)):
    scans = crud.get_scans_by_user(db, user_id)
    if not scans:
        raise HTTPException(status_code=404, detail="Aucun historique trouvé")
    return scans

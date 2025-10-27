from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from . import schemas, crud,models
import os
import sys

router = APIRouter()

# --- Dépendance DB ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Préparation chemins ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_PATH = os.path.abspath(os.path.join(CURRENT_DIR, '..', '../ml/classification/src'))

if SRC_PATH not in sys.path:
    sys.path.append(SRC_PATH)

# --- Import du module predict.py ---
from predict import predict as predict_model  # ta fonction personnalisée

# --- ROUTES CRUD ---
@router.post("/save", response_model=schemas.ScanResponse)
def save_scan(scan: schemas.ScanCreate, db: Session = Depends(get_db)):
    return crud.create_scan(db, scan)

@router.get("/history/{user_id}", response_model=list[schemas.ScanResponse])
def get_history(user_id: str, db: Session = Depends(get_db)):  # <-- str au lieu de int
    scans = crud.get_scans_by_user(db, user_id)
    if not scans:
        raise HTTPException(status_code=404, detail="Aucun historique trouvé")
    return scans


# --- ROUTE DE PRÉDICTION ---
@router.post("/predict", response_model=schemas.ScanResponse)
def predict_and_save(scan_input: schemas.ScanPredictInput, db: Session = Depends(get_db)):
    try:
        exemple = dict(scan_input.symptomes)
        prediction = predict_model(exemple)

        if prediction is None:
            raise HTTPException(status_code=500, detail="Modèle IA non disponible")

        scan_data = schemas.ScanCreate(
            user_id=scan_input.user_id,
            symptomes=scan_input.symptomes,
            prediction=prediction
        )

        db_scan = crud.create_scan(db, scan_data)
        return db_scan

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de prédiction : {str(e)}")

# scan/routes.py
@router.delete("/delete/{scan_id}", status_code=204)
def delete_scan(scan_id: int, db: Session = Depends(get_db)):
    db_scan = db.query(models.Scan).filter(models.Scan.id == scan_id).first()
    if not db_scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    db.delete(db_scan)
    db.commit()
    return {"detail": "Scan supprimé avec succès"}
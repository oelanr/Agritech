from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from users import schemas, crud
from database import get_db

router = APIRouter()

@router.post("/signup", response_model=schemas.TokenResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@router.post("/login", response_model=schemas.TokenResponse)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    return crud.login_user(db, user)

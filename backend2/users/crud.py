from sqlalchemy.orm import Session
from users import models, schemas
from passlib.context import CryptContext
from fastapi import HTTPException, status
from core.security import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user: schemas.UserCreate) -> schemas.TokenResponse:
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_password = get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    return schemas.TokenResponse(
        access_token=token,
        email=new_user.email,
        message="Compte créé"
    )

def login_user(db: Session, user: schemas.UserLogin) -> schemas.TokenResponse:
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")

    token = create_access_token({"sub": db_user.email})
    return schemas.TokenResponse(
        access_token=token,
        email=db_user.email,
        message="Connexion réussie"
    )

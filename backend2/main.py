from fastapi import FastAPI
from database import engine, Base
from users import models
from users.routes import router as users_router
from scan.routes import router as scan_router
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agritech BAKEND API 2.0")

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(scan_router, prefix="/scan", tags=["Scan"])
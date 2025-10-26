from fastapi import FastAPI
from database import engine, Base
from users import models as user_models
from users.routes import router as users_router
from scan.routes import router as scan_router
from chat import models as chat_models
from chat.routes import router as chat_router  # ✅ ajout
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Agritech BACKEND API 2.0")

# Routes existantes
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(scan_router, prefix="/scan", tags=["Scan"])

# Nouvelle route chat
app.include_router(chat_router, prefix="/chat", tags=["Chatbot"])

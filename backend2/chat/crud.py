from sqlalchemy.orm import Session
from . import models, schemas

# Enregistrer une conversation
def create_chat_message(db: Session, chat: schemas.ChatRequest, answer: str):
    db_chat = models.ChatMessage(
        session_id=chat.session_id,
        question=chat.question,
        answer=answer
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

# Récupérer l'historique par session
def get_chat_history(db: Session, session_id: str):
    return db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.created_at.asc()).all()

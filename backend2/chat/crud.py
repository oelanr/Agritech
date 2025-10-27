from sqlalchemy.orm import Session
from . import models, schemas

# Enregistrer une conversation
def create_chat_message(db: Session, chat: schemas.ChatRequest, answer: str):
    db_chat = models.ChatMessage(
        session_id=chat.session_id,
        user_id=chat.user_id,  # ajout
        question=chat.question,
        answer=answer
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


def get_chat_history(db: Session, session_id: str):
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.session_id == session_id)
        .order_by(models.ChatMessage.created_at.asc())
        .all()
    )


def get_user_chat_sessions(db: Session, user_id: str):
    """Liste les sessions uniques de l’utilisateur (pour Historique.tsx)"""
    sessions = (
        db.query(models.ChatMessage.session_id)
        .filter(models.ChatMessage.user_id == user_id)
        .distinct()
        .all()
    )
    return [s[0] for s in sessions]

def delete_all_user_chats(db: Session, user_id: str):
    db.query(models.ChatMessage).filter(models.ChatMessage.user_id == user_id).delete()
    db.commit()

def delete_chat_session(db: Session, session_id: str):
    """Supprime tous les messages d'une session spécifique"""
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).all()
    for msg in messages:
        db.delete(msg)
    db.commit()

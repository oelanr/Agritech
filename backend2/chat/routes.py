from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from . import schemas, crud
from . import models
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from ml.agrichat.src.rag_pipeline import build_rag_graph
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter()

class AskChatRequest(schemas.ChatRequest):
    pass

# Construire le RAG graph
rag_graph = build_rag_graph()

@router.post("/ask")
async def ask_chatbot(request: AskChatRequest, db: Session = Depends(get_db)):
    print(">>> /chat/ask appelé avec :", request.question)  # <-- log important

    user_input = request.question
    session_id = request.session_id
    thread_id_for_rag = session_id if session_id else "default_thread_non_persisted"

    try:
        result = rag_graph.invoke(
            {
                "messages": [
                    SystemMessage(content="Tu es un assistant agricole. Explique clairement au fermier la maladie détectée, ses causes et ses traitements."),
                    HumanMessage(content=user_input)
                ]
            },
            config={
                "configurable": {
                    "thread_id": thread_id_for_rag,
                    "checkpoint_ns": "agrichat"
                }
            }
        )


        if isinstance(result, dict) and "messages" in result:
            last_message = result["messages"][-1]
            response_text = getattr(last_message, "content", str(last_message))
        elif "output" in result:
            response_text = result["output"]
        else:
            response_text = str(result)

        if session_id:
            crud.create_chat_message(db, request, response_text)

        print(">>> réponse RAG:", response_text[:100])  # <-- log partiel
        return {"answer": response_text}

    except Exception as e:
        print("Erreur RAG:", e)
        raise HTTPException(status_code=500, detail="Erreur interne du chatbot.")

# chat/routes.py
@router.get("/history/{user_id}")
def get_chat_history_by_user(user_id: str, db: Session = Depends(get_db)):
    sessions = crud.get_user_chat_sessions(db, user_id)
    history = []
    for session_id in sessions:
        # On prend le dernier message pour aperçu
        last_msg = (
            db.query(models.ChatMessage)
            .filter(models.ChatMessage.session_id == session_id)
            .order_by(models.ChatMessage.created_at.desc())
            .first()
        )
        if last_msg:
            history.append({
                "session_id": session_id,
                "last_question": last_msg.question,
                "last_answer": last_msg.answer,
                "last_date": last_msg.created_at
            })
    return history

@router.delete("/history/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_history(user_id: str, db: Session = Depends(get_db)):
    crud.delete_all_user_chats(db, user_id)
    return {"detail": "Historique supprimé avec succès."}

@router.delete("/history/session/{session_id}")
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    """Supprime une session de chat par session_id"""
    try:
        crud.delete_chat_session(db, session_id)
        return {"message": f"Session {session_id} supprimée avec succès."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression: {str(e)}")

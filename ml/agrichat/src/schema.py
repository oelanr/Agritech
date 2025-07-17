from pydantic import BaseModel
from typing import Optional


#Requetes
class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

#Réponses
class ChatResponse(BaseModel):
    answer: str

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str

class ChatMessageResponse(BaseModel):
    id: int
    session_id: Optional[str]
    question: str
    answer: str
    created_at: datetime

from pydantic import BaseModel
from datetime import datetime

class ScanBase(BaseModel):
    maladie: str
    description: str | None = None
    gravite: str | None = None
    symptomes: str | None = None
    session_id: str | None = None

class ScanCreate(ScanBase):
    user_id: int

class ScanResponse(ScanBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

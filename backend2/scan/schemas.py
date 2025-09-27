from pydantic import BaseModel
from datetime import datetime
from typing import Dict

class ScanBase(BaseModel):
    user_id: int
    symptomes: Dict
    prediction: str

class ScanCreate(ScanBase):
    pass

class ScanResponse(ScanBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# schemas.py
from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class ScanPredictInput(BaseModel):
    user_id: str
    symptomes: Dict

class ScanBase(BaseModel):
    user_id: str
    symptomes: Dict
    prediction: str

class ScanCreate(ScanBase):
    pass

class ScanResponse(ScanBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

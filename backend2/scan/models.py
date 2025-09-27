from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # FK vers User
    symptomes = Column(JSON, nullable=False)
    prediction = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, Boolean, DateTime, func

from app.db.database import Base

class Task(Base):
    """Task model for storing todo task data"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    is_done = Column(Boolean, default=False)
    priority = Column(Integer, default=5)  # 1-10 priority scale
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

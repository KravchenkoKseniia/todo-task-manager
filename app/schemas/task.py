from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class TaskBase(BaseModel):
    """Base schema for Task data"""
    title: str
    description: Optional[str] = None
    priority: int = Field(5, ge=1, le=10)  # Priority between 1-10

    @validator('priority')
    def validate_priority(cls, value):
        if value < 1 or value > 10:
            raise ValueError("Priority must be between 1 and 10")
        return value

class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    pass

class TaskUpdate(BaseModel):
    """Schema for updating a task"""
    title: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None
    priority: Optional[int] = None

    @validator('priority')
    def validate_priority(cls, value):
        if value is not None and (value < 1 or value > 10):
            raise ValueError("Priority must be between 1 and 10")
        return value

class TaskInDB(TaskBase):
    """Schema for Task in database"""
    id: int
    is_done: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Task(TaskInDB):
    """Schema for Task response"""
    pass

class TaskFilterParams(BaseModel):
    """Schema for task filtering parameters"""
    status: Optional[str] = None  # all, done, undone
    sort_by_priority: Optional[str] = None  # asc, desc
    search: Optional[str] = None

    @validator('status')
    def validate_status(cls, value):
        if value not in [None, "all", "done", "undone"]:
            raise ValueError("Status must be one of: all, done, undone")
        return value

    @validator('sort_by_priority')
    def validate_sort(cls, value):
        if value not in [None, "asc", "desc"]:
            raise ValueError("Sort must be one of: asc, desc")
        return value

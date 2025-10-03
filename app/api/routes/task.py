from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.schemas.task import Task, TaskCreate, TaskUpdate, TaskFilterParams
from app.services.task_service import TaskService

# Create router for tasks
router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

# Define route handlers that can handle both trailing slash and non-trailing slash variants

@router.get("", response_model=List[Task])  # No trailing slash version
@router.get("/", response_model=List[Task])  # Trailing slash version
def get_tasks(
    status: Optional[str] = Query(None, description="Filter by status: all, done, or undone"),
    sort_by_priority: Optional[str] = Query(None, description="Sort by priority: asc or desc"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    skip: int = Query(0, ge=0, description="Number of tasks to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of tasks to return"),
    db: Session = Depends(get_db)
):
    """
    Get all tasks with optional filtering and sorting
    """
    filter_params = TaskFilterParams(
        status=status,
        sort_by_priority=sort_by_priority,
        search=search
    )
    return TaskService.get_tasks(db, filter_params, skip, limit)

@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """
    Get a specific task by ID
    """
    db_task = TaskService.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.post("", response_model=Task, status_code=201)  # No trailing slash version
@router.post("/", response_model=Task, status_code=201)  # Trailing slash version
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task
    """
    return TaskService.create_task(db, task)

@router.patch("/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    """
    Update an existing task
    """
    db_task = TaskService.update_task(db, task_id, task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Delete a task
    """
    result = TaskService.delete_task(db, task_id)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return None

@router.patch("/{task_id}/done", response_model=Task)
def mark_task_done(task_id: int, db: Session = Depends(get_db)):
    """
    Mark a task as done
    """
    db_task = TaskService.mark_task_as_done(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

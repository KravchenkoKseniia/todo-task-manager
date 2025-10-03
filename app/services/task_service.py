from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional, Dict, Any

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskFilterParams

class TaskService:
    """Service for handling task operations"""

    @staticmethod
    def get_tasks(
        db: Session,
        filter_params: Optional[TaskFilterParams] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        """Get all tasks with optional filtering"""
        query = db.query(Task)

        # Apply filters if provided
        if filter_params:
            if filter_params.status == "done":
                query = query.filter(Task.is_done == True)
            elif filter_params.status == "undone":
                query = query.filter(Task.is_done == False)

            if filter_params.search:
                search_term = f"%{filter_params.search}%"
                query = query.filter(
                    or_(
                        Task.title.ilike(search_term),
                        Task.description.ilike(search_term)
                    )
                )

            if filter_params.sort_by_priority == "asc":
                query = query.order_by(asc(Task.priority))
            elif filter_params.sort_by_priority == "desc":
                query = query.order_by(desc(Task.priority))

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_task(db: Session, task_id: int) -> Optional[Task]:
        """Get a specific task by ID"""
        return db.query(Task).filter(Task.id == task_id).first()

    @staticmethod
    def create_task(db: Session, task: TaskCreate) -> Task:
        """Create a new task"""
        db_task = Task(**task.dict())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def update_task(db: Session, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """Update an existing task"""
        db_task = TaskService.get_task(db, task_id)

        if not db_task:
            return None

        update_data = task_update.dict(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_task, key, value)

        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def delete_task(db: Session, task_id: int) -> bool:
        """Delete a task"""
        db_task = TaskService.get_task(db, task_id)

        if not db_task:
            return False

        db.delete(db_task)
        db.commit()
        return True

    @staticmethod
    def mark_task_as_done(db: Session, task_id: int) -> Optional[Task]:
        """Mark a task as done"""
        db_task = TaskService.get_task(db, task_id)

        if not db_task:
            return None

        db_task.is_done = True
        db.commit()
        db.refresh(db_task)
        return db_task

from fastapi import APIRouter
from app.api.routes.task import router as task_router

router = APIRouter()
router.include_router(task_router)

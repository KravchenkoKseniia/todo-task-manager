from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.routes import router as api_router
from app.db.init_db import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TODO Task Manager",
    description="API for managing todo tasks",
    version="1.0.0",
    # Disable automatic redirects for trailing slashes
    redirect_slashes=False
)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully!")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Root"])
async def root():
    """Health check endpoint"""
    return {"message": "TODO Task Manager API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

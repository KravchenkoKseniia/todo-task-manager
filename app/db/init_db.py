import logging
from sqlalchemy_utils import database_exists, create_database

from app.db.database import Base, engine

logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database, create all tables."""
    try:
        if not str(engine.url).startswith('sqlite'):
            if not database_exists(engine.url):
                create_database(engine.url)
                logger.info(f"Created database: {engine.url.database}")

        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")

    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

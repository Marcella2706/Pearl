from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.clients import (
    PSQL_USERNAME, PSQL_PASSWORD, PSQL_HOST, 
    PSQL_PORT, PSQL_DATABASE, PSQL_SSLMODE
)

DATABASE_URL = (
    f"postgresql+psycopg://{PSQL_USERNAME}:{PSQL_PASSWORD}"
    f"@{PSQL_HOST}:{PSQL_PORT}/{PSQL_DATABASE}"
    f"?sslmode={PSQL_SSLMODE}"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
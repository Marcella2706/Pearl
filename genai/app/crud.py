from sqlalchemy.orm import Session
from . import models, schemas
from openai import OpenAI
from uuid import UUID

client = OpenAI()

def create_session(db: Session, user_email: str, session: schemas.SessionCreate):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise ValueError("User not found")

    db_session = models.Session(
        title=session.title,
        user_id=user.id 
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_sessions(db: Session, user_email: str):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        return []
    return db.query(models.Session).filter(models.Session.user_id == user.id).all()

def get_session(db: Session, session_id: UUID):
    return db.query(models.Session).filter(models.Session.id == session_id).first()

def add_message(db: Session, session_id: UUID, message: schemas.MessageCreate, user_email: str):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise ValueError("User not found")

    embedding_response = client.embeddings.create(
        model="text-embedding-3-small",
        input=message.content
    )
    vector = embedding_response.data[0].embedding

    db_message = models.Message(
        session_id=session_id,
        sender=user_email,    
        role=message.role,
        content=message.content,
        embedding=vector
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_messages(db: Session, session_id: UUID):
    return db.query(models.Message).filter(models.Message.session_id == session_id).all()

def get_user_by_email(db: Session, email: str):
    if not isinstance(email, str):
        raise ValueError("Email must be a string")
    return db.query(models.User).filter(models.User.email == email).first()

from sqlalchemy.orm import Session
from app import models, api
from app.api import schemas
import uuid

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_or_create_user(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        user = models.User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def create_session(db: Session, user_id: uuid.UUID, session_in: schemas.SessionCreate):
    db_session = models.Session(
        user_id=user_id,
        title=session_in.title
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_user_sessions(db: Session, user_id: uuid.UUID):
    return db.query(models.Session).filter(models.Session.user_id == user_id).all()

def get_session(db: Session, session_id: uuid.UUID):
    return db.query(models.Session).filter(models.Session.id == session_id).first()

def check_session_owner(db: Session, session_id: uuid.UUID, user_id: uuid.UUID):
    session = db.query(models.Session).filter(
        models.Session.id == session_id,
        models.Session.user_id == user_id
    ).first()
    return session is not None

def add_message(db: Session, session_id: uuid.UUID, message_in: schemas.MessageCreate):
    db_message = models.Message(
        session_id=session_id,
        role=message_in.role,
        content=message_in.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_session_messages(db: Session, session_id: uuid.UUID):
    """
    Gets all messages for a specific session, ordered by creation time.
    """
    return db.query(models.Message)\
             .filter(models.Message.session_id == session_id)\
             .order_by(models.Message.created_at.asc())\
             .all()
             
def update_session_title(db: Session, session_id: uuid.UUID, title: str):
    db_session = get_session(db, session_id=session_id)
    if db_session:
        db_session.title = title
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session
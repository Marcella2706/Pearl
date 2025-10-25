from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import crud, schemas
import requests
from uuid import UUID

router = APIRouter(prefix="/sessions", tags=["sessions"])

BACKEND_URL = "http://localhost:2706/api/v1/user/current-user"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        response = requests.get(
            BACKEND_URL,
            headers={"Authorization": authorization},
            timeout=5
        )
        response.raise_for_status()
        user_data = response.json()
        if "email" not in user_data:
            raise HTTPException(status_code=401, detail="Invalid user data from auth service")
        return user_data
    except requests.exceptions.HTTPError:
        raise HTTPException(status_code=response.status_code, detail="Unauthorized")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Auth service unreachable")

@router.post("/", response_model=schemas.SessionResponse)
def create_session(
    session: schemas.SessionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    email = current_user.get("email")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_session(db, email, session)

@router.get("/", response_model=list[schemas.SessionResponse])
def get_user_sessions(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    email = current_user.get("email")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_sessions(db, user_id=user.id)

@router.get("/{session_id}", response_model=schemas.SessionResponse)
def get_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    session = crud.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/{session_id}/messages", response_model=schemas.MessageResponse)
def add_message(
    session_id: UUID,
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    email = current_user.get("email")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.add_message(db, session_id, message, user_email=email)

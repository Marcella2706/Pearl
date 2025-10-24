from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class MessageCreate(BaseModel):
    role: str
    content: str

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

class SessionCreate(BaseModel):
    title: Optional[str] = None

class SessionResponse(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        orm_mode = True

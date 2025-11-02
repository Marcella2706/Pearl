# In app/api/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal
import uuid
import datetime

class MessageBase(BaseModel):
    role: Literal["human", "ai"]
    content: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime.datetime

class SessionCreate(BaseModel):
    title: Optional[str] = "New Chat"

class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    created_at: datetime.datetime

class ChatRequest(BaseModel):
    """What the user sends to the chat endpoint."""
    content: str
    imageURL: Optional[str] = None
    tag: Optional[str] = None

class ChatResponseChunk(BaseModel):
    """A single chunk of the streaming response."""
    type: Literal["message", "prediction", "error", "image"]
    content: str
    
class SessionUpdate(BaseModel):
    title: str
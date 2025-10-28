from typing import Optional
from langgraph.graph import MessagesState

class ChatStateMain(MessagesState):
    imageURL: Optional[str] = None
    prediction: Optional[str] = None
    rImageUrl: Optional[str] = None
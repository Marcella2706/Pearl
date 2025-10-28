from typing import Literal
from .state import ChatStateMain

def startRouter(state: ChatStateMain) -> Literal['classifierNode', 'pdfSummarizerNode', 'clinicalNode']:
    imageUrl = state.get("imageURL")
    pdfUrl = state.get("pdfURL")
    if imageUrl:
        return "classifierNode"
    elif "heart" in state.get("messages", [])[-1].content.lower():
        return "classifierNode"
    elif pdfUrl:
        return "pdfSummarizerNode"
    else:
        return "clinicalNode"

def imageClassifier(state: ChatStateMain) -> Literal["xrayClassifierNode", "HeartNode", "WoundNode"]:
    messages = state.get("messages")
    last_message = messages[-1].content.lower() if messages else ""

    if "heart" in last_message:
        return "HeartNode"
    elif "xray" in last_message and state.get("imageURL"):
        return "xrayClassifierNode"
    elif "wound" in last_message and state.get("imageURL"):
        return "WoundNode"
    else:
        return "xrayClassifierNode" if state.get("imageURL") else "HeartNode"

def xrayClassifier(state: ChatStateMain) -> Literal["BrainXRayNode","ChestXRayNode"]:
    messages = state.get("messages")
    last_message = messages[-1].content.lower()

    if "brain" in last_message:
        return "BrainXRayNode"
    elif "chest" in last_message:
        return "ChestXRayNode"
    return "ChestXRayNode"
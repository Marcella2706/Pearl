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

def imageClassifier(state: ChatStateMain) -> Literal["xrayClassifierNode", "HeartNode"]:
    return "xrayClassifierNode" if state.get("imageURL") else "HeartNode"

def xrayClassifier(state: ChatStateMain) -> Literal["BrainXRayNode", "ChestXRayNode", "WoundNode"]:
    prediction = getattr(state, "prediction", None)

    prediction = prediction.lower()

    if "brain" in prediction:
        return "BrainXRayNode"
    elif "lung" in prediction:
        return "ChestXRayNode"
    elif "wound" in prediction:
        return "WoundNode"



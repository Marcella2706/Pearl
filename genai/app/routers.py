from typing import Literal
from .state import ChatStateMain
from langgraph.graph import StateGraph, START, END

def startRouter(state: ChatStateMain) -> Literal['xrayClassifierNode', 'HeartNode', 'clinicalNode']:
    imageUrl = state.get("imageURL")
    tag = (state.get("tag") or "").lower()
    request = (state.get("request") or "").lower()

    if imageUrl or tag == "xray":
        return "xrayClassifierNode"
    elif tag == "heart" or "heart" in request:
        return "HeartNode"
    else:
        return "clinicalNode"



def xrayClassifier(state: ChatStateMain) -> Literal["BrainXRayNode", "ChestXRayNode", "WoundNode", END]:
    prediction = state.get("prediction")
    print("🔍 xrayClassifierNode prediction:", prediction)
    if not prediction:
        return "END"
    prediction = prediction.lower()
    if "brain" in prediction:
        return "BrainXRayNode"
    elif "lung" in prediction:
        return "ChestXRayNode"
    elif "wound" in prediction:
        return "WoundNode"
    else:
        return END



from typing import Literal
from .state import ChatStateMain
from langgraph.graph import StateGraph, START, END

def startRouter(state: ChatStateMain) -> Literal['xrayClassifierNode', 'HeartNode', 'clinicalNode']:
    imageUrl = state.get("imageURL")
    request = state.get("request")
    if(not request):
        request=""
    request=request.lower() 
    if imageUrl:
        return "xrayClassifierNode"
    elif "heart" in request:
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



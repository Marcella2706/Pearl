from typing import Literal
from .state import ChatStateMain

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


def xrayClassifier(state: ChatStateMain) -> Literal["BrainXRayNode", "ChestXRayNode", "WoundNode"]:
    prediction = state.get("prediction")
    print("🔍 xrayClassifierNode prediction:", prediction)
    prediction = prediction.lower()
    if "brain" in prediction:
        return "BrainXRayNode"
    elif "lung" in prediction:
        return "ChestXRayNode"
    elif "wound" in prediction:
        return "WoundNode"



from langgraph.graph import StateGraph, START, END
from .state import ChatStateMain
from .nodes import *
from .routers import *

def create_graph():
    builder = StateGraph(ChatStateMain)

    builder.add_node("clinicalNode", clinicalNode)
    builder.add_node("xrayClassifierNode", xrayClassifierNode)
    builder.add_node("BrainXRayNode", BrainXrayNode)
    builder.add_node("ChestXRayNode", ChestXRayNode)
    builder.add_node("HeartNode", HeartNode)
    builder.add_node("WoundNode", WoundNode)
    builder.add_node("BrainXRayClinicalNode", BrainXRayClinicalNode)

    builder.add_conditional_edges(START, startRouter)
    builder.add_conditional_edges("xrayClassifierNode", xrayClassifier)
    builder.add_edge("HeartNode", END)
    builder.add_edge("WoundNode", END)
    builder.add_edge("ChestXRayNode", END)
    builder.add_edge("clinicalNode", END)
    builder.add_edge("BrainXRayNode", "BrainXRayClinicalNode")
    builder.add_edge("BrainXRayClinicalNode", END)
    
    return builder
    
# from langgraph.graph import StateGraph, START, END
# from .state import ChatStateMain
# from .nodes import *
# from .routers import *


# builder = StateGraph(ChatStateMain)

# builder.add_node("clinicalNode", clinicalNode)
# builder.add_node("xrayClassifierNode", xrayClassifierNode)
# builder.add_node("BrainXRayNode", BrainXrayNode)
# builder.add_node("ChestXRayNode", ChestXRayNode)
# builder.add_node("HeartNode", HeartNode)
# builder.add_node("WoundNode", WoundNode)
# builder.add_node("BrainXRayClinicalNode", BrainXRayClinicalNode)

# builder.add_conditional_edges(START, startRouter)
# builder.add_conditional_edges("xrayClassifierNode", xrayClassifier)
# builder.add_edge("HeartNode", END)
# builder.add_edge("WoundNode", END)
# builder.add_edge("ChestXRayNode", END)
# builder.add_edge("clinicalNode", END)
# builder.add_edge("BrainXRayNode", "BrainXRayClinicalNode")
# builder.add_edge("BrainXRayClinicalNode", END)

# graph=builder.compile()

    

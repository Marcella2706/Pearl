from langgraph.graph import StateGraph, START, END
from .state import ChatStateMain
from .nodes import *
from .routers import *

def create_graph():
    builder = StateGraph(ChatStateMain)

    builder.add_node("clinicalNode", clinicalNode)
    builder.add_node("classifierNode", classifierNode)
    builder.add_node("pdfSummarizerNode", pdfSummarizerNode)
    builder.add_node("xrayClassifierNode", xrayClassifierNode)
    builder.add_node("BrainXRayNode", BrainXrayNode)
    builder.add_node("ChestXRayNode", ChestXRayNode)
    builder.add_node("HeartNode", HeartNode)
    builder.add_node("WoundNode", WoundNode)
    builder.add_node("BrainXRayReportNode", BrainXrayReportNode)

    builder.add_conditional_edges(START, startRouter)
    builder.add_conditional_edges("classifierNode", imageClassifier)
    builder.add_conditional_edges("xrayClassifierNode", xrayClassifier)
    builder.add_edge("BrainXRayNode", "BrainXRayReportNode")
    
    builder.add_edge("HeartNode", END)
    builder.add_edge("WoundNode", END)
    builder.add_edge("BrainXRayReportNode", END)
    builder.add_edge("ChestXRayNode", END)
    builder.add_edge("pdfSummarizerNode", END)
    builder.add_edge("clinicalNode", END)
    
    return builder
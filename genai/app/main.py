from typing import Literal,Optional
from langgraph.graph import StateGraph,START,END
from langgraph.graph import MessagesState
from langchain_core.messages import SystemMessage,HumanMessage,AIMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from prompts import fixerPrompt,clinicalPrompt,brainXrayPrompt
import os
import requests
import boto3
import uuid

BUCKET_NAME = "health-pearl"  
IMAGE_URL = "/Users/kaizopearl/WebDev/IIIT-Work/Health/ml/static/cam_image.jpg"  
OBJECT_NAME = f"images/xray/{uuid.uuid4().hex}.jpg"   
REGION = "ap-south-1"   



load_dotenv()

openai_key=os.getenv("OPENAI_API_KEY")
langsmith_key=os.getenv("LANGSMITH_API_KEY")
langsmith_tracing=os.getenv("LANGSMITH_TRACING")
project_name = os.getenv("LANGSMITH_PROJECT")
database_url = os.getenv("DATABASE_URL")

openAi_Client =ChatOpenAI(model="gpt-4",temperature=0,api_key=openai_key)
s3Client = boto3.client("s3", region_name=REGION)


class ChatStateMain(MessagesState):
    imageURL: Optional[str] = None
    pdfURL: Optional[str] = None
    prediction: Optional[str] = None
    rImageUrl: Optional[str] = None

def startRouter(state:ChatStateMain) -> Literal['classifierNode', 'pdfSummarizerNode', 'clinicalNode']:
    """Maps The Nodes To The Respective SubGraphs."""
    imageUrl=state.get("imageURL")
    pdfUrl=state.get("pdfURL")
    if imageUrl:
        return "classifierNode"
    elif pdfUrl:
        return "pdfSummarizerNode"
    else:
        return "clinicalNode"

def classifierNode(state:ChatStateMain) -> ChatStateMain:
    return state

def xrayClassifierNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the X-Ray Classification."""
    return state

def BrainXrayNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the Brain X-Ray Classification."""
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")
    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content
    destination_url = "http://localhost:5000/predict"
    files = {'file': ('image.jpg', image_bytes, 'image/jpeg')}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()
    s3Client.upload_file(IMAGE_URL, BUCKET_NAME, OBJECT_NAME)
    public_url=f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"
    return {"prediction": result.get("prediction"),
            "imageURL": public_url}

def BrainXrayReportNode(state:ChatStateMain) -> ChatStateMain:
    """Generates a report for the Brain X-Ray."""
    prediction = state.get("prediction")
    if not prediction:
        raise ValueError("No prediction provided in state.")
    system_message = SystemMessage(content=brainXrayPrompt.format(prediction=prediction))
    response = openAi_Client.invoke([system_message]+[HumanMessage(content=state.get("messages")[-1].content)])
    return {"messages":AIMessage(response.content)}

def LiverXRayNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the Liver X-Ray Classification."""
    return state

def ChestXRayNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the Chest X-Ray Classification."""
    return state

def HeartNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the Brain X-Ray."""
    return state

def WoundNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the Wound X-Ray."""
    return state

def pdfSummarizerNode(state:ChatStateMain) -> ChatStateMain:
    return state

def promptFixerNode(state:ChatStateMain) -> ChatStateMain:
    """Handles the prompt fixing for the user input."""
    if(state.get("messages") is None or len(state.get("messages")) == 0):
        return state
    message=state.get("messages")[-1].content
    if(not message or message.strip() == ""):
        return state
    system_message=SystemMessage(fixerPrompt)
    response=openAi_Client.invoke([system_message]+[HumanMessage(content=message)])
    improved_text=response.content
    state.get("messages")[-1].content = improved_text
    return state

def clinicalNode(state:ChatStateMain)-> ChatStateMain:
    """Handles Basic Health Condition Queries""" 
    system_message=SystemMessage(clinicalPrompt)
    response=openAi_Client.invoke([system_message]+[HumanMessage(content=state.get("messages")[-1].content)])
    return {"messages":AIMessage(response.content)}

def imageClassifier(state:ChatStateMain) -> Literal["xrayClassifierNode", "HeartNode", "WoundNode"]:
    """Handles the Image Classification."""
    imageUrl=state.get("imageURL")
    return "xrayClassifierNode"
    if "xray" in imageUrl.lower(): return "xrayClassifierNode"
    if "wound" in imageUrl.lower(): return "WoundNode"
    return "HeartNode"

def xrayClassifier(state:ChatStateMain) -> Literal["BrainXRayNode","LiverXRayNode","ChestXRayNode"]:
    """Handles the X-Ray Classification."""
    imageUrl=state.get("imageURL")
    if "brain" in imageUrl.lower(): return "BrainXRayNode"
    if "liver" in imageUrl.lower(): return "LiverXRayNode"
    return "ChestXRayNode"

builder=StateGraph(ChatStateMain)
builder.add_node("promptFixerNode", promptFixerNode)
builder.add_node("clinicalNode", clinicalNode)
builder.add_node("classifierNode", classifierNode)
builder.add_node("pdfSummarizerNode", pdfSummarizerNode)
builder.add_node("xrayClassifierNode", xrayClassifierNode)
builder.add_node("BrainXRayNode", BrainXrayNode)
builder.add_node("LiverXRayNode", LiverXRayNode)
builder.add_node("ChestXRayNode", ChestXRayNode)
builder.add_node("HeartNode", HeartNode)
builder.add_node("WoundNode", WoundNode)
builder.add_node("BrainXRayReportNode", BrainXrayReportNode)

builder.add_edge(START,"promptFixerNode")
builder.add_conditional_edges("promptFixerNode",startRouter)
builder.add_conditional_edges("classifierNode",imageClassifier)
builder.add_conditional_edges("xrayClassifierNode", xrayClassifier)
builder.add_edge("BrainXRayNode","BrainXRayReportNode")
builder.add_edge("HeartNode",END)
builder.add_edge("WoundNode",END)
builder.add_edge("BrainXRayReportNode",END)
builder.add_edge("LiverXRayNode",END)
builder.add_edge("ChestXRayNode",END)
builder.add_edge("pdfSummarizerNode",END)   
builder.add_edge("clinicalNode",END)


graph=builder.compile()




    
from typing import Literal, Optional
from langgraph.graph import StateGraph, START, END
from langgraph.graph import MessagesState
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from app.prompts import fixerPrompt, clinicalPrompt, brainXrayPrompt
import os
import requests
import boto3
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app import crud
from fastapi import FastAPI
from app.routers import sessions
import re

app = FastAPI(title="Pearl GenAI")

app.include_router(sessions.router)

BUCKET_NAME = "health-pearl"
IMAGE_URL = "/Users/kaizopearl/WebDev/IIIT-Work/Health/ml/static/cam_image.jpg"
OBJECT_NAME = f"images/xray/{uuid.uuid4().hex}.jpg"
REGION = "ap-south-1"

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
database_url = os.getenv("DATABASE_URL")

openAi_Client = ChatOpenAI(model="gpt-4", temperature=0, api_key=openai_key)
s3Client = boto3.client("s3", region_name=REGION)


class ChatStateMain(MessagesState):
    imageURL: Optional[str] = None
    pdfURL: Optional[str] = None
    prediction: Optional[str] = None
    rImageUrl: Optional[str] = None


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


def classifierNode(state: ChatStateMain) -> ChatStateMain:
    return state


def xrayClassifierNode(state: ChatStateMain) -> ChatStateMain:
    return state


def BrainXrayNode(state: ChatStateMain) -> ChatStateMain:
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")

    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content
    destination_url = "http://127.0.0.1:5000/predict_brain"
    files = {'file': ('image.jpg', image_bytes, 'image/jpeg')}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()

    s3Client.upload_file(IMAGE_URL, BUCKET_NAME, OBJECT_NAME)
    public_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"

    return {"prediction": result.get("prediction"), "imageURL": public_url}


def BrainXrayReportNode(state: ChatStateMain) -> ChatStateMain:
    prediction = state.get("prediction")
    if not prediction:
        raise ValueError("No prediction provided in state.")

    system_message = SystemMessage(content=brainXrayPrompt.format(prediction=prediction))
    response = openAi_Client.invoke(
        [system_message] + [HumanMessage(content=state.get("messages")[-1].content)]
    )
    return {"messages": AIMessage(response.content)}


def ChestXRayNode(state: ChatStateMain) -> ChatStateMain:
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")

    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content
    destination_url = "http://127.0.0.1:5000/predict_lung"
    files = {'file': ('image.jpg', image_bytes, 'image/jpeg')}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()

    cam_image_path = "static/lung_cam_image.jpg"
    OBJECT_NAME = f"images/lung/{uuid.uuid4().hex}.jpg"
    s3Client.upload_file(cam_image_path, BUCKET_NAME, OBJECT_NAME)
    public_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"

    return {"prediction": result.get("prediction"), "imageURL": public_url}

def WoundNode(state: ChatStateMain) -> ChatStateMain:
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")

    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content
    destination_url = "http://127.0.0.1:5000/predict_wound"
    files = {'file': ('image.jpg', image_bytes, 'image/jpeg')}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()

    cam_image_path = "static/cam_wound_image.jpg"
    OBJECT_NAME = f"images/wound/{uuid.uuid4().hex}.jpg"
    s3Client.upload_file(cam_image_path, BUCKET_NAME, OBJECT_NAME)
    public_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"

    return {"prediction": result.get("prediction"), "imageURL": public_url}

def HeartNode(state: ChatStateMain) -> ChatStateMain:
    import re
    import requests

    messages = state.get("messages", [])
    last_message = messages[-1].content if messages else ""

    features = state.get("features")
    
    if not features:
        try:
            nums = re.findall(r"[-+]?\d*\.\d+|\d+", last_message)
            features = [float(x) for x in nums[:5]]
        except Exception:
            raise ValueError(
                "HeartNode requires 'features' in state or numeric message with 5 values. "
                "Expected: [MAXHR, ChestPainType (0–2), Cholesterol, Oldpeak, ST_Slope]."
            )

    if len(features) != 5:
        raise ValueError(
            "HeartNode requires exactly 5 numeric features. "
            "Expected: [MAXHR, ChestPainType (0–2), Cholesterol, Oldpeak, ST_Slope]."
        )

    destination_url = "http://127.0.0.1:5000/predict"
    response = requests.post(destination_url, json={"features": features})
    response.raise_for_status()
    result = response.json()
    prediction = result.get("prediction")

    if prediction == 0:
        interpretation = "According to your features, your heart seems healthy."
    elif prediction == 1:
        interpretation = "There may be a risk of heart disease based on your features. Consult a cardiologist."
    else:
        interpretation = "Model returned an unexpected result. Please check your input."

    return {"prediction": interpretation}

def pdfSummarizerNode(state: ChatStateMain) -> ChatStateMain:
    return state


def promptFixerNode(state: ChatStateMain) -> ChatStateMain:
    if state.get("messages") is None or len(state.get("messages")) == 0:
        return state
    message = state.get("messages")[-1].content
    if not message or message.strip() == "":
        return state
    system_message = SystemMessage(fixerPrompt)
    response = openAi_Client.invoke([system_message] + [HumanMessage(content=message)])
    improved_text = response.content
    state.get("messages")[-1].content = improved_text
    return state


def clinicalNode(state: ChatStateMain) -> ChatStateMain:
    system_message = SystemMessage(clinicalPrompt)
    response = openAi_Client.invoke(
        [system_message] + [HumanMessage(content=state.get("messages")[-1].content)]
    )
    return {"messages": AIMessage(response.content)}


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


def save_message_to_db(
    session_id: str,
    role: str,
    content: Optional[str] = None,
    image_url: Optional[str] = None,
    pdf_url: Optional[str] = None,
    prediction: Optional[str] = None
):
    db: Session = SessionLocal()
    try:
        embedding = None
        if content:
            from openai import OpenAI
            client = OpenAI()
            embedding_response = client.embeddings.create(
                model="text-embedding-3-small",
                input=content
            )
            embedding = embedding_response.data[0].embedding

        message_data = {
            "role": role,
            "content": content,
            "image_url": image_url,
            "pdf_url": pdf_url,
            "prediction": prediction,
            "embedding": embedding
        }

        crud.add_message(db, session_id, message_data, user_email=role)
    finally:
        db.close()



builder = StateGraph(ChatStateMain)
builder.add_node("promptFixerNode", promptFixerNode)
builder.add_node("clinicalNode", clinicalNode)
builder.add_node("classifierNode", classifierNode)
builder.add_node("pdfSummarizerNode", pdfSummarizerNode)
builder.add_node("xrayClassifierNode", xrayClassifierNode)
builder.add_node("BrainXRayNode", BrainXrayNode)
builder.add_node("ChestXRayNode", ChestXRayNode)
builder.add_node("HeartNode", HeartNode)
builder.add_node("WoundNode", WoundNode)
builder.add_node("BrainXRayReportNode", BrainXrayReportNode)

builder.add_edge(START, "promptFixerNode")
builder.add_conditional_edges("promptFixerNode", startRouter)
builder.add_conditional_edges("classifierNode", imageClassifier)
builder.add_conditional_edges("xrayClassifierNode", xrayClassifier)
builder.add_edge("BrainXRayNode", "BrainXRayReportNode")
builder.add_edge("HeartNode", END)
builder.add_edge("WoundNode", END)
builder.add_edge("BrainXRayReportNode", END)
builder.add_edge("ChestXRayNode", END)
builder.add_edge("pdfSummarizerNode", END)
builder.add_edge("clinicalNode", END)

graph = builder.compile()

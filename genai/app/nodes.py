import re
import uuid
import requests
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from .state import ChatStateMain
from .clients import openAi_Client, s3Client, BUCKET_NAME, REGION, rich
from .prompts import brainXrayPrompt, clinicalPrompt

def classifierNode(state: ChatStateMain) -> ChatStateMain:
    return state

import requests
import uuid
import rich

def xrayClassifierNode(state: ChatStateMain) -> ChatStateMain:
    try:
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
        print("📡 Classifier response status:", response.status_code)
        print("📦 Classifier response body:", response.text)

        response.raise_for_status()
        data = response.json()
        prediction = data.get("prediction")

        state.prediction = prediction
        state.output = f"Prediction: {prediction}"

        OBJECT_NAME = f"images/classifier/{uuid.uuid4().hex}.jpg"
        try:
            s3Client.put_object(
                Body=image_bytes,
                Bucket=BUCKET_NAME,
                Key=OBJECT_NAME,
                ContentType="image/jpeg",
            )
            public_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"
            state.rImageUrl = public_url
        except Exception as e:
            rich.print(f"[red]S3 Upload Error: {e}[/red]")

        return state

    except Exception as e:
        err_msg = f"Exception occurred in xrayClassifierNode: {str(e)}"
        state.output = err_msg
        print(f"❌ {err_msg}")
        return state



def pdfSummarizerNode(state: ChatStateMain) -> ChatStateMain:
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

    OBJECT_NAME = f"images/xray/{uuid.uuid4().hex}.jpg"
    try:
        s3Client.put_object(
            Body=image_bytes, 
            Bucket=BUCKET_NAME, 
            Key=OBJECT_NAME, 
            ContentType='image/jpeg'
        )
    except Exception as e:
        rich.print(f"[red]S3 Upload Error: {e}[/red]")
    
    public_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"
    return {"prediction": result.get("prediction"), "imageURL": public_url}

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

    OBJECT_NAME = f"images/lung/{uuid.uuid4().hex}.jpg"
    try:
        s3Client.put_object(
            Body=image_bytes, 
            Bucket=BUCKET_NAME, 
            Key=OBJECT_NAME, 
            ContentType='image/jpeg'
        )
    except Exception as e:
        rich.print(f"[red]S3 Upload Error: {e}[/red]")
    
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

    OBJECT_NAME = f"images/wound/{uuid.uuid4().hex}.jpg"
    try:
        s3Client.put_object(
            Body=image_bytes, 
            Bucket=BUCKET_NAME, 
            Key=OBJECT_NAME, 
            ContentType='image/jpeg'
        )
    except Exception as e:
        rich.print(f"[red]S3 Upload Error: {e}[/red]")
    
    public_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{OBJECT_NAME}"
    return {"prediction": result.get("prediction"), "imageURL": public_url}

def HeartNode(state: ChatStateMain) -> ChatStateMain:
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

def clinicalNode(state: ChatStateMain) -> ChatStateMain:
    system_message = SystemMessage(clinicalPrompt)
    all_messages = state.get("messages", [])
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}
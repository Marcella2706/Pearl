import re
import uuid
import requests
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from .state import ChatStateMain
from .clients import openAi_Client, s3Client, BUCKET_NAME, REGION, rich
from .prompts import brainXrayPrompt, clinicalPrompt
import requests
import uuid
import rich

def BrainXRayClinicalNode(state: ChatStateMain) -> ChatStateMain:
    prediction = state.get("prediction")
    pred_str = "" if prediction is None else str(prediction)
    system_message = SystemMessage(brainXrayPrompt.replace("{prediction}", pred_str))
    print("🧠 Brain X-Ray Clinical Node - Prediction:", prediction)
    messages = state.get("messages") or []
    all_messages = messages if len(messages) < 3 else messages[-3:]
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}

def xrayClassifierNode(state: ChatStateMain) -> ChatStateMain:
    try:
        image_url = state.get("imageURL")
        if not image_url:
            raise ValueError("No image URL provided in state.")
        response = requests.get(image_url)
        response.raise_for_status()
        image_bytes = response.content
        destination_url = "http://127.0.0.1:5001/predict_classify"
        files = {'file': ('image.jpg', image_bytes, 'image/jpeg')}
        response = requests.post(destination_url, files=files)
        response.raise_for_status()
        print("📡 Classifier response status:", response.status_code)
        print("📦 Classifier response body:", response.text)
        data = response.json()
        prediction = data.get("prediction")
        print("✅ X-Ray classified as:", prediction)
        return {"prediction": prediction, "imageURL": image_url}

    except Exception as e:
        err_msg = f"Exception occurred in xrayClassifierNode: {str(e)}"
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
    
    destination_url = "https://kyanmahajan-brain-tumour-classifier.hf.space/predict"
    files = {'file': ('image.jpg', image_bytes, 'image/jpeg')}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()
    cam_image_url = None
    if result.get("cam_image_url"):
        try:
            cam_url = "https://kyanmahajan-brain-tumour-classifier.hf.space" + result.get("cam_image_url")
            cam_response = requests.get(cam_url)
            cam_response.raise_for_status()
            cam_image_bytes = cam_response.content
            CAM_OBJECT_NAME = f"images/cam/{uuid.uuid4().hex}.jpg"
            s3Client.put_object(
                Body=cam_image_bytes,
                Bucket=BUCKET_NAME,
                Key=CAM_OBJECT_NAME,
                ContentType='image/jpeg'
            )
            cam_image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{CAM_OBJECT_NAME}"
        except Exception as e:
            rich.print(f"[red]CAM Image Upload Error: {e}[/red]")
    print("✅ Brain X-Ray prediction:", result.get("prediction"))
    return {
        "prediction": result.get("prediction"), 
        "rImageUrl": cam_image_url
    }

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
    messages = state.get("messages") or []
    all_messages = messages if len(messages) < 3 else messages[-3:]
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}
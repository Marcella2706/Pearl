import re
import uuid
import requests
from langchain_core.messages import SystemMessage, AIMessage
from .state import ChatStateMain
from .clients import openAi_Client, s3Client, BUCKET_NAME, REGION, rich
from .prompts import (
    brainXrayPrompt, clinicalPrompt, heartPrompt,
    woundPrompt, lungXrayPrompt
)

def HeartClinicalNode(state: ChatStateMain) -> ChatStateMain:
    prediction = state.get("prediction")
    pred_str = str(prediction) if prediction is not None else "Unknown"
    system_message = SystemMessage(heartPrompt.replace("{prediction}", pred_str))
    print("🫀 Heart Clinical Node - Prediction:", prediction)
    messages = state.get("messages") or []
    all_messages = messages[-3:] if len(messages) >= 3 else messages
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}


def BrainXRayClinicalNode(state: ChatStateMain) -> ChatStateMain:
    prediction = state.get("prediction")
    pred_str = str(prediction or "")
    system_message = SystemMessage(brainXrayPrompt.replace("{prediction}", pred_str))
    print("🧠 Brain X-Ray Clinical Node - Prediction:", prediction)
    messages = state.get("messages") or []
    all_messages = messages[-3:] if len(messages) >= 3 else messages
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}

def WoundClinicalNode(state: ChatStateMain) -> ChatStateMain:
    prediction = state.get("prediction")
    pred_str = str(prediction or "")
    system_message = SystemMessage(woundPrompt.replace("{prediction}", pred_str))
    print("🩺 Wound Clinical Node - Prediction:", prediction)
    messages = state.get("messages") or []
    all_messages = messages[-3:] if len(messages) >= 3 else messages
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}

def ChestClinicalNode(state: ChatStateMain) -> ChatStateMain:
    prediction = state.get("prediction")
    pred_str = str(prediction or "")
    system_message = SystemMessage(lungXrayPrompt.replace("{prediction}", pred_str))
    print("🫁 Chest X-Ray Clinical Node - Prediction:", prediction)
    messages = state.get("messages") or []
    all_messages = messages[-3:] if len(messages) >= 3 else messages
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}

def xrayClassifierNode(state: ChatStateMain) -> ChatStateMain:
    try:
        image_url = state.get("imageURL")
        if not image_url:
            raise ValueError("❌ No image URL provided in state.")

        response = requests.get(image_url)
        response.raise_for_status()
        image_bytes = response.content

        destination_url = "https://kyanmahajan-x-ray-classification-docker.hf.space/predict_classify"
        files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
        classifier_response = requests.post(destination_url, files=files)
        classifier_response.raise_for_status()

        data = classifier_response.json()
        prediction = data.get("prediction")

        if not prediction:
            raise ValueError("Classifier did not return a valid prediction.")

        print("📡 Classifier response status:", classifier_response.status_code)
        print("📦 Classifier response body:", data)
        print("✅ X-Ray classified as:", prediction)

        return {
            "prediction": prediction,
            "imageURL": image_url
        }

    except requests.exceptions.RequestException as e:
        print(f"❌ Network error in xrayClassifierNode: {e}")
        return {"error": f"Network error: {e}"}
    except ValueError as e:
        print(f"❌ Value error in xrayClassifierNode: {e}")
        return {"error": str(e)}
    except Exception as e:
        print(f"❌ Unexpected error in xrayClassifierNode: {e}")
        return {"error": str(e)}

def BrainXrayNode(state: ChatStateMain) -> ChatStateMain:
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")
    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content

    destination_url = "https://kyanmahajan-brain-tumour-classifier.hf.space/predict"
    files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()

    cam_image_url = None
    if result.get("cam_image_url"):
        try:
            cam_url = "https://kyanmahajan-brain-tumour-classifier.hf.space" + result["cam_image_url"]
            cam_response = requests.get(cam_url)
            cam_response.raise_for_status()
            cam_image_bytes = cam_response.content
            CAM_OBJECT_NAME = f"images/cam/{uuid.uuid4().hex}.jpg"
            s3Client.put_object(
                Body=cam_image_bytes,
                Bucket=BUCKET_NAME,
                Key=CAM_OBJECT_NAME,
                ContentType="image/jpeg"
            )
            cam_image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{CAM_OBJECT_NAME}"
        except Exception as e:
            rich.print(f"[red]CAM Image Upload Error: {e}[/red]")

    print("✅ Brain X-Ray prediction:", result.get("prediction"))
    return {"prediction": result.get("prediction"), "rImageUrl": cam_image_url}

def ChestXRayNode(state: ChatStateMain) -> ChatStateMain:
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")
    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content

    destination_url = "https://kyanmahajan-lung-classifier.hf.space/predict_lung"
    files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()
    print(result)

    cam_image_url = None
    if result.get("cam_image_url"):
        try:
            cam_url = "https://kyanmahajan-lung-classifier.hf.space" + result["cam_image_url"]
            cam_response = requests.get(cam_url)
            cam_response.raise_for_status()
            cam_image_bytes = cam_response.content
            CAM_OBJECT_NAME = f"images/cam/{uuid.uuid4().hex}.jpg"
            s3Client.put_object(
                Body=cam_image_bytes,
                Bucket=BUCKET_NAME,
                Key=CAM_OBJECT_NAME,
                ContentType="image/jpeg"
            )
            cam_image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{CAM_OBJECT_NAME}"
        except Exception as e:
            rich.print(f"[red]CAM Image Upload Error: {e}[/red]")

    print("✅ Chest X-Ray prediction:", result.get("prediction"))
    print("✅ CAM Image URL:", cam_image_url)
    return {"prediction": result.get("prediction"), "rImageUrl": cam_image_url}

def WoundNode(state: ChatStateMain) -> ChatStateMain:
    image_url = state.get("imageURL")
    if not image_url:
        raise ValueError("No image URL provided in state.")
    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content

    destination_url = "https://kyanmahajan-wound-classifier.hf.space/predict_wound"
    files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
    response = requests.post(destination_url, files=files)
    response.raise_for_status()
    result = response.json()

    cam_image_url = None
    if result.get("cam_image_url"):
        try:
            cam_url = "https://kyanmahajan-wound-classifier.hf.space" + result["cam_image_url"]
            cam_response = requests.get(cam_url)
            cam_response.raise_for_status()
            cam_image_bytes = cam_response.content
            CAM_OBJECT_NAME = f"images/cam/{uuid.uuid4().hex}.jpg"
            s3Client.put_object(
                Body=cam_image_bytes,
                Bucket=BUCKET_NAME,
                Key=CAM_OBJECT_NAME,
                ContentType="image/jpeg"
            )
            cam_image_url = f"https://{BUCKET_NAME}.s3.{REGION}.amazonaws.com/{CAM_OBJECT_NAME}"
        except Exception as e:
            rich.print(f"[red]CAM Image Upload Error: {e}[/red]")

    print("✅ Wound prediction:", result.get("prediction"))
    return {"prediction": result.get("prediction"), "rImageUrl": cam_image_url}

def HeartNode(state: ChatStateMain) -> ChatStateMain:
    try:
        messages = state.get("messages", [])
        last_message = messages[-1].content if messages else ""
        features = state.get("features")

        if not features:
            nums = re.findall(r"[-+]?\d*\.\d+|\d+", last_message)
            features = [float(x) for x in nums[:5]]

        if len(features) != 5:
            raise ValueError(
                "HeartClassifierNode requires exactly 5 numeric features. "
                "Expected: [MAXHR, ChestPainType (0–2), Cholesterol, Oldpeak, ST_Slope]."
            )

        destination_url = "https://kyanmahajan-heart-disease-predicition.hf.space/predict"
        response = requests.post(destination_url, json={"features": features})
        response.raise_for_status()
        result = response.json()
        prediction = result.get("prediction")

        print("💓 Heart Model Prediction:", prediction)
        return {"prediction": prediction, "features": features}

    except Exception as e:
        print(f"❌ Exception in HeartClassifierNode: {e}")
        return state

def clinicalNode(state: ChatStateMain) -> ChatStateMain:
    system_message = SystemMessage(clinicalPrompt)
    messages = state.get("messages") or []
    all_messages = messages[-3:] if len(messages) >= 3 else messages
    response = openAi_Client.invoke([system_message] + all_messages)
    return {"messages": AIMessage(response.content)}

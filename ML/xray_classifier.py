
import torch
import torch.nn as nn
from torchvision import models, transforms
from flask import Flask, jsonify, request, render_template
from PIL import Image
import os
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import cv2
import cv2
import torch

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

from flask_cors import CORS




app = Flask(__name__)
CORS(app)
os.makedirs("static", exist_ok=True)

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# Transform setup (same as training)
data_transforms = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


model = models.resnet18(pretrained=False);
model.fc = nn.Linear(model.fc.in_features, 3);
model.load_state_dict(torch.load("resnet18_brain_tumor.pth", map_location=device))

model.to(device)
model.eval()


class_names = [
    "wound",
    "brain",
    "lung"
]

# @app.route("/")
# def home():
#     return render_template("index.html")

@app.route("/predict_classify", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    filepath = os.path.join("static", file.filename)
    file.save(filepath)

    try:
        image = Image.open(filepath).convert("RGB")
        input_tensor = data_transforms(image).unsqueeze(0).to(device)  

        with torch.no_grad():
            output = model(input_tensor)
            pred_idx = torch.argmax(output, dim=1).item()
            pred_label = class_names[pred_idx]
     

       

       
        file={
            "prediction": pred_label,
            
        }
        print(file)
        return jsonify(file)

             



        
       
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5000)



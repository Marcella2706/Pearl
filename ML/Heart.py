from flask import Flask, render_template, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS

# Initialize app
app = Flask(__name__)
CORS(app)
# Load model
model = joblib.load('ML/Heart_model.pkl')


# @app.route('/')
# def home():
#     return render_template('indexx.html')

# Prediction route

# Predict route expects an array of 5 integers/floats the second number needs to be between 0,1,2 

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_data = np.array(data['features'])
    if input_data[1] not in [0, 1, 2]:
       return jsonify({'error': 'Feature 2 must be 0, 1, or 2'}), 400 
    
    output = model.predict(input_data.reshape(1,-1))
   
    print(int(output[0]))
    return jsonify({'prediction': int(output[0])})

if __name__ == '__main__':
    app.run(debug=True)

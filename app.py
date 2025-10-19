from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
from tensorflow.keras.models import load_model
import numpy as np
import pandas as pd

# Initialize the Flask app with correct static file handling
# This tells Flask that your CSS and JS are in the 'templates' folder
app = Flask(__name__, static_folder='templates', static_url_path='')
CORS(app)

# --- Load Saved Model and Transformers ---
try:
    model = load_model('career_prediction_model.h5')
    scaler = joblib.load('scaler.gz')
    label_encoder = joblib.load('label_encoder.gz')
    print("✅ Model and transformers loaded successfully!")
except Exception as e:
    print(f"❌ FATAL: Error loading model or transformer files: {e}")
    raise e

# --- Define the 21-feature order (CRITICAL) ---
# This MUST match the order your model was trained on
feature_order = [
    'interest_programming', 'interest_data_analysis', 'interest_system_architecture',
    'interest_hardware', 'interest_visual_design', 'workstyle_focus',
    'workstyle_collaboration', 'workstyle_pace', 'workstyle_problem_type',
    'skill_abstract_problem_solving', 'skill_math_quantitative',
    'skill_communication_storytelling', 'skill_visual_design', 'skill_leadership',
    'motivator_primary_driver', 'motivator_risk_tolerance', 'pref_learning_style',
    'pref_project_type', 'pref_core_focus', 'pref_user_proximity',
    'pref_patience_for_impact'
]

@app.route('/')
def home():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    """API endpoint to make top 5 career predictions."""
    try:
        data = request.json
        # This expects the data in the format: {"answers": {...}}
        user_inputs_map = data.get("answers", {})

        if not user_inputs_map:
            raise ValueError("Missing 'answers' key in the received JSON data.")

        # Create the feature array in the correct order
        user_inputs = [user_inputs_map.get(feature, 3) for feature in feature_order]
        input_array = np.array(user_inputs).reshape(1, -1)
        
        # Create a DataFrame with feature names to prevent the scaler warning
        input_df = pd.DataFrame(input_array, columns=feature_order)
        
        # Scale the features
        scaled_input = scaler.transform(input_df)
        
        # Get probabilities for ALL classes
        prediction_probabilities = model.predict(scaled_input)[0]
        
        # Get the indices of the top 5 predictions
        top_5_indices = np.argsort(prediction_probabilities)[-5:][::-1]
        
        # Create the list of recommendations
        recommendations = []
        for index in top_5_indices:
            career_name = label_encoder.inverse_transform([index])[0]
            confidence = float(prediction_probabilities[index] * 100)
            
            recommendations.append({
                'career': career_name,
                'confidence': confidence
            })
            
        return jsonify(recommendations)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': f'An error occurred on the server: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
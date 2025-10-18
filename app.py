from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
from tensorflow.keras.models import load_model
import numpy as np

# Initialize the Flask app
app = Flask(__name__, static_folder='templates')
# Enable CORS (Cross-Origin Resource Sharing)
CORS(app)

# --- Load Saved Model and Transformers ---
try:
    model = load_model('career_prediction_model.h5')
    scaler = joblib.load('scaler.gz')
    label_encoder = joblib.load('label_encoder.gz')
    print("Model and transformers loaded successfully!")
except Exception as e:
    print(f"Error loading files: {e}")
    # We'll stop the app if the files can't be loaded
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
    """API endpoint to make career predictions."""
    try:
        # Get the JSON data sent from the frontend
        data = request.json
        
        # --- Create the feature array in the correct order ---
        # We receive a dictionary, so we map it to the correct order
        user_inputs = [data[feature] for feature in feature_order]

        # Convert to numpy array and reshape for the scaler
        input_array = np.array(user_inputs).reshape(1, -1)

        # Scale the features
        scaled_input = scaler.transform(input_array)

        # Make prediction
        prediction_probabilities = model.predict(scaled_input)
        predicted_index = np.argmax(prediction_probabilities)

        # Decode the prediction
        predicted_career = label_encoder.inverse_transform([predicted_index])[0]
        confidence = float(np.max(prediction_probabilities) * 100) # Convert to standard float

        # Send the response back to the frontend
        return jsonify({
            'career': predicted_career,
            'confidence': confidence
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

# Run the app
if __name__ == '__main__':
    # Using port 5000
    app.run(debug=True, port=5000)
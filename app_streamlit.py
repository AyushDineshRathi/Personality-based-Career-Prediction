import streamlit as st
import numpy as np
import joblib
from tensorflow.keras.models import load_model

# --- Page Configuration (MUST BE THE FIRST STREAMLIT COMMAND) ---
st.set_page_config(page_title="Personality-Based Career Prediction", layout="wide")

# --- Page Title and Description ---
st.title("🧠 Personality-Based Career Prediction")
st.write("Answer the following questions on a scale of 1 to 5 to discover your recommended career path!")

# --- Load the Saved Files ---
# Use st.cache_resource to load the model and transformers only once
@st.cache_resource
def load_prediction_assets():
    """Loads the saved model, scaler, and label encoder."""
    model = load_model('career_prediction_model.h5')
    scaler = joblib.load('scaler.gz')
    label_encoder = joblib.load('label_encoder.gz')
    return model, scaler, label_encoder

# Load the assets and handle potential errors
try:
    model, scaler, label_encoder = load_prediction_assets()
except Exception as e:
    st.error(f"Error loading saved files. Please ensure 'career_prediction_model.h5', 'scaler.gz', and 'label_encoder.gz' are in the same folder as app.py.")
    st.error(f"Details: {e}")
    st.stop()


# --- Define the Prediction Function ---
def predict_career(user_input):
    """Scales user input and predicts the career."""
    # Convert input to a numpy array and reshape
    input_array = np.array(user_input).reshape(1, -1)

    # Scale the input using the loaded scaler
    scaled_input = scaler.transform(input_array)

    # Make the prediction
    prediction_probabilities = model.predict(scaled_input)
    predicted_index = np.argmax(prediction_probabilities)

    # Decode the prediction back to the career name
    predicted_career = label_encoder.inverse_transform([predicted_index])[0]
    confidence_score = np.max(prediction_probabilities) * 100

    return predicted_career, confidence_score


# --- Streamlit Web App Interface ---
# Create two columns for a cleaner layout
col1, col2 = st.columns(2)

# Using a dictionary to hold questions for easier management
questions = {
    "Technical Interests": [
        "interest_programming: How interested are you in Programming & Algorithmic Logic?",
        "interest_data_analysis: How interested are you in Data Analysis & Statistics?",
        "interest_system_architecture: How interested are you in System Architecture & Design?",
        "interest_hardware: How interested are you in Hardware & Physical Systems?",
        "interest_visual_design: How interested are you in Visual Design & User Experience?"
    ],
    "Work Style & Skills": [
        "workstyle_focus: (1: Deep Work, 5: Big Picture Strategy)",
        "workstyle_collaboration: (1: Solo, 5: Team Collaboration)",
        "workstyle_pace: (1: Stable & Predictable, 5: Fast-Paced & Dynamic)",
        "workstyle_problem_type: (1: Abstract & Theoretical, 5: Concrete & Tangible)",
        "skill_abstract_problem_solving: Rate your confidence in Abstract Problem Solving.",
        "skill_math_quantitative: Rate your confidence in Mathematical & Quantitative Reasoning.",
        "skill_communication_storytelling: Rate your confidence in Communication & Storytelling.",
        "skill_visual_design: Rate your confidence in your sense for Visual Design & Aesthetics.",
        "skill_leadership: Rate your confidence in Leadership & People Management."
    ],
    "Motivators & Preferences": [
        "motivator_primary_driver: (1: Tech Challenges, 2: User Products, 3: Business Goals, 4: Financial Reward, 5: Creative Freedom)",
        "motivator_risk_tolerance: (1: Risk-Averse, 5: High Risk-Taker)",
        "pref_learning_style: How do you prefer to learn? (1: Docs/Theory, 2: Tutorials, 3: Experimenting)",
        "pref_project_type: (1: Build from Scratch, 5: Improve Existing System)",
        "pref_core_focus: (1: Theory/Why it works, 5: Application/Making it work)",
        "pref_user_proximity: How important is direct user interaction for you? (1: Not important, 5: Very important)",
        "pref_patience_for_impact: (1: Long-term impact, 5: Quick results)"
    ]
}

user_inputs = []

# Display sliders for each question
with col1:
    st.header("Interests & Work Style")
    # A bit of a workaround to get the right number of inputs in the list
    input_indices_col1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    q_counter = 0
    for q_key in ["Technical Interests", "Work Style & Skills"]:
        for question in questions[q_key]:
            label = question.split(':')[1].strip()
            key = question.split(':')[0]
            if "pref_learning_style" in question:
                val = st.slider(label, 1, 3, 2, key=key)
            else:
                val = st.slider(label, 1, 5, 3, key=key)
            user_inputs.insert(input_indices_col1[q_counter], val)
            q_counter += 1

with col2:
    st.header("Motivators & Preferences")
    input_indices_col2 = [14, 15, 16, 17, 18, 19, 20]
    q_counter = 0
    for question in questions["Motivators & Preferences"]:
        label = question.split(':')[1].strip()
        key = question.split(':')[0]
        if "pref_learning_style" in question:
             val = st.slider(label, 1, 3, 2, key=key)
        else:
            val = st.slider(label, 1, 5, 3, key=key)
        user_inputs.insert(input_indices_col2[q_counter], val)
        q_counter += 1

# --- Prediction Button and Output ---
if st.button("✨ Predict My Career", use_container_width=True):
    if len(user_inputs) == 21:
        # Get prediction
        predicted_career, confidence = predict_career(user_inputs)
        
        # Display the result
        st.success(f"### Your Recommended Career Path is:")
        st.markdown(f"<h1 style='text-align: center; color: #28a745;'>{predicted_career}</h1>", unsafe_allow_html=True)
        st.info(f"**Confidence:** {confidence:.2f}%")
    else:
        st.error(f"Something went wrong. Expected 21 inputs but got {len(user_inputs)}.")
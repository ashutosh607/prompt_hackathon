import sys
import json
import argparse
from pathlib import Path
import pandas as pd
import joblib

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "edtech_random_forest_model.pkl"

# Feature definitions from Ask_Question.py
CATEGORICAL_FEATURES = [
    "topic",
    "field_of_interest",
    "prior_experience",
    "preferred_content",
    "learning_style",
    "difficulty_preference",
]

NUMERIC_FEATURES = [
    "quiz_score",
    "concept_score",
    "practical_score",
    "confidence",
    "hours_per_week",
    "completion_rate",
    "avg_session_minutes",
    "quiz_attempts",
    "needs_revision",
    "topic_prerequisite_score",
    "interest_score",
    "knowledge_gap",
]

# Load model once on startup
print(f"[ML] Loading model from {MODEL_PATH}...", file=sys.stderr)
model_pipeline = joblib.load(MODEL_PATH)
print("[ML] Model successfully loaded!", file=sys.stderr)


def prepare_dataframe(input_data: dict) -> pd.DataFrame:
    """Prepares a DataFrame matching the model's exact expected column schema."""
    row = {}

    # Defaults aligned with StudyMatch student defaults
    defaults = {
        "topic": "Linear Regression",
        "field_of_interest": "Machine Learning",
        "prior_experience": "Beginner",
        "preferred_content": "Video",
        "learning_style": "Visual",
        "difficulty_preference": "Beginner",
        "quiz_score": 68.0,
        "concept_score": 62.0,
        "practical_score": 55.0,
        "confidence": 72.0,
        "hours_per_week": 6.0,
        "completion_rate": 45.0,
        "avg_session_minutes": 25.0,
        "quiz_attempts": 2,
        "needs_revision": 0,
        "topic_prerequisite_score": 70.0,
        "interest_score": 85.0,
        "knowledge_gap": 32.0,
    }

    for cat in CATEGORICAL_FEATURES:
        row[cat] = [str(input_data.get(cat, defaults[cat]))]

    for num in NUMERIC_FEATURES:
        val = input_data.get(num, defaults[num])
        try:
            row[num] = [float(val)]
        except (ValueError, TypeError):
            row[num] = [float(defaults[num])]

    return pd.DataFrame(row)


def predict(input_data: dict) -> dict:
    """Runs prediction on student features and returns action, probabilities, and confidence."""
    df_input = prepare_dataframe(input_data)
    pred_action = model_pipeline.predict(df_input)[0]
    probabilities = model_pipeline.predict_proba(df_input)[0]

    class_probs = {
        cls_name: round(float(prob), 4)
        for cls_name, prob in zip(model_pipeline.classes_, probabilities)
    }

    max_prob = float(max(probabilities))

    # Pedagogical guidance mapping based on model recommendation
    pedagogical_guidance = {
        "Build Concept": "Emphasize visual intuition, real-world analogies, and geometrical meaning before mathematical abstractions.",
        "Learn Fundamentals": "Focus on step-by-step definition breakdown, key terms, and prerequisite foundations.",
        "Practice": "Encourage hands-on problem solving, error calculation, and immediate formula application.",
        "Revision": "Provide high-yield bullet points, common traps to avoid, and rapid concept reinforcement.",
        "Study Core Material": "Deepen comprehension of the core derivation and interconnected statistical theorems.",
    }

    return {
        "success": True,
        "predicted_action": pred_action,
        "confidence": round(max_prob, 3),
        "probabilities": class_probs,
        "guidance": pedagogical_guidance.get(
            pred_action,
            "Focus on concept intuition and clear step-by-step reasoning."
        ),
        "input_summary": {
            "topic": df_input["topic"].iloc[0],
            "knowledge_gap": df_input["knowledge_gap"].iloc[0],
            "confidence": df_input["confidence"].iloc[0],
            "learning_style": df_input["learning_style"].iloc[0],
        },
    }


def start_server(port: int = 5002):
    """Optional Flask HTTP microservice for low-latency in-memory predictions."""
    try:
        from flask import Flask, request, jsonify

        app = Flask(__name__)

        @app.route("/health", methods=["GET"])
        def health():
            return jsonify({"status": "healthy", "model": "RandomForestClassifier", "classes": list(model_pipeline.classes_)})

        @app.route("/predict", methods=["POST"])
        def api_predict():
            data = request.get_json() or {}
            result = predict(data)
            return jsonify(result)

        print(f"[ML] Starting ML HTTP service on port {port}...", file=sys.stderr)
        app.run(host="0.0.0.0", port=port, debug=False)
    except Exception as e:
        print(f"[ML] Flask server error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="StudyMatch ML Prediction Service")
    parser.add_argument("--json", type=str, help="JSON input string for CLI prediction")
    parser.add_argument("--server", action="store_true", help="Run as HTTP microservice")
    parser.add_argument("--port", type=int, default=5002, help="Port for HTTP microservice")

    args = parser.parse_args()

    if args.server:
        start_server(args.port)
    elif args.json:
        try:
            data = json.loads(args.json)
            result = predict(data)
            print(json.dumps(result))
        except Exception as err:
            print(json.dumps({"success": False, "error": str(err)}))
            sys.exit(1)
    else:
        # Default test run
        test_res = predict({"topic": "Linear Regression", "quiz_score": 70.0})
        print(json.dumps(test_res, indent=2))

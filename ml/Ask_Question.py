import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# Keep input and output files next to this script regardless of
# the directory from which the script is launched.
BASE_DIR = Path(__file__).resolve().parent


# ============================================================
# 1. LOAD DATASET
# ============================================================

df = pd.read_csv(BASE_DIR / "edtech_recommendation_synthetic_90000.csv")

print("Dataset shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())


# ============================================================
# 2. REMOVE COLUMNS THAT SHOULD NOT BE USED
# ============================================================

# student_id is only an identifier.
# It should NOT be used as a learning feature.

X = df.drop(columns=[
    "student_id",
    "recommended_action"
])

y = df["recommended_action"]


# ============================================================
# 3. IDENTIFY FEATURE TYPES
# ============================================================

categorical_features = [
    "topic",
    "field_of_interest",
    "prior_experience",
    "preferred_content",
    "learning_style",
    "difficulty_preference"
]

numeric_features = [
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
    "knowledge_gap"
]


# ============================================================
# 4. PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median"))
])


categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),

    ("encoder", OneHotEncoder(
        handle_unknown="ignore",
        sparse_output=False
    ))
])


preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features)
])


# ============================================================
# 5. RANDOM FOREST
# ============================================================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=18,
    min_samples_split=8,
    min_samples_leaf=3,
    max_features="sqrt",
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)


# ============================================================
# 6. COMPLETE ML PIPELINE
# ============================================================

pipeline = Pipeline([
    ("preprocessing", preprocessor),
    ("model", model)
])


# ============================================================
# 7. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 8. TRAIN
# ============================================================

print("\nTraining Random Forest...")

pipeline.fit(X_train, y_train)

print("Training completed!")


# ============================================================
# 9. EVALUATE
# ============================================================

y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n===================================")
print("MODEL PERFORMANCE")
print("===================================")

print(f"\nAccuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ============================================================
# 10. SAVE MODEL
# ============================================================

joblib.dump(
    pipeline,
    BASE_DIR / "edtech_random_forest_model.pkl"
)

print("\nModel saved as:")
print("edtech_random_forest_model.pkl")
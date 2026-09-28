from unittest import result

from fastapi import FastAPI  # type: ignore[import-not-found]
from pydantic import BaseModel  # type: ignore
import pandas as pd  # type: ignore
import pickle
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Customer Churn Prediction API",
    description="API for predicting whether a customer will churn",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
    "https://customer-churn-nu.vercel.app", "https://customer-churn-git-main-rishi-851c.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -----------------------------
# Locate model folder
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"


# -----------------------------
# Load trained files
# -----------------------------

with open(MODEL_DIR / "xgboost_model.pkl", "rb") as f:
    model = pickle.load(f)

with open(MODEL_DIR / "scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open(MODEL_DIR / "feature_columns.pkl", "rb") as f:
    feature_columns = pickle.load(f)

# -----------------------------
# Input data format
# -----------------------------

class Customer(BaseModel):

    CreditScore: int
    Geography: str
    Gender: str
    Age: int
    Tenure: int
    Balance: float
    NumOfProducts: int
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float
    SatisfactionScore: int
    CardType: str
    PointEarned: int


# -----------------------------
# Test endpoint
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "Customer Churn Prediction API is running"
    }


# -----------------------------
# Prediction endpoint
# -----------------------------

@app.post("/predict")
def predict(customer: Customer):

    # Convert incoming data to dictionary
    data = customer.model_dump()

    # Convert API names to notebook column names
    data["Satisfaction Score"] = data.pop("SatisfactionScore")
    data["Card Type"] = data.pop("CardType")
    data["Point Earned"] = data.pop("PointEarned")

    # Create DataFrame
    df = pd.DataFrame([data])

    # One-hot encode categorical columns
    df = pd.get_dummies(
        df,
        columns=["Geography", "Card Type", "Gender"],
        dtype=int
    )

    # Make sure all training columns exist
    df = df.reindex(columns=feature_columns, fill_value=0)

    # Scale exactly the same columns as during training
    cols_to_scale = [
        "EstimatedSalary",
        "Point Earned",
        "CreditScore",
        "Age",
        "Tenure",
        "Balance",
        "NumOfProducts"
    ]

    df[cols_to_scale] = scaler.transform(df[cols_to_scale])

    # Make prediction
    prediction = model.predict(df)[0]

    # Probability of churn
    probability = model.predict_proba(df)[0][1]

    return {
        "prediction": int(prediction),
        "churn_probability": round(float(probability), 4),
        "result": (
            "Customer is likely to churn"
            if prediction == 1
            else "Customer is likely to stay loyal"
        )
    }
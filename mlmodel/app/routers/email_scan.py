# app/routers/email_scan.py
from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import os
import pandas as pd
from app.utils.preprocess import preprocess_text

router = APIRouter()

model = joblib.load("app/models/email_model.pkl")
vectorizer = joblib.load("app/models/email_vectorizer.pkl")

class EmailRequest(BaseModel):
    text_content: str
    sender_domain: str

class EmailPrediction(BaseModel):
    prediction: str
    confidence: float

@router.post("/", response_model=EmailPrediction)
def predict_email(data: EmailRequest):
    # Option 1: If your vectorizer was trained on two separate columns:
    cleaned = {
        "cleaned_text": preprocess_text(data.text_content),
        "cleaned_domain": data.sender_domain.lower().replace("www.", "")
    }
    X = vectorizer.transform(pd.DataFrame([cleaned]))

    # Option 2: If vectorizer expects just 1 text input (uncomment below if applicable)
    # combined_input = f"{data.text_content} {data.sender_domain.lower().replace('www.', '')}"
    # cleaned_text = preprocess_text(combined_input)
    # X = vectorizer.transform([cleaned_text])

    prob = model.predict_proba(X)[0]
    pred = model.predict(X)[0]

    return {
        "prediction": "Legit" if pred == 1 else "Fake",
        "confidence": round(max(prob), 3)
    }

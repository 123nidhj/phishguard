# app/routers/link_scan.py
from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import os
import re

router = APIRouter()

# Load models
model_path = os.path.join("app", "models", "link_model.pkl")
vectorizer_path = os.path.join("app", "models", "link_vectorizer.pkl")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

# Preprocess URL
def preprocess_url(url: str):
    url = url.lower()
    url = re.sub(r"https?://", "", url)
    url = re.sub(r"[^a-zA-Z0-9./]", "", url)
    return url

# Request model
class LinkRequest(BaseModel):
    url: str

class LinkResponse(BaseModel):
    prediction: str
    confidence: float

@router.post("/", response_model=LinkResponse)
def predict_link_legitimacy(data: LinkRequest):
    cleaned = preprocess_url(data.url)
    vec = vectorizer.transform([cleaned])
    prob = model.predict_proba(vec)[0]
    label = model.predict(vec)[0]

    return {
        "prediction": "Legit" if label == 1 else "Phishing",
        "confidence": round(max(prob), 3)
    }

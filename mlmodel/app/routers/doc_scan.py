# app/routers/doc_scan.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import joblib
import tempfile

from app.utils.doc_parser import extract_text_from_pdf, extract_text_from_docx
from app.utils.preprocess import preprocess_text

router = APIRouter()

model = joblib.load("app/models/doc_model.pkl")
vectorizer = joblib.load("app/models/doc_vectorizer.pkl")

@router.post("/")
async def predict_doc(file: UploadFile = File(...)):
    ext = file.filename.split('.')[-1].lower()
    if ext not in ["pdf", "docx"]:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported")

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        if ext == "pdf":
            extracted_text = extract_text_from_pdf(tmp_path)
        elif ext == "docx":
            extracted_text = extract_text_from_docx(tmp_path)

        cleaned = preprocess_text(extracted_text)
        vec = vectorizer.transform([cleaned])
        prob = model.predict_proba(vec)[0]
        label = model.predict(vec)[0]

        return JSONResponse({
            "prediction": "Legit" if label == 1 else "Fake",
            "confidence": round(max(prob), 3),
            "extracted_text": extracted_text.strip()  # <--- Include text here
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.remove(tmp_path)

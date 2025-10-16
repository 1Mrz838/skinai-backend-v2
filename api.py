# api.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import os
import gdown  # ✅ вместо requests, безопаснее и стабильнее для Google Drive

app = FastAPI()

# --- Разрешаем запросы с фронта ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://skinai-frontend.onrender.com",
        "https://skinai-backend-kc1a.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Путь и загрузка модели ---
MODEL_PATH = "skin_disease_model.h5"
DRIVE_ID = "1T6nB5lyG4oUrjNM7Nm6CHfRZzKknh3U7"
MODEL_URL = f"https://drive.google.com/uc?id={DRIVE_ID}"

if not os.path.exists(MODEL_PATH):
    print("🔽 Model not found locally. Downloading from Google Drive...")
    gdown.download(MODEL_URL, MODEL_PATH, quiet=False)
    print("✅ Model downloaded successfully!")

# --- Загружаем модель ---
model = load_model(MODEL_PATH)
print("✅ Model loaded. Output shape:", getattr(model, "output_shape", None))

# --- Метки классов ---
LABELS = [
    {"name": "Actinic Keratoses (akiec)", "description": "Precancerous lesion caused by sun damage.", "severity":"moderate", "treatment":"Topical therapy, cryotherapy, or removal."},
    {"name": "Basal Cell Carcinoma (bcc)", "description": "Most common skin cancer, pearly bumps or sores.", "severity":"serious", "treatment":"Surgery, radiation, topical therapy."},
    {"name": "Benign Keratosis-like lesions (bkl)", "description": "Non-cancerous lesion, often looks waxy or stuck-on.", "severity":"mild", "treatment":"No treatment needed unless cosmetic."},
    {"name": "Dermatofibroma (df)", "description": "Benign firm bump, reddish-brown.", "severity":"mild", "treatment":"Only removal if symptomatic."},
    {"name": "Melanoma (mel)", "description": "Dangerous skin cancer, irregular dark mole/spot.", "severity":"critical", "treatment":"Urgent surgery and oncology care."},
    {"name": "Melanocytic Nevi (nv)", "description": "Common mole, usually benign.", "severity":"mild", "treatment":"Observation; removal if atypical."},
    {"name": "Vascular Lesions (vasc)", "description": "Benign vascular growth, may look red or purple.", "severity":"mild", "treatment":"Laser or removal if cosmetic."}
]

# --- Предобработка изображения ---
def preprocess_image(image_bytes, target_size=(128, 128)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img).astype(np.float32) / 255.0
    arr = np.expand_dims(arr, 0)
    return arr

# --- Эндпоинт для предсказания ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    x = preprocess_image(contents)

    preds = model.predict(x)[0]
    if np.ndim(preds) == 0:
        preds = np.array([preds])

    top_idx = np.argsort(preds)[::-1][:3]
    alternatives = []
    for idx in top_idx:
        prob = float(preds[idx]) if idx < len(preds) else 0.0
        meta = LABELS[idx] if idx < len(LABELS) else {"name": f"class_{idx}", "description":"", "severity":"unknown", "treatment":""}
        alternatives.append({
            "index": int(idx),
            "name": meta["name"],
            "confidence": round(prob * 100, 2),
            "description": meta["description"],
            "severity": meta["severity"],
            "treatment": meta["treatment"]
        })

    primary = alternatives[0] if alternatives else {"name": "unknown", "confidence": 0}

    return {
        "prediction": primary["name"],
        "confidence": primary["confidence"],
        "description": primary.get("description", ""),
        "severity": primary.get("severity", "unknown"),
        "treatment": primary.get("treatment", ""),
        "alternatives": alternatives[1:]
    }

# --- Проверка сервера ---
@app.get("/")
def root():
    return {"message": "✅ Backend работает! Модель успешно загружена."}
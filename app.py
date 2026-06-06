import os
import tempfile
import shutil
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# ---------- Global Model Reference ----------
MODEL_PATH = os.path.join("artifacts", "training", "model.h5")
model = None


# ---------- Lifespan: load model once at startup ----------
@asynccontextmanager
async def lifespan(app):
    global model
    try:
        model = load_model(MODEL_PATH)
        print(f"[OK] Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"[WARNING] Could not load model: {e}")
        print("   Predictions will fail until the model is available.")
    yield
    # Cleanup (if needed) happens here
    print("[STOP] Shutting down...")


# ---------- App Setup ----------
app = FastAPI(
    title="Chicken Disease Classification API",
    description="Classify chicken fecal images as Healthy or Coccidiosis",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow React dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Prediction Logic ----------
CLASS_LABELS = {0: "Coccidiosis", 1: "Healthy"}


def run_prediction(img_path: str) -> dict:
    """Run prediction on a single image and return label + confidence."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please check server logs.")

    test_image = image.load_img(img_path, target_size=(224, 224))
    test_image = image.img_to_array(test_image)
    test_image = np.expand_dims(test_image, axis=0)

    predictions = model.predict(test_image)
    predicted_index = int(np.argmax(predictions, axis=1)[0])
    confidence = float(np.max(predictions)) * 100  # percentage

    return {
        "prediction": CLASS_LABELS[predicted_index],
        "confidence": round(confidence, 2),
        "class_index": predicted_index,
    }


# ---------- API Endpoints ----------
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
    }


@app.post("/api/predict")
def predict(file: UploadFile = File(...)):
    """Accept an image upload and return the disease classification."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: {', '.join(allowed_types)}",
        )

    # Save uploaded file to a temp location with a safe filename
    tmp_dir = tempfile.mkdtemp()
    ext = os.path.splitext(file.filename or "upload.png")[1] or ".png"
    safe_name = f"upload{ext}"
    tmp_path = os.path.join(tmp_dir, safe_name)

    try:
        # Read the upload synchronously (this handler runs in a threadpool)
        contents = file.file.read()
        with open(tmp_path, "wb") as buffer:
            buffer.write(contents)

        result = run_prediction(tmp_path)
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    finally:
        # Cleanup temp file
        shutil.rmtree(tmp_dir, ignore_errors=True)


# ---------- Serve React Build (Production) ----------
frontend_dist = os.path.join("frontend", "dist")
if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        """Serve the React SPA for any non-API route."""
        return FileResponse(os.path.join(frontend_dist, "index.html"))


# ---------- Run ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8080, reload=True)
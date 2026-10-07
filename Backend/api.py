"""LittleMind FastAPI backend – stress level analyzer.

Run:  uvicorn api:app --reload --port 8000
Docs: http://127.0.0.1:8000/docs
"""
import json
import os
import tempfile
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError

from stress_analyzer.config import REPORT_DIR
from stress_analyzer.predict import Analyzer

MAX_BYTES = 10 * 1024 * 1024
TYPES = {"image/jpeg": ".jpg", "image/png": ".png"}
state = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    state["analyzer"] = Analyzer()           # model + ResNet50 loaded once at start
    yield
    state.clear()


app = FastAPI(title="LittleMind Stress Analyzer API", version="2.0.0", lifespan=lifespan)
origins = [o.strip() for o in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST"], allow_headers=["*"])
REPORT_DIR.mkdir(exist_ok=True)
app.mount("/reports", StaticFiles(directory=REPORT_DIR), name="reports")   # training graphs


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": "analyzer" in state}


@app.get("/api/metrics")
def metrics():
    f = REPORT_DIR / "metrics.json"
    if not f.exists():
        raise HTTPException(404, "No metrics yet. Run: python -m stress_analyzer.train")
    return json.loads(f.read_text())


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...), age: int = Form(...)):
    if file.content_type not in TYPES:
        raise HTTPException(415, "Only JPEG and PNG images are supported.")
    raw = await file.read(MAX_BYTES + 1)
    if not raw or len(raw) > MAX_BYTES:
        raise HTTPException(413, "Image must be non-empty and at most 10 MB.")
    try:
        with Image.open(BytesIO(raw)) as im:
            im.verify()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(422, "Invalid or corrupted image.")

    path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=TYPES[file.content_type], delete=False) as tmp:
            tmp.write(raw)
            path = Path(tmp.name)
        return state["analyzer"].analyze(str(path), age=age)
    except HTTPException:
        raise
    except Exception:
        import logging
        logging.exception("Analysis failed")
        raise HTTPException(500, "Analysis failed. Check server logs.")
    finally:
        if path is not None:
            path.unlink(missing_ok=True)

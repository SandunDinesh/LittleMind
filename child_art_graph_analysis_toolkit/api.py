"""Research-only drawing analysis API. Images are processed in temporary storage."""
from __future__ import annotations
import os
import tempfile
from pathlib import Path
from contextlib import asynccontextmanager
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from src.art_feature_extractor import extract_art_features
from src.predict_art import choose_features

ROOT = Path(__file__).resolve().parent
MAX_BYTES = 10 * 1024 * 1024
# If the top two class probabilities are closer than this, the result is shown as
# 'Inconclusive' instead of forcing Low/Moderate/High (abstention).
INCONCLUSIVE_MARGIN = float(os.getenv('INCONCLUSIVE_MARGIN', '0.10'))
models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    models['classifier'] = joblib.load(ROOT / 'models/stress_level_classifier.joblib')
    models['regressor'] = joblib.load(ROOT / 'models/stress_score_regressor.joblib')
    yield
    models.clear()

app = FastAPI(title='Child Art Research Analysis API', version='1.0.0', lifespan=lifespan)
origins = [s.strip() for s in os.getenv('FRONTEND_ORIGINS', 'http://localhost:3000').split(',') if s.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=['GET', 'POST'], allow_headers=['*'])

@app.get('/health')
def health():
    return {'status': 'ok', 'models_loaded': len(models) == 2}

@app.post('/api/analyze')
async def analyze(file: UploadFile = File(...), age: int = Form(...)):
    if age < 3 or age > 6:
        raise HTTPException(422, 'Age must be between 3 and 6 years.')
    if file.content_type not in ('image/jpeg', 'image/png'):
        raise HTTPException(415, 'Only JPEG and PNG images are supported.')
    raw = await file.read(MAX_BYTES + 1)
    if not raw or len(raw) > MAX_BYTES:
        raise HTTPException(413, 'Image must be non-empty and at most 10 MB.')
    try:
        from io import BytesIO
        with Image.open(BytesIO(raw)) as image:
            image.verify()
        with Image.open(BytesIO(raw)) as image:
            if image.width * image.height > 25_000_000:
                raise HTTPException(413, 'Image dimensions exceed the supported limit.')
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(422, 'Invalid or corrupted image.')
    suffix = '.jpg' if file.content_type == 'image/jpeg' else '.png'
    path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(raw)
            path = Path(tmp.name)
        features = extract_art_features(str(path), age_group='3-6', drawing_prompt='Free drawing')
        frame = pd.DataFrame([features])
        clf = models['classifier']
        reg = models['regressor']
        level = str(clf.predict(choose_features(frame.copy(), clf))[0])
        probabilities = {str(label): float(prob) for label, prob in zip(clf.classes_, clf.predict_proba(choose_features(frame.copy(), clf))[0])}
        score = float(np.clip(reg.predict(choose_features(frame.copy(), reg))[0], 0, 100))
        dark = float(features.get('dark_color_ratio', 0))
        scribble = float(features.get('scribble_density', 0))
        review = level == 'High' or (level == 'Moderate' and probabilities.get('High', 0) >= .45) or dark > .55 or scribble > .18
        ranked = sorted(probabilities.items(), key=lambda kv: kv[1], reverse=True)
        top_margin = ranked[0][1] - ranked[1][1] if len(ranked) > 1 else 1.0
        screening_level = 'Inconclusive' if top_margin < INCONCLUSIVE_MARGIN else level
        numeric = {key: float(value) for key, value in features.items() if isinstance(value, (int, float, np.integer, np.floating)) and np.isfinite(value)}
        return {'predicted_stress_level': level, 'screening_level': screening_level, 'confidence': round(ranked[0][1], 4), 'top_margin': round(top_margin, 4), 'inconclusive_margin': INCONCLUSIVE_MARGIN, 'predicted_stress_score_0_100': round(score, 2), 'probabilities': probabilities, 'review_required': bool(review), 'features': numeric, 'age': age, 'disclaimer': 'Research screening indicators only; not a diagnosis. The models were evaluated on synthetic data. A qualified professional must assess any concerns.'}
    except HTTPException:
        raise
    except Exception as exc:
        import logging
        logging.exception('Analysis failed: %s', exc)
        raise HTTPException(500, 'Analysis failed. Check server logs.')
    finally:
        if path is not None:
            path.unlink(missing_ok=True)

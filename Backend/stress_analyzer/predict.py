"""Use the trained model on one drawing (used by the FastAPI app).

The backend only returns the model result. The professional-review recommendation and the
safety message for High results are shown by the frontend (lib/professionals.ts).
"""
import joblib
import numpy as np
import pandas as pd

from . import features
from .config import HIGH_FROM, MODEL_DIR, MODERATE_FROM
from .models import to_level


class Analyzer:
    def __init__(self, path=MODEL_DIR / "stress_model.joblib"):
        bundle = joblib.load(path)
        self.model = bundle["model"]
        self.cols = bundle["cv_cols"]
        self.cuts = bundle.get("cuts", (MODERATE_FROM, HIGH_FROM))
        self.metrics = bundle["metrics"]
        features.cnn()                       # load ResNet50 now, not on the first request

    def analyze(self, image_path, age=None) -> dict:
        raw = features.extract_art_features(image_path)
        cv = pd.DataFrame([{k: raw[k] if np.isfinite(raw[k]) else np.nan for k in self.cols}]).to_numpy()
        emb = features.cnn_many([image_path], quiet=True)
        p = float(self.model.p_high(cv, emb)[0])
        probs = {"Low": 1 - p, "High": p}
        level = str(to_level(p, *self.cuts))
        nums = {k: float(v) for k, v in raw.items()
                if isinstance(v, (int, float, np.integer, np.floating)) and np.isfinite(v)}
        return {
            "predicted_stress_level": level,
            "screening_level": level,
            "confidence": round(max(p, 1 - p), 4),
            "level_cuts": {"moderate_from": self.cuts[0], "high_from": self.cuts[1]},
            "predicted_stress_score_0_100": round(p * 100, 2),
            "probabilities": probs,
            "features": nums,
            "age": age,
        }

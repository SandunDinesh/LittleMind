"""
predict_art.py

Predict child art stress screening output from extracted feature CSV.

Usage:
    python src/predict_art.py extracted_features.csv --out predictions.csv

Output:
    predicted_stress_level
    predicted_stress_score_0_100
    prob_Low / prob_Moderate / prob_High
    review_required
    safety_message
"""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


NEVER_FEATURES = {
    "child_art_id",
    "image_id",
    "image_path",
    "label_source",
    "data_split",
    "stress_score_0_100",
    "stress_level",
    "predicted_stress_level",
    "predicted_stress_score_0_100",
    "review_required",
    "safety_message",
}


def choose_features(df: pd.DataFrame, model) -> pd.DataFrame:
    # For sklearn Pipeline fitted on pandas data, feature_names_in_ is usually on the first step/model.
    expected = None
    try:
        expected = list(model.feature_names_in_)
    except Exception:
        pass

    if expected:
        missing = [c for c in expected if c not in df.columns]
        for c in missing:
            # Safe defaults for missing metadata.
            df[c] = "unknown" if c in {"age_group", "drawing_prompt"} else 0.0
        return df[expected]

    cols = [c for c in df.columns if c not in NEVER_FEATURES]
    return df[cols]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("features_csv", help="CSV from art_feature_extractor.py or batch_extract.py")
    parser.add_argument("--classifier", default="models/stress_level_classifier.joblib")
    parser.add_argument("--regressor", default="models/stress_score_regressor.joblib")
    parser.add_argument("--out", default="predictions.csv")
    args = parser.parse_args()

    df = pd.read_csv(args.features_csv)

    try:
        classifier = joblib.load(args.classifier)
    except Exception as exc:
        raise SystemExit(
            "Could not load classifier model. This usually happens when the model was saved with a different scikit-learn version.\n"
            "Fix: run this command once, then run analyze again:\n"
            "    python src/train_model.py --data data/child_art_stress_synthetic_dataset.csv\n"
            f"Original error: {type(exc).__name__}: {exc}"
        )

    X = choose_features(df.copy(), classifier)
    pred_level = classifier.predict(X)

    result = df.copy()
    result["predicted_stress_level"] = pred_level

    if hasattr(classifier, "predict_proba"):
        proba = classifier.predict_proba(X)
        classes = list(classifier.classes_)
        for idx, cls in enumerate(classes):
            result[f"prob_{cls}"] = proba[:, idx]
        high_prob = proba[:, classes.index("High")] if "High" in classes else np.zeros(len(result))
    else:
        high_prob = np.zeros(len(result))

    reg_path = Path(args.regressor)
    if reg_path.exists():
        try:
            regressor = joblib.load(reg_path)
            X_reg = choose_features(df.copy(), regressor)
            score = regressor.predict(X_reg)
            result["predicted_stress_score_0_100"] = np.clip(score, 0, 100).round(2)
        except Exception as exc:
            # Do not stop the full analysis if only the optional score regressor is incompatible.
            # The classifier output still works. Retrain models to restore the numeric score.
            result["predicted_stress_score_0_100"] = "RETRAIN_MODEL_REQUIRED"
            result["regressor_warning"] = (
                "Stress score regressor could not load. Run: "
                "python src/train_model.py --data data/child_art_stress_synthetic_dataset.csv. "
                f"Original error: {type(exc).__name__}: {exc}"
            )
    else:
        result["predicted_stress_score_0_100"] = ""

    # Conservative review logic.
    result["review_required"] = (
        (result["predicted_stress_level"] == "High")
        | ((result["predicted_stress_level"] == "Moderate") & (high_prob >= 0.45))
        | (result.get("dark_color_ratio", 0) > 0.55)
        | (result.get("scribble_density", 0) > 0.18)
    )

    result["safety_message"] = (
        "Screening support only. Do not diagnose abuse/rape/trauma from art. "
        "If review_required=True, a trained counselor/safeguarding officer should review."
    )

    result.to_csv(args.out, index=False)
    print("Saved:", args.out)
    show_cols = [c for c in ["image_id", "predicted_stress_level", "predicted_stress_score_0_100", "review_required"] if c in result.columns]
    print(result[show_cols].head(10).to_string(index=False))


if __name__ == "__main__":
    main()

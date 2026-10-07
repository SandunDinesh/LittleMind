"""
train_model.py

Train:
    1) stress level classifier: Low / Moderate / High
    2) stress score regressor: 0-100

Usage:
    python src/train_model.py --data data/child_art_stress_synthetic_dataset.csv

Important:
    This is not a clinical model. Use real labels only from trained professionals
    or validated child stress questionnaires.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    mean_absolute_error,
    r2_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


CLASS_TARGET = "stress_level"
REG_TARGET = "stress_score_0_100"

NEVER_FEATURES = {
    "child_art_id",
    "image_id",
    "image_path",
    "label_source",
    "data_split",
    "stress_score_0_100",
    "stress_level",
}


def split_data(df: pd.DataFrame):
    if "data_split" in df.columns:
        train_df = df[df["data_split"] == "train"].copy()
        valid_df = df[df["data_split"].isin(["validation", "test"])].copy()
        if len(train_df) > 0 and len(valid_df) > 0:
            return train_df, valid_df

    # Fallback split if no data_split column.
    shuffled = df.sample(frac=1.0, random_state=42)
    cut = int(len(shuffled) * 0.75)
    return shuffled.iloc[:cut].copy(), shuffled.iloc[cut:].copy()


def build_preprocessor(df: pd.DataFrame, feature_cols):
    numeric_cols = [c for c in feature_cols if pd.api.types.is_numeric_dtype(df[c])]
    categorical_cols = [c for c in feature_cols if c not in numeric_cols]

    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
        ]
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/child_art_stress_synthetic_dataset.csv")
    parser.add_argument("--model-dir", default="models")
    args = parser.parse_args()

    data_path = Path(args.data)
    model_dir = Path(args.model_dir)
    model_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(data_path)
    train_df, valid_df = split_data(df)

    feature_cols = [c for c in df.columns if c not in NEVER_FEATURES]

    # Classifier
    clf_preprocess = build_preprocessor(df, feature_cols)
    clf = RandomForestClassifier(
        n_estimators=450,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
    )
    clf_pipe = Pipeline([("preprocess", clf_preprocess), ("model", clf)])
    clf_pipe.fit(train_df[feature_cols], train_df[CLASS_TARGET])

    y_pred = clf_pipe.predict(valid_df[feature_cols])
    labels = ["Low", "Moderate", "High"]

    clf_metrics = {
        "warning": "Screening/research model only. Not a diagnosis.",
        "target": CLASS_TARGET,
        "features_used": feature_cols,
        "accuracy": float(accuracy_score(valid_df[CLASS_TARGET], y_pred)),
        "macro_f1": float(f1_score(valid_df[CLASS_TARGET], y_pred, average="macro")),
        "classification_report": classification_report(
            valid_df[CLASS_TARGET], y_pred, labels=labels, output_dict=True, zero_division=0
        ),
        "confusion_matrix_labels": labels,
        "confusion_matrix": confusion_matrix(valid_df[CLASS_TARGET], y_pred, labels=labels).tolist(),
    }

    joblib.dump(clf_pipe, model_dir / "stress_level_classifier.joblib")
    (model_dir / "classifier_metrics.json").write_text(json.dumps(clf_metrics, indent=2), encoding="utf-8")

    # Regressor
    reg_preprocess = build_preprocessor(df, feature_cols)
    reg = GradientBoostingRegressor(random_state=42)
    reg_pipe = Pipeline([("preprocess", reg_preprocess), ("model", reg)])
    reg_pipe.fit(train_df[feature_cols], train_df[REG_TARGET])

    score_pred = reg_pipe.predict(valid_df[feature_cols])

    reg_metrics = {
        "warning": "Synthetic/research score only. Not a diagnosis.",
        "target": REG_TARGET,
        "features_used": feature_cols,
        "mae": float(mean_absolute_error(valid_df[REG_TARGET], score_pred)),
        "r2": float(r2_score(valid_df[REG_TARGET], score_pred)),
    }

    joblib.dump(reg_pipe, model_dir / "stress_score_regressor.joblib")
    (model_dir / "regressor_metrics.json").write_text(json.dumps(reg_metrics, indent=2), encoding="utf-8")

    print("Saved classifier:", model_dir / "stress_level_classifier.joblib")
    print("Saved regressor:", model_dir / "stress_score_regressor.joblib")
    print("Classifier accuracy:", round(clf_metrics["accuracy"], 4))
    print("Classifier macro F1:", round(clf_metrics["macro_f1"], 4))
    print("Regressor MAE:", round(reg_metrics["mae"], 4))


if __name__ == "__main__":
    main()

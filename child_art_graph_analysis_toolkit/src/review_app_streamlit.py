"""
review_app_streamlit.py

Simple review tool for teacher/counselor workflow.

Run:
    streamlit run src/review_app_streamlit.py

Use:
    1. Upload a drawing image.
    2. Extract OpenCV parameters.
    3. Run ML prediction.
    4. Add human review notes.
    5. Download result CSV.

This tool is NOT for diagnosis.
"""

from __future__ import annotations

from pathlib import Path
import tempfile

import joblib
import pandas as pd
import streamlit as st

from art_feature_extractor import extract_art_features, FEATURE_COLUMNS


NEVER_FEATURES = {
    "child_art_id", "image_id", "image_path", "label_source", "data_split",
    "stress_score_0_100", "stress_level",
    "predicted_stress_level", "predicted_stress_score_0_100", "review_required",
    "safety_message",
}


def choose_features(df: pd.DataFrame, model) -> pd.DataFrame:
    expected = None
    try:
        expected = list(model.feature_names_in_)
    except Exception:
        pass

    if expected:
        for col in expected:
            if col not in df.columns:
                df[col] = "unknown" if col in {"age_group", "drawing_prompt"} else 0.0
        return df[expected]

    cols = [c for c in df.columns if c not in NEVER_FEATURES]
    return df[cols]


st.set_page_config(page_title="Child Art Stress Screening Tool", layout="wide")
st.title("Child Art Stress Screening Tool")
st.warning(
    "Research/screening support only. This tool must not diagnose abuse, rape, trauma, or mental illness. "
    "Use counselor/safeguarding review for concerns."
)

uploaded = st.file_uploader("Upload drawing image", type=["jpg", "jpeg", "png", "bmp", "webp"])
age_group = st.selectbox("Age group", ["unknown", "5-7", "8-10", "11-13", "14-16"])
drawing_prompt = st.text_input("Drawing prompt", "Free drawing")

if uploaded is not None:
    suffix = Path(uploaded.name).suffix or ".png"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(uploaded.getvalue())
        image_path = Path(tmp.name)

    st.image(str(image_path), caption=uploaded.name, width=450)

    features = extract_art_features(image_path, age_group=age_group, drawing_prompt=drawing_prompt)
    features_df = pd.DataFrame([features])[["image_path", "image_id"] + FEATURE_COLUMNS]

    st.subheader("Extracted OpenCV Parameters")
    st.dataframe(features_df.T.rename(columns={0: "value"}), use_container_width=True)

    classifier_path = Path("models/stress_level_classifier.joblib")
    regressor_path = Path("models/stress_score_regressor.joblib")

    if classifier_path.exists():
        classifier = joblib.load(classifier_path)
        X = choose_features(features_df.copy(), classifier)
        level = classifier.predict(X)[0]
        proba = classifier.predict_proba(X)[0] if hasattr(classifier, "predict_proba") else None

        result = features_df.copy()
        result["predicted_stress_level"] = level

        high_prob = 0.0
        if proba is not None:
            classes = list(classifier.classes_)
            for idx, cls in enumerate(classes):
                result[f"prob_{cls}"] = float(proba[idx])
            if "High" in classes:
                high_prob = float(proba[classes.index("High")])

        if regressor_path.exists():
            regressor = joblib.load(regressor_path)
            score = float(regressor.predict(choose_features(features_df.copy(), regressor))[0])
            result["predicted_stress_score_0_100"] = round(max(0, min(100, score)), 2)

        result["review_required"] = (
            level == "High"
            or (level == "Moderate" and high_prob >= 0.45)
            or float(result["dark_color_ratio"].iloc[0]) > 0.55
            or float(result["scribble_density"].iloc[0]) > 0.18
        )

        st.subheader("ML Screening Result")
        col1, col2, col3 = st.columns(3)
        col1.metric("Predicted stress level", level)
        col2.metric("High probability", round(high_prob, 3))
        col3.metric("Review required", str(bool(result["review_required"].iloc[0])))

        if bool(result["review_required"].iloc[0]):
            st.error("Human review required. Do not make a diagnosis from model output.")

        st.subheader("Human Review")
        reviewer = st.text_input("Reviewer name / role")
        notes = st.text_area("Counselor/teacher review notes")
        final_label = st.selectbox("Final human label", ["", "Low", "Moderate", "High", "Needs safeguarding review"])

        result["human_reviewer"] = reviewer
        result["human_review_notes"] = notes
        result["final_human_label"] = final_label
        result["safety_message"] = "Screening support only. Human review required for serious concerns."

        st.download_button(
            "Download review CSV",
            result.to_csv(index=False).encode("utf-8"),
            file_name="child_art_review_result.csv",
            mime="text/csv",
        )
    else:
        st.info("Model file not found. Train model first: python src/train_model.py")

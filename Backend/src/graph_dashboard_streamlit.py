"""
graph_dashboard_streamlit.py

Interactive graph dashboard:
    Image upload -> OpenCV features -> ML prediction -> graphs

Run:
    streamlit run src/graph_dashboard_streamlit.py
"""

from __future__ import annotations

from pathlib import Path
import tempfile

import joblib
import pandas as pd
import streamlit as st

from art_feature_extractor import extract_art_features, FEATURE_COLUMNS


COLOR_FEATURES = [
    "warm_color_ratio", "cool_color_ratio", "dark_color_ratio", "bright_color_ratio",
    "red_ratio", "blue_ratio", "green_ratio", "yellow_ratio", "black_gray_ratio",
]

LINE_FEATURES = [
    "edge_density", "line_count", "avg_line_length_px", "line_length_std_px",
    "stroke_thickness_avg_px", "stroke_thickness_std_px", "broken_line_ratio",
    "horizontal_line_ratio", "vertical_line_ratio", "diagonal_line_ratio",
    "curved_line_ratio", "orientation_entropy",
]

COMPOSITION_FEATURES = [
    "drawing_area_ratio", "whitespace_ratio", "center_occupancy_ratio",
    "left_right_symmetry_score", "top_bottom_balance_score", "closed_contour_ratio",
    "shape_count", "object_count",
]

TEXTURE_FEATURES = [
    "texture_entropy", "contrast_score", "scribble_density", "erasure_marks_ratio",
    "pressure_proxy_darkness", "scan_quality_score",
]

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

    return df[[c for c in df.columns if c not in NEVER_FEATURES]]


def feature_chart(title: str, row: pd.Series, cols: list[str]) -> None:
    values = {}
    for c in cols:
        if c in row.index:
            try:
                values[c.replace("_", " ").title()] = float(row[c])
            except Exception:
                pass
    if values:
        st.subheader(title)
        st.bar_chart(pd.DataFrame({"value": values}))


st.set_page_config(page_title="Child Art Graph Dashboard", layout="wide")
st.title("Child Art Graph Dashboard")
st.warning(
    "Screening/research support only. Do not diagnose abuse, rape, trauma, or mental illness from drawings."
)

uploaded = st.file_uploader("Upload child drawing image", type=["jpg", "jpeg", "png", "bmp", "webp"])
age_group = st.selectbox("Age group", ["unknown", "5-7", "8-10", "11-13", "14-16"])
drawing_prompt = st.text_input("Drawing prompt", "Free drawing")

if uploaded:
    suffix = Path(uploaded.name).suffix or ".png"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(uploaded.getvalue())
        image_path = Path(tmp.name)

    features = extract_art_features(image_path, age_group=age_group, drawing_prompt=drawing_prompt)
    features_df = pd.DataFrame([features])[["image_path", "image_id"] + FEATURE_COLUMNS]
    result = features_df.copy()

    classifier_path = Path("models/stress_level_classifier.joblib")
    regressor_path = Path("models/stress_score_regressor.joblib")

    if classifier_path.exists():
        classifier = joblib.load(classifier_path)
        X = choose_features(features_df.copy(), classifier)
        level = classifier.predict(X)[0]
        result["predicted_stress_level"] = level

        high_prob = 0.0
        if hasattr(classifier, "predict_proba"):
            proba = classifier.predict_proba(X)[0]
            for i, cls in enumerate(classifier.classes_):
                result[f"prob_{cls}"] = float(proba[i])
            if "High" in classifier.classes_:
                high_prob = float(proba[list(classifier.classes_).index("High")])

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

    col_img, col_summary = st.columns([1, 1])
    with col_img:
        st.image(str(image_path), caption=uploaded.name, use_container_width=True)

    with col_summary:
        st.subheader("ML Result")
        st.metric("Predicted stress level", result.get("predicted_stress_level", pd.Series(["Not predicted"])).iloc[0])
        st.metric("Stress score 0-100", result.get("predicted_stress_score_0_100", pd.Series(["Not available"])).iloc[0])
        st.metric("Review required", str(bool(result.get("review_required", pd.Series([False])).iloc[0])))

        prob_cols = [c for c in ["prob_Low", "prob_Moderate", "prob_High"] if c in result.columns]
        if prob_cols:
            st.subheader("Stress Probability")
            prob_df = pd.DataFrame(
                {"probability": {c.replace("prob_", ""): float(result[c].iloc[0]) for c in prob_cols}}
            )
            st.bar_chart(prob_df)

    row = result.iloc[0]
    tab1, tab2, tab3, tab4, tab5 = st.tabs(["Color", "Lines", "Composition", "Texture", "All Values"])

    with tab1:
        feature_chart("Detected Color Ratios", row, COLOR_FEATURES)
    with tab2:
        feature_chart("Detected Line and Stroke Values", row, LINE_FEATURES)
    with tab3:
        feature_chart("Detected Composition and Shape Values", row, COMPOSITION_FEATURES)
    with tab4:
        feature_chart("Detected Texture / Quality Values", row, TEXTURE_FEATURES)
    with tab5:
        st.dataframe(result.T.rename(columns={0: "value"}), use_container_width=True)

    st.download_button(
        "Download detected values CSV",
        result.to_csv(index=False).encode("utf-8"),
        file_name="detected_art_values_with_prediction.csv",
        mime="text/csv",
    )

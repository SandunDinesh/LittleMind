"""
visualize_art_features.py

Create graph reports from extracted child art image features and ML predictions.

Usage:
    python src/visualize_art_features.py predictions.csv --out-dir reports

Outputs:
    reports/color_ratios.png
    reports/line_features.png
    reports/composition_features.png
    reports/texture_features.png
    reports/stress_probabilities.png  # if prob columns exist
    reports/feature_radar.png
    reports/art_analysis_report.html

Safety:
    Screening/research support only. Not a diagnosis.
"""

from __future__ import annotations

import argparse
import html
from pathlib import Path
from typing import List

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


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

PROB_FEATURES = ["prob_Low", "prob_Moderate", "prob_High"]


def clean_title(name: str) -> str:
    return name.replace("_", " ").replace(" px", " (px)").replace("px", "(px)").title()


def get_first_row(csv_path: Path) -> pd.Series:
    df = pd.read_csv(csv_path)
    if df.empty:
        raise ValueError(f"No rows in CSV: {csv_path}")
    return df.iloc[0]


def as_float(value) -> float | None:
    try:
        if pd.isna(value):
            return None
        return float(value)
    except Exception:
        return None


def plot_bar(row: pd.Series, features: List[str], title: str, out_path: Path) -> None:
    labels, values = [], []
    for f in features:
        if f not in row.index:
            continue
        v = as_float(row[f])
        if v is None:
            continue
        labels.append(clean_title(f))
        values.append(v)

    if not values:
        return

    fig_height = max(4.5, len(values) * 0.42)
    plt.figure(figsize=(10, fig_height))
    plt.barh(labels, values)
    plt.xlabel("Detected value")
    plt.title(title)
    plt.tight_layout()
    plt.savefig(out_path, dpi=160)
    plt.close()


def plot_stress_probs(row: pd.Series, out_path: Path) -> None:
    labels, values = [], []
    for f in PROB_FEATURES:
        if f in row.index:
            v = as_float(row[f])
            if v is not None:
                labels.append(f.replace("prob_", ""))
                values.append(v)

    if not values:
        return

    plt.figure(figsize=(8, 4.5))
    plt.bar(labels, values)
    plt.ylim(0, 1)
    plt.ylabel("Probability")
    plt.title("ML Stress Level Probability")
    plt.tight_layout()
    plt.savefig(out_path, dpi=160)
    plt.close()


def plot_radar(row: pd.Series, out_path: Path) -> None:
    radar_features = [
        "dark_color_ratio", "edge_density", "broken_line_ratio", "scribble_density",
        "pressure_proxy_darkness", "whitespace_ratio", "center_occupancy_ratio", "contrast_score",
    ]
    labels, values = [], []
    for f in radar_features:
        if f in row.index:
            v = as_float(row[f])
            if v is not None:
                labels.append(clean_title(f))
                values.append(float(np.clip(v, 0, 1)))

    if len(values) < 3:
        return

    angles = np.linspace(0, 2 * np.pi, len(values), endpoint=False).tolist()
    values = values + values[:1]
    angles = angles + angles[:1]

    fig = plt.figure(figsize=(7, 7))
    ax = plt.subplot(111, polar=True)
    ax.plot(angles, values)
    ax.fill(angles, values, alpha=0.15)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, fontsize=8)
    ax.set_ylim(0, 1)
    ax.set_title("Normalized Feature Radar")
    plt.tight_layout()
    plt.savefig(out_path, dpi=160)
    plt.close()


def value_table(row: pd.Series, max_rows: int = 80) -> str:
    skip = {"image_path", "safety_message"}
    rows = []
    for key, val in row.items():
        if key in skip:
            continue
        if isinstance(val, str):
            display = val[:90] + "..." if len(val) > 90 else val
        else:
            fv = as_float(val)
            display = round(fv, 5) if fv is not None else str(val)
        rows.append(
            f"<tr><td>{html.escape(clean_title(str(key)))}</td><td>{html.escape(str(display))}</td></tr>"
        )
        if len(rows) >= max_rows:
            break
    return "<table><tr><th>Parameter</th><th>Value</th></tr>" + "\n".join(rows) + "</table>"


def create_html_report(row: pd.Series, out_dir: Path, graph_files: List[str]) -> Path:
    image_id = str(row.get("image_id", "Unknown image"))
    predicted = str(row.get("predicted_stress_level", "Not predicted"))
    review = str(row.get("review_required", "Not available"))
    score = str(row.get("predicted_stress_score_0_100", "Not available"))

    graph_cards = "\n".join(
        f'<div class="card"><h3>{html.escape(Path(g).stem.replace("_", " ").title())}</h3><img src="{html.escape(g)}"></div>'
        for g in graph_files
    )

    html_text = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Child Art Analysis Graph Report</title>
<style>
body {{ font-family: Arial, sans-serif; margin: 32px; background: #fafafa; }}
h1, h2, h3 {{ color: #222; }}
.warning {{ padding: 12px; border: 1px solid #999; background: #fff; margin-bottom: 18px; }}
.metrics {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }}
.metric {{ background: #fff; border: 1px solid #ddd; padding: 14px; border-radius: 8px; }}
.card {{ background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 14px; margin: 16px 0; }}
img {{ max-width: 100%; height: auto; }}
table {{ border-collapse: collapse; width: 100%; background: #fff; }}
td, th {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
th {{ background: #f2f2f2; }}
</style>
</head>
<body>
<h1>Child Art Analysis Graph Report</h1>
<div class="warning">
<b>Safety note:</b> Screening/research support only. Do not diagnose abuse, rape, trauma, or mental illness from art. If <code>review_required=True</code>, send for trained counselor/safeguarding review.
</div>
<h2>Summary</h2>
<div class="metrics">
<div class="metric"><b>Image</b><br>{html.escape(image_id)}</div>
<div class="metric"><b>Predicted stress level</b><br>{html.escape(predicted)}</div>
<div class="metric"><b>Stress score</b><br>{html.escape(score)}</div>
<div class="metric"><b>Review required</b><br>{html.escape(review)}</div>
</div>
<h2>Graphs</h2>
{graph_cards}
<h2>Detected Parameter Values</h2>
{value_table(row)}
</body>
</html>"""
    out_path = out_dir / "art_analysis_report.html"
    out_path.write_text(html_text, encoding="utf-8")
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv", help="Feature or prediction CSV")
    parser.add_argument("--out-dir", default="reports", help="Output folder")
    args = parser.parse_args()

    csv_path = Path(args.csv)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    row = get_first_row(csv_path)
    graph_files = []

    specs = [
        (COLOR_FEATURES, "Detected Color Ratios", "color_ratios.png"),
        (LINE_FEATURES, "Detected Line and Stroke Features", "line_features.png"),
        (COMPOSITION_FEATURES, "Detected Composition and Shape Features", "composition_features.png"),
        (TEXTURE_FEATURES, "Detected Texture and Quality Features", "texture_features.png"),
    ]

    for features, title, filename in specs:
        out_path = out_dir / filename
        plot_bar(row, features, title, out_path)
        if out_path.exists():
            graph_files.append(filename)

    stress_path = out_dir / "stress_probabilities.png"
    plot_stress_probs(row, stress_path)
    if stress_path.exists():
        graph_files.append(stress_path.name)

    radar_path = out_dir / "feature_radar.png"
    plot_radar(row, radar_path)
    if radar_path.exists():
        graph_files.append(radar_path.name)

    report_path = create_html_report(row, out_dir, graph_files)

    print("Created graph files:")
    for filename in graph_files:
        print(" -", out_dir / filename)
    print("Created HTML report:", report_path)


if __name__ == "__main__":
    main()

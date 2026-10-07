"""
analyze_art.py

One command:
    image -> OpenCV features -> ML prediction

Usage:
    python src/analyze_art.py sample_images/sample_child_art_01.png --age-group 8-10
"""

from __future__ import annotations

import argparse
from pathlib import Path
import subprocess
import sys

import pandas as pd

from art_feature_extractor import extract_art_features, FEATURE_COLUMNS


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image")
    parser.add_argument("--age-group", default="unknown")
    parser.add_argument("--drawing-prompt", default="Free drawing")
    parser.add_argument("--out", default="one_image_prediction.csv")
    args = parser.parse_args()

    feature_csv = Path("_temp_one_image_features.csv")
    features = extract_art_features(args.image, age_group=args.age_group, drawing_prompt=args.drawing_prompt)
    cols = ["image_path", "image_id"] + FEATURE_COLUMNS
    pd.DataFrame([features])[cols].to_csv(feature_csv, index=False)

    cmd = [
        sys.executable,
        str(Path(__file__).parent / "predict_art.py"),
        str(feature_csv),
        "--out",
        args.out,
    ]
    subprocess.run(cmd, check=True)
    feature_csv.unlink(missing_ok=True)


if __name__ == "__main__":
    main()

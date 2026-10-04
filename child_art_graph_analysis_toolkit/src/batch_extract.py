"""
batch_extract.py

Extract OpenCV features from a folder of child art images.

Usage:
    python src/batch_extract.py sample_images --out batch_features.csv --age-group 8-10
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import List

import pandas as pd

from art_feature_extractor import extract_art_features, FEATURE_COLUMNS


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image_folder", help="Folder containing drawing images")
    parser.add_argument("--out", default="batch_features.csv")
    parser.add_argument("--age-group", default="unknown")
    parser.add_argument("--drawing-prompt", default="Free drawing")
    args = parser.parse_args()

    folder = Path(args.image_folder)
    if not folder.exists():
        raise SystemExit(f"Folder not found: {folder}")

    rows = []
    for path in sorted(folder.rglob("*")):
        if path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        try:
            rows.append(
                extract_art_features(
                    path,
                    age_group=args.age_group,
                    drawing_prompt=args.drawing_prompt,
                )
            )
            print("OK:", path)
        except Exception as exc:
            print("SKIP:", path, exc)

    if not rows:
        raise SystemExit("No image features extracted.")

    cols = ["image_path", "image_id"] + FEATURE_COLUMNS
    pd.DataFrame(rows)[cols].to_csv(args.out, index=False)
    print("Saved:", args.out)


if __name__ == "__main__":
    main()

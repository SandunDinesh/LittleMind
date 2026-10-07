"""
art_feature_extractor.py

Extract OpenCV features from child art/drawing images.

Safe purpose:
    Screening/research feature extraction only.
    Do not use this tool to diagnose trauma, abuse, rape, or mental illness.

Main outputs:
    - color features
    - line/stroke features
    - shape/composition features
    - texture features

Usage:
    python src/art_feature_extractor.py path/to/drawing.jpg --out extracted_features.csv
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Dict, Any, List, Tuple

import cv2
import numpy as np
import pandas as pd


FEATURE_COLUMNS = [
    "age_group",
    "drawing_prompt",
    "scan_quality_score",
    "mean_hue_deg",
    "mean_saturation",
    "mean_value_brightness",
    "warm_color_ratio",
    "cool_color_ratio",
    "dark_color_ratio",
    "bright_color_ratio",
    "red_ratio",
    "blue_ratio",
    "green_ratio",
    "yellow_ratio",
    "black_gray_ratio",
    "dominant_color_count",
    "color_variety_score",
    "edge_density",
    "line_count",
    "avg_line_length_px",
    "line_length_std_px",
    "stroke_thickness_avg_px",
    "stroke_thickness_std_px",
    "broken_line_ratio",
    "horizontal_line_ratio",
    "vertical_line_ratio",
    "diagonal_line_ratio",
    "curved_line_ratio",
    "orientation_entropy",
    "closed_contour_ratio",
    "shape_count",
    "object_count",
    "drawing_area_ratio",
    "whitespace_ratio",
    "center_occupancy_ratio",
    "left_right_symmetry_score",
    "top_bottom_balance_score",
    "texture_entropy",
    "contrast_score",
    "scribble_density",
    "erasure_marks_ratio",
    "pressure_proxy_darkness",
]


def safe_ratio(a: float, b: float) -> float:
    return float(a) / float(b) if b else 0.0


def load_image(image_path: Path, size: int = 512) -> np.ndarray:
    img = cv2.imread(str(image_path))
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")
    return cv2.resize(img, (size, size), interpolation=cv2.INTER_AREA)


def color_features(img_bgr: np.ndarray) -> Dict[str, Any]:
    h, w = img_bgr.shape[:2]
    total = h * w

    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    hue_deg = hsv[:, :, 0] * 2.0
    sat = hsv[:, :, 1] / 255.0
    val = hsv[:, :, 2] / 255.0

    colored_pixels = (sat > 0.18) & (val > 0.18)

    warm = ((hue_deg <= 75) | (hue_deg >= 320)) & colored_pixels
    cool = (hue_deg >= 160) & (hue_deg <= 280) & colored_pixels
    dark = val < 0.30
    bright = val > 0.75

    red = ((hue_deg < 25) | (hue_deg > 335)) & (sat > 0.25) & (val > 0.20)
    blue = (hue_deg >= 180) & (hue_deg <= 260) & (sat > 0.25) & (val > 0.20)
    green = (hue_deg >= 80) & (hue_deg <= 160) & (sat > 0.25) & (val > 0.20)
    yellow = (hue_deg >= 40) & (hue_deg <= 75) & (sat > 0.25) & (val > 0.20)
    black_gray = (sat < 0.18) & (val < 0.55)

    # Dominant color count using HSV bins that cover at least 1% of image.
    hue_bins = np.floor(hue_deg[colored_pixels] / 30).astype(int)
    dominant_color_count = 0
    if hue_bins.size:
        counts = np.bincount(np.clip(hue_bins, 0, 11), minlength=12)
        dominant_color_count = int(np.sum(counts > (0.01 * total)))

    return {
        "mean_hue_deg": float(np.mean(hue_deg[colored_pixels])) if np.any(colored_pixels) else 0.0,
        "mean_saturation": float(np.mean(sat)),
        "mean_value_brightness": float(np.mean(val)),
        "warm_color_ratio": safe_ratio(np.count_nonzero(warm), total),
        "cool_color_ratio": safe_ratio(np.count_nonzero(cool), total),
        "dark_color_ratio": safe_ratio(np.count_nonzero(dark), total),
        "bright_color_ratio": safe_ratio(np.count_nonzero(bright), total),
        "red_ratio": safe_ratio(np.count_nonzero(red), total),
        "blue_ratio": safe_ratio(np.count_nonzero(blue), total),
        "green_ratio": safe_ratio(np.count_nonzero(green), total),
        "yellow_ratio": safe_ratio(np.count_nonzero(yellow), total),
        "black_gray_ratio": safe_ratio(np.count_nonzero(black_gray), total),
        "dominant_color_count": dominant_color_count,
        "color_variety_score": float(np.std(hue_deg[colored_pixels]) / 180.0) if np.any(colored_pixels) else 0.0,
        "pressure_proxy_darkness": float(1.0 - np.mean(val)),
    }


def line_and_stroke_features(gray: np.ndarray, binary_inv: np.ndarray) -> Dict[str, Any]:
    h, w = gray.shape
    total = h * w

    edges = cv2.Canny(gray, 80, 160)
    edge_density = safe_ratio(np.count_nonzero(edges), total)

    lines = cv2.HoughLinesP(
        edges,
        rho=1,
        theta=np.pi / 180,
        threshold=45,
        minLineLength=18,
        maxLineGap=8,
    )

    lengths: List[float] = []
    angles: List[float] = []
    horizontal = vertical = diagonal = 0

    if lines is not None:
        for line in lines:
            # OpenCV can return HoughLinesP results as shape (N, 1, 4)
            # or shape (N, 4), depending on version/build.
            # Flatten makes it stable for both cases.
            coords = np.asarray(line).reshape(-1)
            if coords.size < 4:
                continue

            x1, y1, x2, y2 = coords[:4].astype(float)

            length = float(np.hypot(x2 - x1, y2 - y1))
            angle = float(abs(np.degrees(np.arctan2(y2 - y1, x2 - x1))))
            lengths.append(length)
            angles.append(angle)

            if angle < 20 or angle > 160:
                horizontal += 1
            elif 70 < angle < 110:
                vertical += 1
            else:
                diagonal += 1

    line_count = len(lengths)
    avg_len = float(np.mean(lengths)) if lengths else 0.0
    std_len = float(np.std(lengths)) if lengths else 0.0

    # Broken-line proxy: many short line segments compared to all detected lines.
    broken_line_ratio = safe_ratio(sum(1 for x in lengths if x < 35), line_count)

    # Orientation entropy from line angle bins.
    orientation_entropy = 0.0
    if angles:
        hist, _ = np.histogram(angles, bins=9, range=(0, 180))
        prob = hist / max(hist.sum(), 1)
        orientation_entropy = float(-np.sum(prob[prob > 0] * np.log2(prob[prob > 0])) / np.log2(9))

    # Stroke thickness proxy with distance transform.
    dist = cv2.distanceTransform(binary_inv, cv2.DIST_L2, 5)
    stroke_values = dist[dist > 0]
    stroke_avg = float(np.mean(stroke_values) * 2.0) if stroke_values.size else 0.0
    stroke_std = float(np.std(stroke_values) * 2.0) if stroke_values.size else 0.0

    return {
        "edge_density": float(edge_density),
        "line_count": int(line_count),
        "avg_line_length_px": avg_len,
        "line_length_std_px": std_len,
        "stroke_thickness_avg_px": stroke_avg,
        "stroke_thickness_std_px": stroke_std,
        "broken_line_ratio": broken_line_ratio,
        "horizontal_line_ratio": safe_ratio(horizontal, line_count),
        "vertical_line_ratio": safe_ratio(vertical, line_count),
        "diagonal_line_ratio": safe_ratio(diagonal, line_count),
        "orientation_entropy": orientation_entropy,
    }


def shape_composition_texture_features(gray: np.ndarray, binary_inv: np.ndarray) -> Dict[str, Any]:
    h, w = gray.shape
    total = h * w

    drawing_pixels = np.count_nonzero(binary_inv)
    drawing_area_ratio = safe_ratio(drawing_pixels, total)
    whitespace_ratio = 1.0 - drawing_area_ratio

    contours, _ = cv2.findContours(binary_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = [c for c in contours if cv2.contourArea(c) > 25]

    shape_count = len(contours)
    closed = 0
    curved = 0

    for c in contours:
        peri = cv2.arcLength(c, True)
        if peri <= 0:
            continue
        area = cv2.contourArea(c)
        compactness = area / (peri * peri)
        if compactness > 0.008:
            closed += 1

        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        # Curve proxy: long contour with many approximation points.
        if len(approx) > 8 and peri > 40:
            curved += 1

    center = binary_inv[h // 4 : 3 * h // 4, w // 4 : 3 * w // 4]
    center_occupancy_ratio = safe_ratio(np.count_nonzero(center), center.size)

    left = binary_inv[:, : w // 2]
    right = cv2.flip(binary_inv[:, w // 2 :], 1)
    min_w = min(left.shape[1], right.shape[1])
    symmetry_diff = np.mean(cv2.absdiff(left[:, :min_w], right[:, :min_w])) / 255.0
    left_right_symmetry_score = float(1.0 - symmetry_diff)

    top = binary_inv[: h // 2, :]
    bottom = binary_inv[h // 2 :, :]
    top_ratio = safe_ratio(np.count_nonzero(top), top.size)
    bottom_ratio = safe_ratio(np.count_nonzero(bottom), bottom.size)
    top_bottom_balance_score = float(1.0 - abs(top_ratio - bottom_ratio))

    hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
    prob = hist / max(hist.sum(), 1)
    texture_entropy = float(-np.sum(prob[prob > 0] * np.log2(prob[prob > 0])) / 8.0)
    contrast_score = float(np.std(gray) / 255.0)

    # Scribble proxy: high edge density inside drawing area.
    edges = cv2.Canny(gray, 80, 160)
    scribble_density = float(edge_density := safe_ratio(np.count_nonzero(edges), total)) * drawing_area_ratio

    # Erasure proxy: light gray low saturation-like strokes on paper background.
    # Works better on scanned pencil/eraser marks than on clean digital art.
    light_gray = (gray > 180) & (gray < 245)
    erasure_marks_ratio = safe_ratio(np.count_nonzero(light_gray & (binary_inv == 0)), total)

    return {
        "closed_contour_ratio": safe_ratio(closed, shape_count),
        "shape_count": int(shape_count),
        "object_count": int(shape_count),
        "drawing_area_ratio": float(drawing_area_ratio),
        "whitespace_ratio": float(whitespace_ratio),
        "center_occupancy_ratio": float(center_occupancy_ratio),
        "left_right_symmetry_score": float(left_right_symmetry_score),
        "top_bottom_balance_score": float(top_bottom_balance_score),
        "texture_entropy": float(texture_entropy),
        "contrast_score": float(contrast_score),
        "scribble_density": float(scribble_density),
        "erasure_marks_ratio": float(erasure_marks_ratio),
        "curved_line_ratio": safe_ratio(curved, shape_count),
    }


def image_quality_score(gray: np.ndarray) -> float:
    # Blur + brightness sanity score. 1.0 means acceptable quality.
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    blur_score = min(lap_var / 400.0, 1.0)
    brightness = np.mean(gray) / 255.0
    exposure_score = 1.0 - min(abs(brightness - 0.72) / 0.72, 1.0)
    return float(max(0.0, min(1.0, 0.65 * blur_score + 0.35 * exposure_score)))


def extract_art_features(
    image_path: str | Path,
    age_group: str = "unknown",
    drawing_prompt: str = "Free drawing",
) -> Dict[str, Any]:
    image_path = Path(image_path)
    img = load_image(image_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Binary inverse: drawing pixels become white.
    # Threshold near paper background. Works with white/near-white paper scans.
    binary_inv = cv2.threshold(gray, 245, 255, cv2.THRESH_BINARY_INV)[1]

    features: Dict[str, Any] = {
        "image_path": str(image_path),
        "image_id": image_path.name,
        "age_group": age_group,
        "drawing_prompt": drawing_prompt,
        "scan_quality_score": image_quality_score(gray),
    }

    features.update(color_features(img))
    features.update(line_and_stroke_features(gray, binary_inv))
    features.update(shape_composition_texture_features(gray, binary_inv))

    # Ensure every ML feature is present in consistent order.
    for col in FEATURE_COLUMNS:
        features.setdefault(col, 0.0)

    return features


def save_single(image_path: Path, out_path: Path, age_group: str, drawing_prompt: str) -> None:
    features = extract_art_features(image_path, age_group=age_group, drawing_prompt=drawing_prompt)
    cols = ["image_path", "image_id"] + FEATURE_COLUMNS
    pd.DataFrame([features])[cols].to_csv(out_path, index=False)
    print(f"Saved features: {out_path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("image", help="Input drawing image path")
    parser.add_argument("--out", default="extracted_features.csv", help="Output CSV")
    parser.add_argument("--age-group", default="unknown", help="Example: 5-7, 8-10, 11-13")
    parser.add_argument("--drawing-prompt", default="Free drawing")
    args = parser.parse_args()

    save_single(
        image_path=Path(args.image),
        out_path=Path(args.out),
        age_group=args.age_group,
        drawing_prompt=args.drawing_prompt,
    )


if __name__ == "__main__":
    main()

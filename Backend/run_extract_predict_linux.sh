#!/usr/bin/env bash
set -e
pip install -r requirements.txt
python src/analyze_art.py sample_images/sample_child_art_01.png --age-group 8-10 --out one_image_prediction.csv

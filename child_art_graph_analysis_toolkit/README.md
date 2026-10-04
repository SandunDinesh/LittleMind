

## Fix scikit-learn joblib version warning/error

If you see `InconsistentVersionWarning` or `ModuleNotFoundError: No module named '_loss'`, rebuild the models with your installed scikit-learn version:

```bat
python src\train_model.py --data data\child_art_stress_synthetic_dataset.csv
```

Then run:

```bat
python src\analyze_art.py sample_images\sample_child_art_01.png --age-group 8-10 --out prediction.csv
```

You can also double-click/run:

```text
fix_retrain_models_windows.bat
```

# Child Art Parameter Extraction + ML Toolkit

This package gives you a practical pipeline:

```text
Drawing image
   ↓
OpenCV parameter extraction
   ↓
CSV feature dataset
   ↓
ML model prediction
   ↓
Teacher / counselor review tool
```

## Very important safety note

This toolkit is for **screening and research support only**.  
It must not be used to diagnose rape, abuse, trauma, mental illness, or family problems from child art.

Correct output style:

```text
Low / Moderate / High stress screening result
review_required = True / False
```

Incorrect output style:

```text
This child was abused / raped / traumatized
```

## Main files

| File | Purpose |
|---|---|
| `src/art_feature_extractor.py` | Extract OpenCV parameters from one drawing |
| `src/batch_extract.py` | Extract parameters from a full folder of images |
| `src/analyze_art.py` | One command: image → features → ML prediction |
| `src/train_model.py` | Train classifier and regressor |
| `src/predict_art.py` | Predict from extracted features CSV |
| `src/review_app_streamlit.py` | Simple review UI |
| `models/stress_level_classifier.joblib` | Trained synthetic classifier |
| `models/stress_score_regressor.joblib` | Trained synthetic regressor |
| `data/child_art_stress_synthetic_dataset.csv` | Synthetic dataset |
| `data/manual_review_label_template.csv` | Human labeling template |
| `feature_schema.json` | Full ML input feature list |

## Install

```bash
pip install -r requirements.txt
```

## 1. Extract OpenCV parameters from one art image

```bash
python src/art_feature_extractor.py sample_images/sample_child_art_01.png --age-group 8-10 --out extracted_features.csv
```

Output: `extracted_features.csv`

## 2. Predict stress screening result

```bash
python src/predict_art.py extracted_features.csv --out predictions.csv
```

Output columns include:

```text
predicted_stress_level
predicted_stress_score_0_100
prob_Low
prob_Moderate
prob_High
review_required
```

## 3. One command image analysis

```bash
python src/analyze_art.py sample_images/sample_child_art_01.png --age-group 8-10 --out one_image_prediction.csv
```

## 4. Batch extract a folder

```bash
python src/batch_extract.py sample_images --out batch_features.csv --age-group 8-10
```

## 5. Retrain model

```bash
python src/train_model.py --data data/child_art_stress_synthetic_dataset.csv
```

## 6. Run review tool UI

```bash
streamlit run src/review_app_streamlit.py
```

## Extracted OpenCV parameters

### Color
- `mean_hue_deg`
- `mean_saturation`
- `mean_value_brightness`
- `warm_color_ratio`
- `cool_color_ratio`
- `dark_color_ratio`
- `bright_color_ratio`
- `red_ratio`
- `blue_ratio`
- `green_ratio`
- `yellow_ratio`
- `black_gray_ratio`
- `dominant_color_count`
- `color_variety_score`

### Lines and stroke
- `edge_density`
- `line_count`
- `avg_line_length_px`
- `line_length_std_px`
- `stroke_thickness_avg_px`
- `stroke_thickness_std_px`
- `broken_line_ratio`
- `horizontal_line_ratio`
- `vertical_line_ratio`
- `diagonal_line_ratio`
- `curved_line_ratio`
- `orientation_entropy`

### Shapes and composition
- `closed_contour_ratio`
- `shape_count`
- `object_count`
- `drawing_area_ratio`
- `whitespace_ratio`
- `center_occupancy_ratio`
- `left_right_symmetry_score`
- `top_bottom_balance_score`

### Texture
- `texture_entropy`
- `contrast_score`
- `scribble_density`
- `erasure_marks_ratio`
- `pressure_proxy_darkness`

## Corrected ML training rule

These columns are **not used as features**:

```text
child_art_id
image_id
image_path
label_source
data_split
stress_score_0_100
stress_level
```

`data_split` is excluded because it is only for train/test separation, not a real drawing feature.

## Current synthetic dataset model metrics

Classifier:

```text
Accuracy: 0.9867
Macro F1: 0.9883
```

Regressor:

```text
MAE: 9.3785
R2: 0.8108
```

These numbers are from **synthetic data**, so they are only useful for testing the code pipeline.

## Graph display / detected values dashboard

### Static graph report

After you run prediction:

```bash
python src/visualize_art_features.py sample_prediction_output.csv --out-dir reports
```

This creates:

```text
reports/color_ratios.png
reports/line_features.png
reports/composition_features.png
reports/texture_features.png
reports/stress_probabilities.png
reports/feature_radar.png
reports/art_analysis_report.html
```

### Interactive graph dashboard

```bash
streamlit run src/graph_dashboard_streamlit.py
```

This dashboard lets you:

```text
Upload child art image
View extracted values
View color/line/composition/texture graphs
View ML stress probability graph
Download detected values CSV
```

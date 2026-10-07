# LittleMind – Stress Level Analyzer (FastAPI + Next.js)

## 1. Setup
```bash
cd Backend
pip install -r requirements.txt
cd ../Frontend
npm install --legacy-peer-deps      # needed: react-day-picker vs React 19
```
Dataset must be at `Dataset/Images/Emotion/{train,test}/{Happiness,Sadness}`
(or set `STRESS_DATA=<path>`).

## 2. Train (ML flow)
```bash
cd Backend
python -m stress_analyzer.train
```
First run downloads ResNet50 weights (~100 MB) and computes CNN features
(~15+ min on CPU). They are cached in `models/` so later runs are fast.

| Step | What happens |
|---|---|
| 1 Load | 10,860 drawings. Happiness → **Stress Low**, Sadness → **Stress High** |
| 2 Check | no child appears in both train and test |
| 3 Features | 40 OpenCV features (colour, lines, layout) + 2048 ResNet50 features |
| 4 Split | dataset's own train/test split (by child) |
| 5 Cross-validation | 5 folds grouped by child → picks the ensemble weight |
| 6 Train | Random Forest (OpenCV) + SVM (ResNet → PCA 256 → RBF) |
| 7 Test once | untouched 1,632 test drawings |
| 8 Graphs | 11 PNGs + `reports/metrics.json` |
| 9 Save | `models/stress_model.joblib` |

Result: **69.6% test accuracy**, AUC 0.768.

Screening levels come from P(High) (set in `stress_analyzer/config.py`):

| P(High) | Level | Test drawings | Matches label |
|---|---|---|---|
| < 0.45 | Low | 43.8% | 71.1% happy |
| 0.45 – 0.60 | Moderate | 21.2% | mixed (51% sad) |
| ≥ 0.60 | High | 35.0% | 75.9% sad |

Moderate is a probability band, not a trained class (the data only has happy/sad).

## 3. Run
```bash
cd Backend  && uvicorn api:app --port 8000
cd Frontend && npm run dev            # http://localhost:3000
```
- `/analyze` – upload a drawing
- `/model` – all graphs and metrics
- API docs: http://127.0.0.1:8000/docs

## Code layout
```
Backend/
  api.py                  FastAPI: /health, /api/metrics, /api/analyze, /reports/*
  stress_analyzer/
    config.py  data.py  features.py  opencv_features.py
    models.py  plots.py  train.py  predict.py
```

## Notes
- Labels are proxies (happy/sad drawing prompts), not clinical stress measures.
- Stress score = P(High) × 100, a research index.

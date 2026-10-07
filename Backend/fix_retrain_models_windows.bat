@echo off
echo Rebuilding ML models using your local Python/scikit-learn version...
python src\train_model.py --data data\child_art_stress_synthetic_dataset.csv
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Training failed. Try installing requirements again:
  echo pip install -r requirements.txt
  pause
  exit /b %ERRORLEVEL%
)
echo.
echo Done. Now run:
echo python src\analyze_art.py sample_images\sample_child_art_01.png --age-group 8-10 --out prediction.csv
pause

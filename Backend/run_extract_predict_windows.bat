@echo off
REM Example Windows commands
pip install -r requirements.txt
python src\analyze_art.py sample_images\sample_child_art_01.png --age-group 8-10 --out one_image_prediction.csv
pause

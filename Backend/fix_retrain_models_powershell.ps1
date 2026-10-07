Write-Host "Rebuilding ML models using your local Python/scikit-learn version..."
python src\train_model.py --data data\child_art_stress_synthetic_dataset.csv
if ($LASTEXITCODE -ne 0) {
    Write-Host "Training failed. Try: pip install -r requirements.txt"
    exit $LASTEXITCODE
}
Write-Host "Done. Now run:"
Write-Host "python src\analyze_art.py sample_images\sample_child_art_01.png --age-group 8-10 --out prediction.csv"

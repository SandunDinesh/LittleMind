"""All settings in one place."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]          # .../Backend
DATA_DIR = Path(os.getenv("STRESS_DATA", ROOT.parent / "Dataset" / "Images" / "Emotion"))
MODEL_DIR = ROOT / "models"
REPORT_DIR = ROOT / "reports"
CACHE_DIR = MODEL_DIR / "cache"

# folder name -> stress level (proxy labels, see README)
LABELS = {"Happiness": "Low", "Sadness": "High"}
CLASSES = ["Low", "High"]

SEED = 42
FOLDS = 5

# pretrained network (ImageNet weights, downloaded once)
CNN_NAME = "resnet50"
CNN_URL = ("https://github.com/huggingface/pytorch-image-models/releases/download/"
           "v0.1-rsb-weights/resnet50_a1_0-14fe96d1.pth")
CNN_PCA = 256

# three screening levels from P(High):
#   P < 0.45 -> Low,  0.45 <= P < 0.60 -> Moderate,  P >= 0.60 -> High
MODERATE_FROM = 0.45
HIGH_FROM = 0.60
LEVELS = ["Low", "Moderate", "High"]

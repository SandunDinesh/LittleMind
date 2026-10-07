"""Step 2 – turn drawings into numbers.

A) OpenCV features (40): colour, lines, shapes, layout, texture – explainable.
B) CNN features (2048): from ResNet50 trained on ImageNet – picture content.
Both are cached so they are only computed once.
"""
from pathlib import Path
import hashlib
import numpy as np
import pandas as pd
from joblib import Parallel, delayed

from .config import CACHE_DIR, CNN_NAME, CNN_URL, MODEL_DIR
from .opencv_features import FEATURE_COLUMNS, extract_art_features

CV_COLS = [c for c in FEATURE_COLUMNS if c not in ("age_group", "drawing_prompt")]


# ---------- A) OpenCV ----------
def opencv_one(path) -> dict:
    f = extract_art_features(path)
    return {k: (np.nan if not np.isfinite(f[k]) else f[k]) for k in CV_COLS}


def opencv_many(paths, jobs=-1) -> pd.DataFrame:
    rows = Parallel(n_jobs=jobs, batch_size=32)(delayed(opencv_one)(p) for p in paths)
    return pd.DataFrame(rows, columns=CV_COLS)


# ---------- B) CNN ----------
_net, _tf = None, None


def cnn():
    """Load ResNet50 once (weights are downloaded to models/weights the first time)."""
    global _net, _tf
    if _net is None:
        import timm, torch
        net = timm.create_model(CNN_NAME, pretrained=False, num_classes=0)
        sd = torch.hub.load_state_dict_from_url(CNN_URL, model_dir=str(MODEL_DIR / "weights"),
                                                map_location="cpu", progress=True)
        net.load_state_dict({k: v for k, v in sd.items() if not k.startswith("fc.")})
        _net = net.eval()
        cfg = timm.data.resolve_data_config({}, model=net)
        _tf = timm.data.create_transform(**cfg)
    return _net, _tf


def cnn_many(paths, batch=32, quiet=False) -> np.ndarray:
    import torch
    from PIL import Image
    net, tf = cnn()
    out = []
    with torch.no_grad():
        for i in range(0, len(paths), batch):
            x = torch.stack([tf(Image.open(p).convert("RGB")) for p in paths[i:i + batch]])
            out.append(net(x).numpy())
            if not quiet:
                print(f"  CNN {min(i + batch, len(paths))}/{len(paths)}", end="\r", flush=True)
    if not quiet:
        print()
    return np.vstack(out).astype("float32")


# ---------- cache ----------
def _key(paths) -> str:
    h = hashlib.md5()
    for p in paths:
        p = Path(p)
        h.update(f"{p.name}{p.stat().st_size}".encode())
    return h.hexdigest()[:12]


def build(df: pd.DataFrame):
    """Return (opencv DataFrame, cnn array) for every row of df, using the cache."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    key = _key(df.path)
    f_cv, f_cnn = CACHE_DIR / f"opencv_{key}.csv", CACHE_DIR / f"cnn_{key}.npy"

    if f_cv.exists():
        cv = pd.read_csv(f_cv)
    else:
        print("Extracting OpenCV features ...")
        cv = opencv_many(list(df.path))
        cv.to_csv(f_cv, index=False)

    if f_cnn.exists():
        emb = np.load(f_cnn)
    else:
        print("Extracting CNN features (first time only) ...")
        emb = cnn_many(list(df.path))
        np.save(f_cnn, emb)
    return cv, emb

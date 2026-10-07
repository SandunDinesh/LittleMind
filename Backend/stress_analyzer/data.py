"""Step 1 – load the dataset (one row per drawing)."""
from pathlib import Path
import pandas as pd

from .config import DATA_DIR, LABELS

EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def child_id(name: str) -> str:
    """101-1A-369-F-H.jpg -> 101-1A-369-F (same child, any emotion)."""
    return Path(name).stem.rsplit("-", 1)[0]


def load(data_dir: Path = DATA_DIR) -> pd.DataFrame:
    rows = []
    for split in ["train", "test"]:
        for folder, level in LABELS.items():
            for f in sorted((data_dir / split / folder).glob("*")):
                if f.suffix.lower() in EXT:
                    rows.append({"path": str(f), "image": f.name, "split": split,
                                 "folder": folder, "level": level, "kid": child_id(f.name)})
    df = pd.DataFrame(rows)
    if df.empty:
        raise SystemExit(f"No images found in {data_dir}")
    return df


def check(df: pd.DataFrame) -> dict:
    """Basic data checks – stop early if something is wrong."""
    tr, te = df[df.split == "train"], df[df.split == "test"]
    shared = set(tr.kid) & set(te.kid)
    info = {
        "images": len(df),
        "children": df.kid.nunique(),
        "train": len(tr),
        "test": len(te),
        "kids_in_both": len(shared),
        "per_level": df.groupby(["split", "level"]).size().unstack().to_dict(),
    }
    if shared:
        raise SystemExit(f"{len(shared)} children are in both train and test – data leak")
    return info

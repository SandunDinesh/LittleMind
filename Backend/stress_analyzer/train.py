"""Train the stress level model – full ML flow.

Run from the Backend folder:
    python -m stress_analyzer.train

Steps
 1. Load data          Dataset/Images/Emotion/{train,test}/{Happiness,Sadness}
 2. Check data         no child in both train and test
 3. Features           OpenCV (40) + ResNet50 (2048), cached
 4. Split              use the dataset's own train/test split (by child)
 5. Cross-validation   5 folds on train, grouped by child -> pick ensemble weight
 6. Train              Random Forest + SVM on all train data
 7. Test once          on the untouched test drawings (Low / Moderate / High)
 8. Graphs + metrics   reports/*.png, reports/metrics.json
 9. Save               models/stress_model.joblib (used by the FastAPI app)
"""
import json
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (accuracy_score, classification_report, f1_score,
                             roc_auc_score, confusion_matrix)
from sklearn.model_selection import StratifiedGroupKFold

from . import data, features, plots
from .config import CLASSES, FOLDS, HIGH_FROM, LEVELS, MODEL_DIR, MODERATE_FROM, REPORT_DIR, SEED
from .models import Ensemble, forest, svm, to_level


def say(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def two_level(p):
    return np.where(p >= 0.5, "High", "Low")


def main():
    MODEL_DIR.mkdir(exist_ok=True)
    REPORT_DIR.mkdir(exist_ok=True)
    t0 = time.time()

    # 1-2. load + check
    say("1-2  Load and check data")
    df = data.load()
    info = data.check(df)
    say(f"     {info['images']} drawings, {info['children']} children, train {info['train']}, test {info['test']}")

    # 3. features
    say("3    Features")
    cv_all, emb_all = features.build(df)

    # 4. split (dataset split is already by child)
    tr = (df.split == "train").to_numpy()
    te = ~tr
    y = (df.level == "High").astype(int).to_numpy()
    Xc, Xe = cv_all.to_numpy(), emb_all

    # 5. cross-validation on train only
    say("5    Cross-validation (5 folds, grouped by child)")
    gk = StratifiedGroupKFold(FOLDS, shuffle=True, random_state=SEED)
    idx = np.where(tr)[0]
    oof_rf, oof_sv = np.zeros(len(idx)), np.zeros(len(idx))
    cv = {"rf": [], "svm": []}
    folds = []
    for k, (a, b) in enumerate(gk.split(idx, y[idx], df.kid.iloc[idx])):
        A, B = idx[a], idx[b]
        rf = forest().fit(Xc[A], y[A])
        sv = svm().fit(Xe[A], y[A])
        oof_rf[b] = rf.predict_proba(Xc[B])[:, 1]
        oof_sv[b] = sv.predict_proba(Xe[B])[:, 1]
        cv["rf"].append(accuracy_score(y[B], oof_rf[b] >= .5))
        cv["svm"].append(accuracy_score(y[B], oof_sv[b] >= .5))
        folds.append(b)
        say(f"     fold {k+1}: RF {cv['rf'][-1]:.3f}  SVM {cv['svm'][-1]:.3f}")

    ws = np.round(np.arange(0, 1.01, .1), 1)
    accs = [accuracy_score(y[idx], (w * oof_sv + (1 - w) * oof_rf) >= .5) for w in ws]
    w = float(ws[int(np.argmax(accs))])
    oof = w * oof_sv + (1 - w) * oof_rf
    cv["ens"] = [accuracy_score(y[idx][b], oof[b] >= .5) for b in folds]
    say(f"     chosen SVM weight {w}  ->  CV accuracy {np.mean(cv['ens']):.3f}")

    # 6. train on all train data
    say("6    Train final models")
    rf = forest().fit(Xc[tr], y[tr])
    sv = svm().fit(Xe[tr], y[tr])
    model = Ensemble(rf, sv, w)

    # 7. test once
    say("7    Test")
    p_rf = rf.predict_proba(Xc[te])[:, 1]
    p_sv = sv.predict_proba(Xe[te])[:, 1]
    p = model.p_high(Xc[te], Xe[te])
    yt = df.level[te].to_numpy()
    pred = two_level(p)                      # base model: Low vs High at 0.5
    acc = accuracy_score(yt, pred)
    cuts = (MODERATE_FROM, HIGH_FROM)
    lv = to_level(p, *cuts)                  # screening levels: Low / Moderate / High
    ends = lv != "Moderate"
    three = {
        "cuts": list(cuts),
        "share": {k: float((lv == k).mean()) for k in LEVELS},
        "low_correct": float((yt[lv == "Low"] == "Low").mean()),
        "high_correct": float((yt[lv == "High"] == "High").mean()),
        "moderate_sad_share": float((yt[lv == "Moderate"] == "High").mean()),
        "low_high_correct": float((lv[ends] == yt[ends]).mean()),
        "table": {g: {k: int(((yt == g) & (lv == k)).sum()) for k in LEVELS} for g in CLASSES},
    }
    rows = []                                # effect of the Moderate band width
    for hw in np.round(np.arange(0, .31, .025), 3):
        e = np.abs(p - .5) >= hw
        rows.append({"half_width": hw, "low_high_share": e.mean(),
                     "low_high_correct": (pred[e] == yt[e]).mean() if e.any() else np.nan})
    tab = pd.DataFrame(rows)

    metrics = {
        "data": info,
        "model": "Random Forest (OpenCV features) + SVM (ResNet50 features), weighted average",
        "svm_weight": w,
        "cv_accuracy": {k: float(np.mean(v)) for k, v in cv.items()},
        "cv_folds": {k: [float(a) for a in v] for k, v in cv.items()},
        "test": {
            "accuracy": float(acc),
            "f1_macro": float(f1_score(yt, pred, average="macro")),
            "auc": float(roc_auc_score(y[te], p)),
            "accuracy_rf_only": float(accuracy_score(y[te], p_rf >= .5)),
            "accuracy_svm_only": float(accuracy_score(y[te], p_sv >= .5)),
            "report": classification_report(yt, pred, labels=CLASSES, output_dict=True),
            "confusion": confusion_matrix(yt, pred, labels=CLASSES).tolist(),
            "three_levels": three,
        },
    }
    say(f"     TEST accuracy {acc:.3f} | AUC {metrics['test']['auc']:.3f} | levels "
        + " ".join(f"{k} {v:.0%}" for k, v in three["share"].items())
        + f" | Low/High correct {three['low_high_correct']:.3f}")

    # 8. graphs
    say("8    Graphs")
    say("     learning curve ...")
    A, B = idx[np.concatenate(folds[1:])], idx[folds[0]]
    sizes, tr_acc, va_acc = [], [], []
    rng = np.random.default_rng(SEED)
    for frac in [.1, .25, .5, .75, 1.0]:
        S = rng.choice(A, int(len(A) * frac), replace=False)
        m = Ensemble(forest().fit(Xc[S], y[S]), svm().fit(Xe[S], y[S]), w)
        sizes.append(len(S))
        tr_acc.append(accuracy_score(y[S], m.p_high(Xc[S], Xe[S]) >= .5))
        va_acc.append(accuracy_score(y[B], m.p_high(Xc[B], Xe[B]) >= .5))
    imp = pd.Series(rf[-1].feature_importances_, index=features.CV_COLS)
    figs = [
        plots.flow(REPORT_DIR),
        plots.balance(df, REPORT_DIR),
        plots.cv_folds(cv, REPORT_DIR),
        plots.weight(ws, accs, w, REPORT_DIR),
        plots.confusion(yt, pred, REPORT_DIR),
        plots.roc(y[te], {"Random Forest": p_rf, "SVM (ResNet)": p_sv, "Ensemble": p}, REPORT_DIR),
        plots.calibration(y[te], p, REPORT_DIR),
        plots.three_levels(y[te], p, cuts, REPORT_DIR),
        plots.importance(imp, REPORT_DIR),
        plots.learning(sizes, tr_acc, va_acc, REPORT_DIR),
        plots.samples(df[te].reset_index(drop=True), p, REPORT_DIR),
    ]
    metrics["learning_curve"] = {"sizes": sizes, "train": tr_acc, "val": va_acc}
    metrics["band_table"] = tab.to_dict(orient="list")
    metrics["graphs"] = figs
    metrics["train_seconds"] = round(time.time() - t0)
    (REPORT_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))

    # 9. save
    joblib.dump({"model": model, "cv_cols": features.CV_COLS, "classes": CLASSES,
                 "cuts": cuts, "metrics": metrics["test"]}, MODEL_DIR / "stress_model.joblib",
                compress=3)
    say(f"9    Saved models/stress_model.joblib and {len(figs)} graphs  ({metrics['train_seconds']} s)")


if __name__ == "__main__":
    main()

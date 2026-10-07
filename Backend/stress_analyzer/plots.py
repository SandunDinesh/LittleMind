"""Step 7 – graphs. Every training run saves these to reports/."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch
from sklearn.calibration import calibration_curve
from sklearn.metrics import ConfusionMatrixDisplay, roc_curve

BLUE, ORANGE, GREEN, RED, GRAY = "#2a78d6", "#eb6834", "#1baf7a", "#e34948", "#a3a29c"
COL = {"Low": GREEN, "High": RED}
plt.rcParams.update({"axes.spines.top": False, "axes.spines.right": False, "axes.grid": True,
                     "grid.color": "#e6e5e0", "axes.axisbelow": True, "figure.dpi": 130,
                     "savefig.bbox": "tight", "axes.titleweight": "bold"})


def _save(fig, out, name):
    fig.savefig(out / name)
    plt.close(fig)
    return name


def flow(out):
    steps = ["1 Load data\n10,860 drawings", "2 Check\nno child in\ntrain & test", "3 Features\nOpenCV 40 +\nResNet50 2048",
             "4 Split\nby child", "5 CV (5 folds)\npick weight", "6 Train\nRF + SVM", "7 Test once\n1,632 drawings",
             "8 Graphs +\nmetrics", "9 Save model\n→ FastAPI"]
    fig, ax = plt.subplots(figsize=(15, 2.6))
    ax.set_axis_off(); ax.set_xlim(0, len(steps)); ax.set_ylim(0, 1)
    for i, s in enumerate(steps):
        ax.add_patch(FancyBboxPatch((i + .06, .15), .82, .7, boxstyle="round,pad=0,rounding_size=.06",
                                    fc="#f4f8fd" if i in (5, 6) else "#f7f7f5", ec=BLUE if i in (5, 6) else "#52514e"))
        ax.text(i + .47, .5, s, ha="center", va="center", fontsize=9)
        if i < len(steps) - 1:
            ax.annotate("", (i + 1.06, .5), (i + .88, .5), arrowprops=dict(arrowstyle="-|>", color="#52514e"))
    ax.set_title("Machine-learning flow", loc="left")
    return _save(fig, out, "01_ml_flow.png")


def balance(df, out):
    t = df.groupby(["split", "level"]).size().unstack()[["Low", "High"]]
    fig, ax = plt.subplots(figsize=(6, 3.4))
    x = np.arange(len(t))
    for j, lv in enumerate(["Low", "High"]):
        b = ax.bar(x + (j - .5) * .38, t[lv], .36, color=COL[lv], label=f"Stress {lv}")
        ax.bar_label(b, fontsize=8)
    ax.set_xticks(x, [s.capitalize() for s in t.index]); ax.legend(); ax.set_ylabel("Drawings")
    ax.set_title("Dataset balance")
    return _save(fig, out, "02_data_balance.png")


def cv_folds(cv, out):
    fig, ax = plt.subplots(figsize=(7, 3.4))
    folds = np.arange(1, len(cv["rf"]) + 1)
    for k, c, n in [("rf", GRAY, "Random Forest"), ("svm", BLUE, "SVM (ResNet)"), ("ens", GREEN, "Ensemble")]:
        ax.plot(folds, np.array(cv[k]) * 100, "-o", color=c, label=f"{n}  {np.mean(cv[k])*100:.1f}%")
    ax.set_xticks(folds); ax.set_xlabel("Fold"); ax.set_ylabel("Accuracy (%)"); ax.set_ylim(50, 85)
    ax.legend(fontsize=8); ax.set_title("Cross-validation (train only, split by child)")
    return _save(fig, out, "03_cv_folds.png")


def weight(ws, accs, best, out):
    fig, ax = plt.subplots(figsize=(6, 3.2))
    ax.plot(ws, np.array(accs) * 100, "-o", color=BLUE)
    ax.axvline(best, ls=":", color="k"); ax.text(best, min(accs) * 100, f"  chosen {best:.1f}", fontsize=8)
    ax.set_xlabel("Weight of SVM (0 = only RF, 1 = only SVM)"); ax.set_ylabel("CV accuracy (%)")
    ax.set_title("Choosing the ensemble weight")
    return _save(fig, out, "04_ensemble_weight.png")


def confusion(y, p, out):
    fig, ax = plt.subplots(1, 2, figsize=(9, 3.8))
    for a, norm, t in [(ax[0], None, "Counts"), (ax[1], "true", "Recall")]:
        ConfusionMatrixDisplay.from_predictions(y, p, labels=["Low", "High"], cmap="Blues", ax=a, colorbar=False,
                                                normalize=norm, values_format=".0%" if norm else "d")
        a.set_title(t); a.grid(False)
    fig.suptitle("Confusion matrix (test)", fontweight="bold")
    plt.tight_layout()
    return _save(fig, out, "05_confusion.png")


def roc(y01, probs, out):
    fig, ax = plt.subplots(figsize=(5, 4.4))
    for (n, p), c in zip(probs.items(), [GRAY, BLUE, GREEN]):
        fpr, tpr, _ = roc_curve(y01, p)
        from sklearn.metrics import roc_auc_score
        ax.plot(fpr, tpr, color=c, lw=2, label=f"{n}  AUC {roc_auc_score(y01, p):.3f}")
    ax.plot([0, 1], [0, 1], ls="--", color="#999")
    ax.set_xlabel("False positive rate"); ax.set_ylabel("True positive rate"); ax.legend(fontsize=8)
    ax.set_title("ROC curve (test)")
    return _save(fig, out, "06_roc.png")


def calibration(y01, p, out):
    fy, fx = calibration_curve(y01, p, n_bins=10)
    fig, ax = plt.subplots(figsize=(5, 4.4))
    ax.plot([0, 1], [0, 1], ls="--", color="#999", label="perfect")
    ax.plot(fx, fy, "-o", color=BLUE, label="model")
    ax.set_xlabel("Predicted P(High)"); ax.set_ylabel("Real share of High"); ax.legend()
    ax.set_title("Are probabilities honest?")
    return _save(fig, out, "07_calibration.png")


def three_levels(y_true, p, cuts, out):
    """Left: P(High) for happy vs sad test drawings with the 3 level bands.
       Right: share of each true group that lands in Low / Moderate / High."""
    lo, hi = cuts
    fig, (a, b) = plt.subplots(1, 2, figsize=(11, 3.8), gridspec_kw={"width_ratios": [1.4, 1]})
    bins = np.linspace(0, 1, 26)
    a.axvspan(0, lo, color=GREEN, alpha=.08); a.axvspan(lo, hi, color=ORANGE, alpha=.10); a.axvspan(hi, 1, color=RED, alpha=.08)
    a.hist(p[y_true == 0], bins, alpha=.7, color=GREEN, label="true Low (happy)")
    a.hist(p[y_true == 1], bins, alpha=.6, color=RED, label="true High (sad)")
    for x in cuts: a.axvline(x, ls=":", color="k")
    top = a.get_ylim()[1]
    for x, t in [(lo / 2, "Low"), ((lo + hi) / 2, "Moderate"), ((hi + 1) / 2, "High")]:
        a.text(x, top * .93, t, ha="center", fontsize=9, fontweight="bold")
    a.set_xlabel("P(High) from the model"); a.set_ylabel("Test drawings"); a.legend(fontsize=8, loc="center left")
    a.set_title("Where the three levels come from")
    lv = np.where(p >= hi, 2, np.where(p >= lo, 1, 0))
    names, cols = ["Low", "Moderate", "High"], [GREEN, ORANGE, RED]
    for row, (g, lab) in enumerate([(0, "true Low\n(happy)"), (1, "true High\n(sad)")]):
        left = 0
        for k in range(3):
            v = (lv[y_true == g] == k).mean() * 100
            b.barh(row, v, left=left, color=cols[k], label=names[k] if row == 0 else None)
            if v > 6: b.text(left + v / 2, row, f"{v:.0f}%", ha="center", va="center", color="white", fontsize=9, fontweight="bold")
            left += v
    b.set_yticks([0, 1]); b.set_yticklabels(["true Low\n(happy)", "true High\n(sad)"]); b.invert_yaxis()
    b.set_xlim(0, 100); b.set_xlabel("% of drawings"); b.legend(ncol=3, fontsize=8, loc="lower center", bbox_to_anchor=(.5, -.42))
    b.set_title("Level given to each group"); b.grid(False)
    plt.tight_layout()
    return _save(fig, out, "08_three_levels.png")


def importance(imp, out):
    top = imp.sort_values().tail(15)
    fig, ax = plt.subplots(figsize=(7, 4.6))
    ax.barh(top.index, top.values, color=BLUE)
    ax.set_title("Random Forest – top 15 drawing features"); ax.set_xlabel("importance")
    return _save(fig, out, "09_feature_importance.png")


def learning(sizes, tr_acc, va_acc, out):
    fig, ax = plt.subplots(figsize=(6.5, 3.6))
    ax.plot(sizes, np.array(tr_acc) * 100, "-o", color=BLUE, label="train")
    ax.plot(sizes, np.array(va_acc) * 100, "-o", color=ORANGE, label="validation")
    ax.set_xlabel("Training drawings"); ax.set_ylabel("Accuracy (%)"); ax.legend()
    ax.set_title("Learning curve (ensemble)")
    return _save(fig, out, "10_learning_curve.png")


def samples(df, p_high, out, n=12, seed=1):
    from PIL import Image
    s = df.sample(n, random_state=seed)
    fig, axs = plt.subplots(2, n // 2, figsize=(2.6 * n // 2, 6))
    for a, (i, r) in zip(axs.ravel(), s.iterrows()):
        a.imshow(Image.open(r.path).convert("RGB")); a.axis("off")
        ph = p_high[df.index.get_loc(i)]
        pred = "High" if ph >= .6 else ("Moderate" if ph >= .45 else "Low")
        ok = pred == r.level
        col = ORANGE if pred == "Moderate" else (GREEN if ok else RED)
        mark = "" if pred == "Moderate" else (" ✓" if ok else " ✗")
        a.set_title(f"{pred} (score {int(ph * 100)}){mark}\ntrue {r.level}", fontsize=9, color=col)
    fig.suptitle("Sample test drawings", fontweight="bold")
    plt.tight_layout()
    return _save(fig, out, "11_sample_predictions.png")

"""Step 3 – the models.

Model A: Random Forest on the 40 OpenCV features (explainable).
Model B: SVM on ResNet50 features (scaled + PCA to 256).
Final  : weighted average of the two probabilities (weight chosen by CV).
"""
import numpy as np
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

from .config import CNN_PCA, SEED


def forest():
    return make_pipeline(
        SimpleImputer(strategy="median"),
        RandomForestClassifier(n_estimators=300, min_samples_leaf=3, max_features="sqrt",
                               n_jobs=-1, random_state=SEED),
    )


def svm():
    return make_pipeline(
        StandardScaler(),
        PCA(CNN_PCA, random_state=SEED),
        SVC(C=1.0, kernel="rbf", probability=True, random_state=SEED),
    )


def to_level(p, lo=None, hi=None):
    """P(High) -> 'Low' / 'Moderate' / 'High' (works for one value or an array)."""
    from .config import MODERATE_FROM, HIGH_FROM
    lo = MODERATE_FROM if lo is None else lo
    hi = HIGH_FROM if hi is None else hi
    return np.where(p >= hi, "High", np.where(p >= lo, "Moderate", "Low"))


class Ensemble:
    """Holds both fitted models and mixes their P(High)."""

    def __init__(self, rf, sv, w):
        self.rf, self.sv, self.w = rf, sv, w

    def p_high(self, cv, emb):
        return self.w * self.sv.predict_proba(emb)[:, 1] + (1 - self.w) * self.rf.predict_proba(cv)[:, 1]

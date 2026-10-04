# LittleMind synthetic dataset V2 (10,000 records), data card

**Status:** SYNTHETIC and NON-CLINICAL. These are generated feature records, not drawings. Every label comes from the rules in `generate_synthetic_v2.py`.
Do not report results from this data as stress, trauma or abuse detection accuracy.

## Files
| File | Purpose |
|---|---|
| `child_art_stress_synthetic_v2_10k.csv` | Training file. It has the same columns as V1 plus 6 `content_*` columns, so it works with `src/train_model.py` unchanged. |
| `child_art_stress_synthetic_v2_10k_metadata.csv` | `child_id`, `age_years`, latent value, synthetic review label, and a label-noise marker. Kept separate so these columns can't leak into training. |
| `generate_synthetic_v2.py` | Reproducible generator (`--seed 2026`). |
| `real_extractor_calibration_50.csv` | Output of `art_feature_extractor.py` on 50 real scanned children's drawings. Used only to calibrate value ranges and correlations. |

## Design
- **10,000 drawings from 4,625 children** (1–4 drawings each), ages 3–6, `age_group = "3-6"`. This matches the API, which sends "3-6" for every image.
- **Split by child** into 70 / 15 / 15 train / validation / test. No child appears in more than one split.
- **Realistic feature scales:** a Gaussian copula fitted to real extractor output. For example, texture entropy averages 0.53 here and 0.53 on real drawings; in V1 it averaged 4.87.
- **Labels:** score = latent + content effects + noise. Classes use cut-offs at 38 and 65, and 10% of records were moved to an adjacent class to simulate rater disagreement.
- **Class balance:** Low 3,367 · Moderate 4,937 · High 1,696.
- **Content flags** (prevalence): aggression 3.5%, crying figure 4.2%, isolated figure 8.3%, weapon 0.7%, injury 0.8%, adult–child conflict 2.4%.

## Benchmark check (Random Forest, V1 configuration)
- Accuracy 58.6%, macro F1 0.565, regression MAE 10.7, all on the synthetic validation+test set.
- A single-feature model now scores 49% (it scored 69% on V1), so the labels are less trivially circular.
- These figures describe the synthetic rules only.

## Known limitations
1. The calibration images came from school-aged children. Ages 3–6 are approximated with hypothesised developmental shifts.
2. The stress-effect directions are hypotheses taken from drawing literature. They are not validated.
3. The OpenCV extractor does **not** produce the `content_*` columns. Real images need a content detector or a human reviewer to fill them. Until then the API sends 0, so depicted abuse scenes will still be missed.
4. The 0–100 score has no clinical reference scale.

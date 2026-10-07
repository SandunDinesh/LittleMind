"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Metrics = {
  model: string
  svm_weight: number
  cv_accuracy: { rf: number; svm: number; ens: number }
  data: { images: number; children: number; train: number; test: number }
  test: {
    accuracy: number
    f1_macro: number
    auc: number
    accuracy_rf_only: number
    accuracy_svm_only: number
    three_levels: {
      cuts: [number, number]
      share: { Low: number; Moderate: number; High: number }
      low_correct: number
      high_correct: number
      moderate_sad_share: number
      low_high_correct: number
    }
    report: Record<string, { precision: number; recall: number; "f1-score": number }>
  }
  graphs: string[]
}

const TITLES: Record<string, string> = {
  "01_ml_flow.png": "Machine-learning flow",
  "02_data_balance.png": "Dataset balance",
  "03_cv_folds.png": "Cross-validation by fold",
  "04_ensemble_weight.png": "Choosing the ensemble weight",
  "05_confusion.png": "Confusion matrix (test)",
  "06_roc.png": "ROC curve (test)",
  "07_calibration.png": "Probability calibration",
  "08_three_levels.png": "Low / Moderate / High levels",
  "09_feature_importance.png": "Top drawing features (Random Forest)",
  "10_learning_curve.png": "Learning curve",
  "11_sample_predictions.png": "Sample test drawings",
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

export default function ModelPage() {
  const [m, setM] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/backend/api/metrics", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Run training first"))))
      .then(setM)
      .catch(() => setError("Could not load model results. Is the FastAPI backend running on port 8000?"))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">How the model performs</h1>
            <p className="mt-2 text-muted-foreground">
              Results on real children&apos;s drawings that the model never saw during training.
            </p>
          </div>

          {error && <p className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

          {m && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Test accuracy" value={pct(m.test.accuracy)} note={`${m.data.test} test drawings`} />
                <Stat label="AUC" value={m.test.auc.toFixed(3)} note="0.5 = guessing, 1 = perfect" />
                <Stat label="Correct when Low or High" value={pct(m.test.three_levels.low_high_correct)}
                      note={`${pct(m.test.three_levels.share.Moderate)} of drawings are Moderate`} />
                <Stat label="Cross-validation" value={pct(m.cv_accuracy.ens)} note="5 folds, split by child" />
              </div>

              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="text-foreground">Model</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground">
                  <p>{m.model}</p>
                  <p className="text-muted-foreground">
                    Random Forest alone {pct(m.test.accuracy_rf_only)} · SVM alone {pct(m.test.accuracy_svm_only)} ·
                    Ensemble {pct(m.test.accuracy)} (SVM weight {m.svm_weight})
                  </p>
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-sm">
                      <thead className="text-muted-foreground">
                        <tr><th className="py-1">Level</th><th>Precision</th><th>Recall</th><th>F1</th></tr>
                      </thead>
                      <tbody className="tabular-nums">
                        {["Low", "High"].map((k) => (
                          <tr key={k} className="border-t border-border">
                            <td className="py-1">Stress {k}</td>
                            <td>{pct(m.test.report[k].precision)}</td>
                            <td>{pct(m.test.report[k].recall)}</td>
                            <td>{pct(m.test.report[k]["f1-score"])}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                {m.graphs.map((g) => (
                  <Card key={g} className={`border-border bg-card ${g.startsWith("01") || g.startsWith("11") ? "lg:col-span-2" : ""}`}>
                    <CardHeader><CardTitle className="text-base text-foreground">{TITLES[g] ?? g}</CardTitle></CardHeader>
                    <CardContent>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/backend/reports/${g}`} alt={TITLES[g] ?? g} className="w-full rounded-md" loading="lazy" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="text-foreground">Three screening levels</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground">
                  <p className="text-muted-foreground">
                    The model gives P(High). Score below {m.test.three_levels.cuts[0] * 100} = Low,
                    {" "}{m.test.three_levels.cuts[0] * 100}–{m.test.three_levels.cuts[1] * 100} = Moderate,
                    {" "}{m.test.three_levels.cuts[1] * 100} or more = High.
                  </p>
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-sm">
                      <thead className="text-muted-foreground">
                        <tr><th className="py-1">Level</th><th>Share of test drawings</th><th>How often it matches the drawing</th></tr>
                      </thead>
                      <tbody className="tabular-nums">
                        <tr className="border-t border-border"><td className="py-1">Low</td><td>{pct(m.test.three_levels.share.Low)}</td><td>{pct(m.test.three_levels.low_correct)} were happy drawings</td></tr>
                        <tr className="border-t border-border"><td className="py-1">Moderate</td><td>{pct(m.test.three_levels.share.Moderate)}</td><td>mixed: {pct(m.test.three_levels.moderate_sad_share)} sad, {pct(1 - m.test.three_levels.moderate_sad_share)} happy</td></tr>
                        <tr className="border-t border-border"><td className="py-1">High</td><td>{pct(m.test.three_levels.share.High)}</td><td>{pct(m.test.three_levels.high_correct)} were sad drawings</td></tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground">
                Labels are proxies: drawings children made when asked about happy moments are treated as Stress Low,
                sad moments as Stress High. This is a research prototype, not a diagnostic tool.
              </p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

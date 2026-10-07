import type { AnalysisResult, ScreeningLevel } from "@/lib/analysis-context"

/*
 * Drawing indicators.
 * Thresholds are the 90th / 10th percentile of the same features measured by the
 * OpenCV extractor on 50 real scanned children's drawings (reference sample,
 * data/real_extractor_calibration_50.csv). "Present" therefore means
 * "more extreme than 9 in 10 reference drawings" - a description of the image,
 * NOT evidence of stress, abuse or any condition.
 */
export type DrawingIndicator = {
  name: string
  present: boolean
  description: string
  value: string
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`

export function buildIndicators(features: Record<string, number>): DrawingIndicator[] {
  const f = (k: string) => features[k] ?? 0
  return [
    {
      name: "Heavy dark shading",
      present: f("dark_color_ratio") > 0.039 || f("pressure_proxy_darkness") > 0.088,
      description: "Large dark or heavily pressed areas compared with reference drawings",
      value: `dark area ${pct(f("dark_color_ratio"))}`,
    },
    {
      name: "Dense scribbling",
      present: f("scribble_density") > 0.056,
      description: "Many overlapping, tightly packed strokes",
      value: `scribble density ${f("scribble_density").toFixed(3)}`,
    },
    {
      name: "Very small drawing",
      present: f("drawing_area_ratio") < 0.096,
      description: "Drawing covers less than about 10% of the page",
      value: `page covered ${pct(f("drawing_area_ratio"))}`,
    },
    {
      name: "Limited colour use",
      present: f("color_variety_score") < 0.172 || f("mean_saturation") < 0.036,
      description: "Few or very pale colours used",
      value: `colour variety ${f("color_variety_score").toFixed(2)}`,
    },
    {
      name: "Unbalanced layout",
      present: f("left_right_symmetry_score") < 0.625,
      description: "Content strongly concentrated on one side of the page",
      value: `left-right balance ${f("left_right_symmetry_score").toFixed(2)}`,
    },
    {
      name: "Many sharp strokes",
      present: f("edge_density") > 0.109,
      description: "Unusually high amount of sharp line edges",
      value: `edge density ${f("edge_density").toFixed(3)}`,
    },
  ]
}

export function getLevel(result: AnalysisResult): ScreeningLevel {
  return (result.screening_level ?? result.predicted_stress_level) as ScreeningLevel
}

export function getConfidence(result: AnalysisResult): number {
  if (typeof result.confidence === "number") return result.confidence
  return Math.max(...Object.values(result.probabilities))
}

export const levelStyle: Record<ScreeningLevel, { badge: string; bar: string; label: string }> = {
  Low: { badge: "bg-success text-success-foreground", bar: "[&>div]:bg-success", label: "Low" },
  Moderate: { badge: "bg-warning text-warning-foreground", bar: "[&>div]:bg-warning", label: "Moderate" },
  High: { badge: "bg-destructive text-destructive-foreground", bar: "[&>div]:bg-destructive", label: "High" },
  Inconclusive: { badge: "bg-slate-600 text-white hover:bg-slate-600", bar: "[&>div]:bg-muted-foreground", label: "Inconclusive" },
}

export type ParentGuidance = {
  title: string
  summary: string
  steps: string[]
  urgent: boolean
}

export const parentGuidance: Record<ScreeningLevel, ParentGuidance> = {
  Low: {
    title: "No strong indicators in this drawing",
    summary:
      "The model found few of the visual patterns it looks for. This does not prove your child is fine — trust what you see day to day.",
    steps: [
      "Keep encouraging drawing and ask your child to tell you about the picture.",
      "Watch for changes in sleep, appetite, mood, play or school behaviour.",
      "If you are worried for any other reason, talk to your family doctor or a counsellor anyway.",
    ],
    urgent: false,
  },
  Moderate: {
    title: "Mixed picture — keep a gentle eye on things",
    summary:
      "The drawing has a mix of the patterns the model saw in happy and in sad drawings. Many happy children draw like this; on its own a drawing means very little.",
    steps: [
      "Spend calm one-to-one time and ask open questions: “Can you tell me about your drawing?”",
      "Do not pressure, question repeatedly or show alarm.",
      "Note any changes over the next 2–4 weeks (sleep, eating, fears, withdrawal, aggression).",
      "If changes continue, speak to your paediatrician, school counsellor or a child psychologist.",
    ],
    urgent: false,
  },
  High: {
    title: "Several indicators — a professional opinion is recommended",
    summary:
      "The model found many of the visual patterns it looks for. This is not a diagnosis, but it is a good reason to talk to a professional.",
    steps: [
      "Stay calm and supportive; let your child talk if they want to, without leading questions.",
      "Arrange an appointment with a child psychologist, child psychiatrist or paediatrician.",
      "Bring this drawing and your notes about any behaviour changes to the appointment.",
      "If your child says someone hurt them, or you think they are unsafe, call 1929 (free, 24/7) right away.",
    ],
    urgent: true,
  },
  Inconclusive: {
    title: "Result unclear — the model is not confident",
    summary:
      "Two levels were almost equally likely, so LittleMind will not choose one. This is about the model's limits, not about your child.",
    steps: [
      "Do not read anything into this result in either direction.",
      "Try another drawing made in good light on plain white paper, or simply talk with your child about it.",
      "If you have any concerns about your child's behaviour or safety, speak to a professional — your judgement matters more than this tool.",
    ],
    urgent: false,
  },
}

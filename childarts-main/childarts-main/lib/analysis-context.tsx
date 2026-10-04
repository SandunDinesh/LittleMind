"use client"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
export type ScreeningLevel = "Low" | "Moderate" | "High" | "Inconclusive"
export type AnalysisResult = {
  predicted_stress_level: string
  screening_level?: ScreeningLevel
  confidence?: number
  top_margin?: number
  inconclusive_margin?: number
  predicted_stress_score_0_100: number
  probabilities: Record<string, number>
  review_required: boolean
  features: Record<string, number>
  age: number
  disclaimer: string
}
type Status = "idle" | "uploading" | "analyzing" | "complete" | "error"
type Context = { file: File | null; preview: string | null; status: Status; result: AnalysisResult | null; error: string | null; age: number; setAge: (age: number) => void; uploadFile: (file: File) => void; startAnalysis: () => Promise<void>; reset: () => void }
const AnalysisContext = createContext<Context | null>(null)
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [age, setAge] = useState(3)
  const uploadFile = useCallback((newFile: File) => {
    setFile(newFile); setResult(null); setError(null); setStatus("idle")
    setPreview(old => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(newFile) })
  }, [])
  const startAnalysis = useCallback(async () => {
    if (!file) return
    setStatus("uploading"); setError(null)
    try {
      const body = new FormData(); body.append("file", file); body.append("age", String(age))
      setStatus("analyzing")
      const response = await fetch("/api/analyze", { method: "POST", body })
      const data = await response.json()
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Analysis failed")
      setResult(data as AnalysisResult); setStatus("complete")
    } catch (err) { setError(err instanceof Error ? err.message : "Analysis failed"); setStatus("error") }
  }, [file, age])
  const reset = useCallback(() => {
    setFile(null); setPreview(old => { if (old) URL.revokeObjectURL(old); return null })
    setStatus("idle"); setResult(null); setError(null)
  }, [])
  return <AnalysisContext.Provider value={{ file, preview, status, result, error, age, setAge, uploadFile, startAnalysis, reset }}>{children}</AnalysisContext.Provider>
}
export function useAnalysis() { const context = useContext(AnalysisContext); if (!context) throw new Error("useAnalysis must be used within an AnalysisProvider"); return context }

"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DrawingUpload } from "@/components/drawing-upload"
import { ResultsDashboard } from "@/components/results-dashboard"
import { AnalysisProvider, useAnalysis } from "@/lib/analysis-context"

function AnalyzeContent() {
  const { status } = useAnalysis()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Analyze a Drawing
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload your child's artwork for a research screening of its visual features, with guidance on next steps.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <DrawingUpload />
            </div>
            <div className="lg:col-span-3">
              {status === "complete" ? (
                <ResultsDashboard />
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <svg
                        className="h-8 w-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Results Will Appear Here
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Upload a drawing and click "Analyze Drawing" to see the
                      screening level, drawing indicators and what you can do next.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <AnalysisProvider>
      <AnalyzeContent />
    </AnalysisProvider>
  )
}

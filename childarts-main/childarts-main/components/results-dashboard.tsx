"use client"

import Link from "next/link"
import { useAnalysis } from "@/lib/analysis-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Activity, AlertTriangle, CheckCircle2, CircleHelp, HeartHandshake, Phone, ShieldAlert, XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buildIndicators, getConfidence, getLevel, levelStyle, parentGuidance } from "@/lib/screening"

const ORDER = ["Low", "Moderate", "High"]

export function ResultsDashboard() {
  const { result } = useAnalysis()
  if (!result) return null

  const level = getLevel(result)
  const confidence = Math.round(getConfidence(result) * 100)
  const style = levelStyle[level]
  const guidance = parentGuidance[level]
  const indicators = buildIndicators(result.features)
  const presentCount = indicators.filter((i) => i.present).length
  const ranked = Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])
  const otherPossible = ranked.slice(1).filter(([, p]) => p >= 0.2).map(([name]) => name)

  return (
    <div className="space-y-6" aria-live="polite">
      {/* 1. Screening assessment */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5 text-accent" />
            Screening Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Screening level</span>
              <Badge className={cn("px-3 py-1 text-sm", style.badge)}>
                {level === "Inconclusive" && <CircleHelp className="mr-1 h-3.5 w-3.5" />}
                {style.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Model confidence</span>
                <span className="font-semibold text-foreground">{confidence}%</span>
              </div>
              <Progress value={confidence} className={cn("h-3", style.bar)} />
            </div>
          </div>

          {level === "Inconclusive" && (
            <div className="flex gap-3 rounded-lg border border-border bg-muted/60 p-3 text-sm text-muted-foreground">
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                The two most likely levels were too close (
                {ranked.slice(0, 2).map(([n, p]) => `${n} ${(p * 100).toFixed(0)}%`).join(" vs ")}
                ), so no level is shown.
              </span>
            </div>
          )}

          {otherPossible.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Other possible levels</p>
              <div className="flex flex-wrap gap-2">
                {otherPossible.map((name) => (
                  <Badge key={name} variant="outline" className="border-border text-foreground">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.review_required && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              Flagged for professional review.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Drawing indicators */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Drawing Indicators
            </CardTitle>
            <Badge
              variant="outline"
              className={
                presentCount > 2
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : presentCount > 0
                    ? "border-warning/40 bg-warning/15 text-warning-foreground"
                    : "border-success/30 bg-success/10 text-success"
              }
            >
              {presentCount} of {indicators.length} present
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {indicators.map((ind) => (
            <div key={ind.name} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
              {ind.present ? (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{ind.name}</p>
                  <Badge
                    variant={ind.present ? "destructive" : "outline"}
                    className={ind.present ? "" : "border-success/30 bg-success/10 text-success"}
                  >
                    {ind.present ? "Present" : "Not present"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ind.description} · <span className="tabular-nums">{ind.value}</span>
                </p>
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            “Present” means more extreme than 9 in 10 reference drawings. Indicators describe the image only — they are not signs of any condition.
          </p>
        </CardContent>
      </Card>

      {/* 3. What parents can do */}
      <Card className={cn("border-border bg-card", guidance.urgent && "border-destructive/40")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <HeartHandshake className="h-5 w-5 text-primary" />
            What You Can Do
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-foreground">{guidance.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{guidance.summary}</p>
          </div>
          <ol className="space-y-2">
            {guidance.steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="gap-2">
              <Link href="/find-help"><HeartHandshake className="h-4 w-4" />Find professional help</Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href="tel:1929"><Phone className="h-4 w-4" />Child helpline 1929</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Research details */}
      <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-6">
        <AccordionItem value="details" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium">Research details</AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm">
            <div className="space-y-1">
              {ORDER.filter((k) => k in result.probabilities).map((k) => (
                <div key={k} className="flex justify-between"><span>{k}</span><span className="tabular-nums">{(result.probabilities[k] * 100).toFixed(1)}%</span></div>
              ))}
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span>Research index (synthetic, not a validated scale)</span>
              <span className="tabular-nums">{result.predicted_stress_score_0_100.toFixed(1)} / 100</span>
            </div>
            {typeof result.top_margin === "number" && (
              <div className="flex justify-between">
                <span>Top-two probability gap (Inconclusive below {((result.inconclusive_margin ?? 0.1) * 100).toFixed(0)} pts)</span>
                <span className="tabular-nums">{(result.top_margin * 100).toFixed(1)} pts</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-sm text-muted-foreground">
        LittleMind cannot tell whether a child has been hurt or is unwell. Do not infer emotions, trauma or a diagnosis from this result.
      </p>
    </div>
  )
}

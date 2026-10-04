import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const trustPoints = [
  "Built with guidance from child psychology research",
  "Clear disclaimers throughout - this is a screening tool, not a diagnosis",
  "Age-appropriate considerations included in every analysis",
  "Actionable recommendations you can apply today",
  "Educational resources to deepen your understanding",
]

export function TrustSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              A Caring Approach to Child Wellbeing
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Every parent wants to understand what their child is feeling.
              LittleMind uses thoughtful AI analysis to give you insights into
              your child's emotional state through their most natural form of
              expression: art.
            </p>
            <ul className="mt-8 space-y-3" role="list">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 gap-2" size="lg">
              <Link href="/analyze">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm font-medium text-foreground">
                  Sample Analysis Preview
                </span>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Primary Emotion
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    Content
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-border">
                    <div className="h-full w-[85%] rounded-full bg-primary" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    85% confidence
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Colors</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Warm & Bright
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Placement</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Centered
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Balanced Composition
                  </span>
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    No Stress Indicators
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

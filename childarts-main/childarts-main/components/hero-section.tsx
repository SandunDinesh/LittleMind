import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background decorative shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-16 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI-powered emotional screening</span>
        </div>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Understanding Your Child Through Their Art
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Upload your child's drawings and receive AI-powered analysis of emotional
          states and potential stress indicators. A compassionate first step toward
          supporting your child's wellbeing.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8 text-base">
            <Link href="/analyze">
              Analyze a Drawing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 text-base">
            <Link href="/resources">Learn More</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          For screening purposes only. Always consult qualified professionals.
        </p>
      </div>
    </section>
  )
}

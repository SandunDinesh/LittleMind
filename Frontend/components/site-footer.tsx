import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-foreground">LittleMind</span>
          </div>

          <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground md:text-right">
            LittleMind is a screening tool designed for educational purposes only.
            It is not a substitute for professional mental health evaluation.
            Always consult qualified professionals for clinical guidance.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          2026 LittleMind. Built with care for families.
        </div>
      </div>
    </footer>
  )
}

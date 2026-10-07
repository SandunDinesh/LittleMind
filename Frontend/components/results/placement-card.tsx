import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Move } from "lucide-react"
import type { PlacementAnalysis } from "@/lib/mock-data"

interface PlacementCardProps {
  placementAnalysis: PlacementAnalysis
}

export function PlacementCard({ placementAnalysis }: PlacementCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-foreground">
          <Move className="h-4 w-4 text-primary" />
          Placement & Composition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Figure Position
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {placementAnalysis.figurePosition}
            </p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Spacing
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {placementAnalysis.spacing}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-primary/5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Interpretation
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {placementAnalysis.interpretation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

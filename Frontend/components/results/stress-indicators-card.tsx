import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import type { StressIndicator } from "@/lib/mock-data"

interface StressIndicatorsCardProps {
  indicators: StressIndicator[]
}

export function StressIndicatorsCard({ indicators }: StressIndicatorsCardProps) {
  const detectedCount = indicators.filter((i) => i.detected).length

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Stress Indicators
          </CardTitle>
          <Badge
            variant="outline"
            className={
              detectedCount > 2
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : detectedCount > 0
                  ? "border-warning/30 bg-warning/10 text-warning-foreground"
                  : "border-success/30 bg-success/10 text-success"
            }
          >
            {detectedCount} of {indicators.length} detected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {indicators.map((indicator) => (
            <div
              key={indicator.name}
              className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
            >
              {indicator.detected ? (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {indicator.name}
                  </p>
                  <Badge
                    variant={indicator.detected ? "destructive" : "outline"}
                    className={
                      indicator.detected
                        ? ""
                        : "border-success/30 bg-success/10 text-success"
                    }
                  >
                    {indicator.detected ? "Detected" : "Not Detected"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {indicator.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

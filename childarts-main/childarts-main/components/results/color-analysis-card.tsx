import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette } from "lucide-react"
import type { ColorAnalysis } from "@/lib/mock-data"

const colorSwatchMap: Record<string, string> = {
  "Dark Blue": "bg-blue-900",
  Black: "bg-foreground",
  Gray: "bg-gray-400",
  Red: "bg-red-500",
  Yellow: "bg-yellow-400",
  Green: "bg-green-500",
  Orange: "bg-orange-400",
  Pink: "bg-pink-400",
  Brown: "bg-amber-700",
  White: "bg-card border border-border",
}

interface ColorAnalysisCardProps {
  colorAnalysis: ColorAnalysis
}

export function ColorAnalysisCard({ colorAnalysis }: ColorAnalysisCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-foreground">
          <Palette className="h-4 w-4 text-primary" />
          Color Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dominant Colors
          </p>
          <div className="flex flex-wrap gap-2">
            {colorAnalysis.dominantColors.map((color) => (
              <div key={color} className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
                <div
                  className={`h-4 w-4 rounded-full ${colorSwatchMap[color] ?? "bg-muted-foreground"}`}
                />
                <span className="text-sm text-foreground">{color}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Color Mood
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {colorAnalysis.colorMood}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ChevronRight } from "lucide-react"

interface RecommendationsCardProps {
  recommendations: string[]
}

export function RecommendationsCard({
  recommendations,
}: RecommendationsCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list">
          {recommendations.map((rec) => (
            <li key={rec} className="flex items-start gap-3">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm leading-relaxed text-foreground">
                {rec}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

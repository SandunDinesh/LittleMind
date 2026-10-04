import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart } from "lucide-react"
import type { EmotionResult } from "@/lib/mock-data"

const emotionColorMap: Record<string, string> = {
  Happy: "bg-success text-success-foreground",
  Anxious: "bg-warning text-warning-foreground",
  Sad: "bg-primary text-primary-foreground",
  Angry: "bg-destructive text-destructive-foreground",
  Stressed: "bg-accent text-accent-foreground",
  Worried: "bg-warning/80 text-warning-foreground",
  Content: "bg-success text-success-foreground",
}

interface EmotionCardProps {
  primaryEmotion: EmotionResult
}

export function EmotionCard({ primaryEmotion }: EmotionCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Heart className="h-5 w-5 text-accent" />
          Emotional State Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Emotion */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Primary Emotion Detected
              </span>
            </div>
            <Badge
              className={
                emotionColorMap[primaryEmotion.emotion] ??
                "bg-muted text-muted-foreground"
              }
            >
              {primaryEmotion.emotion}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold text-foreground">
                {primaryEmotion.confidence}%
              </span>
            </div>
            <Progress value={primaryEmotion.confidence} className="h-3" />
          </div>
        </div>

        {/* Secondary Emotions */}
        {primaryEmotion.secondaryEmotions.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Secondary Emotions
            </p>
            <div className="flex flex-wrap gap-2">
              {primaryEmotion.secondaryEmotions.map((emotion) => (
                <Badge
                  key={emotion}
                  variant="outline"
                  className="border-border text-foreground"
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

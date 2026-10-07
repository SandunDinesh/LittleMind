import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Phone, Heart } from "lucide-react"

const warningSignals = [
  "Persistent themes of violence, fear, or isolation across multiple drawings over weeks",
  "Significant changes in drawing behavior paired with behavioral changes at home or school",
  "Your child expresses distress, fear, or sadness frequently through their art",
  "Drawings consistently depict self-harm or harm to others",
  "Your child refuses to discuss their drawings and becomes agitated when asked",
]

const positiveActions = [
  "Draw alongside your child to create a shared, safe creative space",
  "Ask open-ended questions like 'Tell me about your drawing' rather than 'What is this?'",
  "Keep a collection of your child's drawings to observe changes over time",
  "Praise the process of creating, not just the finished product",
  "Let your child lead - avoid directing what they should draw",
]

export function WhenToSeekHelp() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        When to Seek Professional Help
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Warning Signals
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Consider consulting a professional if you observe:
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {warningSignals.map((signal) => (
                <li key={signal} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {signal}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-card p-3">
              <Phone className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                In a crisis, contact the 988 Suicide & Crisis Lifeline by dialing
                or texting <strong className="text-foreground">988</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-success" />
              Positive Activities to Try
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Supportive actions you can take at home:
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {positiveActions.map((action) => (
                <li key={action} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {action}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

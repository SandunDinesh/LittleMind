import { Upload, Brain, Shield, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Upload,
    title: "Simple Upload",
    description:
      "Drag and drop any drawing in JPG, PNG, or PDF format. Our system handles the rest with a quick, seamless process.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced algorithms evaluate color usage, figure placement, line pressure, and composition to identify emotional patterns.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your child's drawings and analysis results are never shared. All data is processed securely and with full privacy.",
  },
  {
    icon: BookOpen,
    title: "Guided Interpretation",
    description:
      "Clear, plain-language explanations help you understand what indicators may mean, with age-appropriate context.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            A gentle, informed approach to understanding your child's emotional world.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-background transition-shadow hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { educationalResources } from "@/lib/mock-data"

const categoryColorMap: Record<string, string> = {
  "Art Therapy": "bg-primary/10 text-primary",
  "Child Psychology": "bg-accent/10 text-accent",
  Communication: "bg-success/10 text-success",
  "Professional Guidance": "bg-warning/10 text-warning-foreground",
  Activities: "bg-primary/10 text-primary",
}

export function ResourcesGrid() {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Articles & Guides
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {educationalResources.map((resource) => (
          <Card
            key={resource.title}
            className="group cursor-pointer border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
          >
            <CardContent className="flex h-full flex-col pt-6">
              <Badge
                className={
                  categoryColorMap[resource.category] ??
                  "bg-muted text-muted-foreground"
                }
                variant="secondary"
              >
                {resource.category}
              </Badge>
              <h3 className="mt-3 flex-1 text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {resource.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Read Article
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

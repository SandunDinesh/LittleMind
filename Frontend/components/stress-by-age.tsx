import { Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const ageGroups = [
  {
    id: "toddler",
    label: "Ages 3-6",
    title: "Toddlers & Preschoolers",
    locked: false,
    signs: [
      "Scribbles become unusually aggressive or forceful",
      "Refusal to draw or sudden loss of interest in art",
      "Repetitive marks or patterns without variation",
      "Choosing only dark colors consistently",
      "Tearing or destroying their own drawings",
    ],
    notes:
      "At this age, drawings are primarily exploratory. Focus on behavior changes rather than specific drawing content.",
  },
  {
    id: "school",
    label: "Ages 6-9",
    title: "Early School Age",
    locked: true,
    signs: [
      "Drawing family members far apart or missing entirely",
      "Very small self-portraits relative to page size",
      "Heavy use of black, even for happy scenes",
      "Rain, storms, or dark environments appearing frequently",
      "Erasure marks showing repeated attempts to get things 'right'",
    ],
    notes:
      "Children this age begin incorporating symbolic meaning into drawings. Look for recurring themes across multiple drawings.",
  },
  {
    id: "preteen",
    label: "Age 9+",
    title: "Pre-Teens",
    locked: true,
    signs: [
      "Dramatic shift in drawing style or content",
      "Isolation themes - lone figures, barriers, walls",
      "Aggressive imagery that wasn't present before",
      "Self-portraits with exaggerated or minimized features",
      "Reluctance to explain or share drawings",
    ],
    notes:
      "Pre-teens may be more self-conscious about their art. Sudden changes in expression style are often more significant than specific content.",
  },
]

export function StressByAgeSection() {
  const unlockedGroups = ageGroups.filter((group) => !group.locked)

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Signs of Stress by Age Group
      </h2>

      <Tabs defaultValue="toddler" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          {ageGroups.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              disabled={group.locked}
              className={group.locked ? "cursor-not-allowed opacity-50" : ""}
            >
              <span className="flex items-center gap-2">
                {group.label}
                {group.locked && <Lock className="h-3.5 w-3.5" />}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {unlockedGroups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {group.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {group.signs.map((sign) => (
                    <li key={sign} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-sm leading-relaxed text-foreground">
                        {sign}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Important Note
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {group.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}


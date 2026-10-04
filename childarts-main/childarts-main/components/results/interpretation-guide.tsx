import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Baby } from "lucide-react"
import { interpretationGuide } from "@/lib/mock-data"

export function InterpretationGuide() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          Interpretation Guide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Plain-language explanations of what these indicators may mean for your child.
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {interpretationGuide.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
                <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                  <Baby className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Age Consideration
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.ageConsideration}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

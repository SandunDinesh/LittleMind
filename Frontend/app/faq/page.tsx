import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What does LittleMind do?",
    a: "LittleMind measures visual features of a child's drawing — colours, shading, line density, how much of the page is used, balance — and a research model turns these into a screening level (Low, Moderate, High or Inconclusive). It is a research prototype that supports, but never replaces, a professional.",
  },
  {
    q: "Can LittleMind diagnose stress, trauma or abuse?",
    a: "No. No drawing tool can diagnose a child. Research shows drawing features alone do not reliably tell whether a child is stressed or has been hurt. LittleMind describes the drawing; only a qualified professional who meets your child can assess them.",
  },
  {
    q: "What do Low, Moderate, High and Inconclusive mean?",
    a: "They show how many of the visual patterns the model looks for were found. Low = few, Moderate = some, High = many. Inconclusive means two levels were almost equally likely, so the tool will not choose — this reflects the model's uncertainty, not your child.",
  },
  {
    q: "My child's result was High. Should I panic?",
    a: (
      <>
        No. Many happy children draw with dark colours or lots of scribbling. A High result is a reason to talk to a professional,
        not proof that something is wrong. See the steps on your result page and the <Link href="/find-help" className="text-primary underline">Find Help</Link> page.
      </>
    ),
  },
  {
    q: "My child's result was Low, but I am still worried.",
    a: "Trust your concerns. A drawing can look calm even when a child is struggling. If you notice changes in sleep, eating, mood, play, school or behaviour, or your child tells you something worrying, speak to a professional regardless of the result.",
  },
  {
    q: "What are “drawing indicators”?",
    a: "Measurable properties of the image, such as the share of dark areas or how much of the page is covered. “Present” means the value is more extreme than 9 in 10 reference drawings. They are descriptions, not symptoms.",
  },
  {
    q: "How accurate is it?",
    a: "The model has only been tested on synthetic (computer-generated) research data, where it reached about 58% accuracy across three levels. It has not been validated on real children with professional assessments, so its results must not be relied on for decisions about a child.",
  },
  {
    q: "Which ages is it designed for?",
    a: "The current prototype is set up for children aged 3–6.",
  },
  {
    q: "How should I prepare the drawing?",
    a: "Use plain white paper, good even light and a straight, full-page photo or scan without shadows or other objects. Ask your child to draw freely — do not suggest what to draw.",
  },
  {
    q: "Is my child's drawing stored?",
    a: "The image is processed in temporary storage and deleted after the analysis. No images or names are saved by this prototype. Avoid uploading drawings that contain a child's name or other identifying details.",
  },
  {
    q: "Are the professionals on the Find Help page real?",
    a: "Yes. The helplines (1929, 1926, Sumithrayo, 119, 1990) and the child mental-health professionals are real and were taken from public hospital, university and directory listings. LittleMind is not affiliated with them and they have not reviewed this tool. Contact details can change, so please confirm through the hospital or official channel.",
  },
  {
    q: "What should I do if I think a child is being harmed?",
    a: "Call the National Child Protection Authority helpline 1929 (free, 24/7, Sinhala, Tamil and English). If a child is in immediate danger, call Police on 119.",
  },
]

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">What LittleMind can and cannot tell you.</p>
          <Accordion type="single" collapsible className="mt-8 rounded-xl border border-border bg-card px-6">
            {FAQS.map((item, i) => (
              <AccordionItem key={item.q} value={`q${i}`} className={i === FAQS.length - 1 ? "border-b-0" : ""}>
                <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

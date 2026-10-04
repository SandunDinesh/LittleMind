"use client"

import { useEffect, useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Languages, MapPin, Phone, RefreshCw, ShieldAlert, Sparkles, Stethoscope } from "lucide-react"
import { DEMO_PROFESSIONALS, SUPPORT_SERVICES, pickRandom, type Professional } from "@/lib/professionals"

function initials(name: string) {
  return name.replace(/^(Dr|Mr|Ms|Mrs)\.\s*/, "").split(" ").slice(-1)[0].slice(0, 1)
}

function ProfessionalCard({ p, highlight }: { p: Professional; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}>
      <CardContent className="flex gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
          {initials(p.name)}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{p.name}</p>
            <Badge variant="outline" className="border-warning/50 bg-warning/15 text-[10px] uppercase tracking-wide text-warning-foreground">
              Demo profile
            </Badge>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Stethoscope className="h-3.5 w-3.5" />{p.role}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.district}</span>
            <span className="flex items-center gap-1"><Languages className="h-3 w-3" />{p.languages.join(", ")}</span>
            <span>{p.mode}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.focus.map((f) => (
              <Badge key={f} variant="secondary" className="font-normal">{f}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FindHelpPage() {
  const [suggested, setSuggested] = useState<Professional[]>([])
  const [district, setDistrict] = useState("All")
  // Random suggestion runs on the client only, so server and client HTML match.
  useEffect(() => setSuggested(pickRandom(DEMO_PROFESSIONALS, 3)), [])

  const districts = useMemo(() => ["All", ...Array.from(new Set(DEMO_PROFESSIONALS.map((p) => p.district))).sort()], [])
  const list = DEMO_PROFESSIONALS.filter((p) => district === "All" || p.district === district)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl space-y-12 px-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Find Help in Sri Lanka</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Child mental-health professionals and support services. If you are worried about your child, a professional
              can help — no drawing result is needed to ask for support.
            </p>
          </div>

          {/* Urgent */}
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold text-foreground">Is a child in danger or being hurt?</p>
                <p className="text-sm text-muted-foreground">Call the National Child Protection Authority on 1929 (free, 24/7) or Police on 119.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="destructive" className="gap-2"><a href="tel:1929"><Phone className="h-4 w-4" />1929</a></Button>
              <Button asChild variant="outline" className="gap-2"><a href="tel:119"><Phone className="h-4 w-4" />119</a></Button>
            </div>
          </div>

          {/* Verified services */}
          <section>
            <h2 className="mb-1 text-xl font-semibold text-foreground">Support services</h2>
            <p className="mb-4 text-sm text-muted-foreground">Public and non-profit services. Numbers taken from official sources; please confirm before visiting.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SUPPORT_SERVICES.map((s) => (
                <Card key={s.name} className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base leading-snug text-foreground">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    <div className="flex items-center justify-between">
                      <a href={`tel:${s.tel}`} className="flex items-center gap-2 text-lg font-semibold text-primary hover:underline">
                        <Phone className="h-4 w-4" />{s.phone}
                      </a>
                      <span className="text-xs text-muted-foreground">{s.hours}</span>
                    </div>
                    {s.source && (
                      <a href={s.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        Official source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Suggested */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <Sparkles className="h-5 w-5 text-accent" />Suggested professionals
              </h2>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSuggested(pickRandom(DEMO_PROFESSIONALS, 3))}>
                <RefreshCw className="h-4 w-4" />Show others
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {suggested.map((p) => <ProfessionalCard key={p.id} p={p} highlight />)}
            </div>
          </section>

          {/* Directory */}
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">All professionals ({list.length})</h2>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                District
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-md border border-border bg-background p-2 text-foreground">
                  {districts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((p) => <ProfessionalCard key={p.id} p={p} />)}
            </div>
            <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-muted-foreground">
              Demo profiles are fictional placeholders for this research prototype. They are not real practitioners and
              are not recommendations. A real directory must list only verified, registered professionals who have agreed to be included.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

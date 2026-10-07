"use client"

import { useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Phone, ShieldAlert } from "lucide-react"
import { ProfessionalCard } from "@/components/professional-card"
import { PROFESSIONALS, SUPPORT_SERVICES, TYPE_LABEL, type ExpertType } from "@/lib/professionals"

const TYPES: ("all" | ExpertType)[] = ["all", "psychiatrist", "paediatrician", "psychologist", "development"]

export default function FindHelpPage() {
  const [district, setDistrict] = useState("All")
  const [type, setType] = useState<"all" | ExpertType>("all")
  const districts = useMemo(() => ["All", ...Array.from(new Set(PROFESSIONALS.map((p) => p.district))).sort()], [])
  const list = PROFESSIONALS.filter((p) => (district === "All" || p.district === district) && (type === "all" || p.type === type))

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

          {/* Directory */}
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Child mental-health professionals ({list.length})</h2>
                <p className="text-sm text-muted-foreground">Child psychiatrists, paediatricians, psychologists and counsellors in Sri Lanka.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  Type
                  <select value={type} onChange={(e) => setType(e.target.value as "all" | ExpertType)} className="rounded-md border border-border bg-background p-2 text-foreground">
                    {TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All" : TYPE_LABEL[t]}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  District
                  <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-md border border-border bg-background p-2 text-foreground">
                    {districts.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((p) => <ProfessionalCard key={p.id} p={p} />)}
            </div>
            <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-muted-foreground">
              Listed for information from public hospital, university and directory sources (October 2026). LittleMind is not
              affiliated with these professionals and they have not reviewed this tool. Contact details can change, so please
              confirm through the hospital or official channel. For government hospitals, ask for the child and adolescent
              psychiatry clinic.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

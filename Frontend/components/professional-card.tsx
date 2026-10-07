import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Mail, MapPin, MessageCircle, Phone, Stethoscope } from "lucide-react"
import { TYPE_LABEL, type Professional } from "@/lib/professionals"

function initials(name: string) {
  return name.replace(/^(Prof\. Sir|Prof|Dr|Mr|Ms|Mrs)\.?\s*/, "").split(" ").slice(-1)[0].slice(0, 1)
}

export function ProfessionalCard({ p, highlight }: { p: Professional; highlight?: boolean }) {
  return (
    <Card className={highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}>
      <CardContent className="flex gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
          {initials(p.name)}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{p.name}</p>
            <Badge variant="secondary" className="font-normal">{TYPE_LABEL[p.type]}</Badge>
          </div>
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <Stethoscope className="mt-0.5 h-3.5 w-3.5 shrink-0" />{p.role}
          </p>
          <p className="text-sm text-foreground">{p.focus}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{p.institution}</span>
            {p.district !== p.institution && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.district}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {p.tel && (
              <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
                <a href={`tel:${p.tel}`}><Phone className="h-3.5 w-3.5" />Call</a>
              </Button>
            )}
            {p.whatsapp && (
              <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
                <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-3.5 w-3.5" />WhatsApp</a>
              </Button>
            )}
            {p.email && (
              <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
                <a href={`mailto:${p.email}`}><Mail className="h-3.5 w-3.5" />Email</a>
              </Button>
            )}
            <span className="text-xs text-muted-foreground">{p.contact}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


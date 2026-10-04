import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ResourcesGrid } from "@/components/resources-grid"
import { StressByAgeSection } from "@/components/stress-by-age"
import { WhenToSeekHelp } from "@/components/when-to-seek-help"

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Educational Resources
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Learn more about art therapy, recognizing stress in children, and
              practical strategies for supporting your child's emotional
              wellbeing.
            </p>
          </div>

          <ResourcesGrid />
          <StressByAgeSection />
          <WhenToSeekHelp />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

import {
  Calculator,
  Eye,
  FileText,
  LayoutTemplate,
  type LucideIcon,
  PenLine,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { OffertesMockup } from "@/components/product-mockups";
import { AIQuoteMockup } from "@/components/ai-mockups";
import { PricingFeatures } from "@/components/pricing-features";
import { FAQAccordion } from "@/components/faq-accordion";
import { StartCta } from "@/components/start-cta";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Offertes — Fixa",
};

const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: LayoutTemplate,
    title: "Je eigen huisstijl",
    body: "Offertes in jouw logo en kleuren. Eén keer instellen, daarna staat elke offerte er strak op.",
  },
  {
    icon: Sparkles,
    title: "AI stelt het concept op",
    body: "Fixa leest je intake-notities en zet direct een complete offerte klaar — jij controleert en verstuurt.",
  },
  {
    icon: Calculator,
    title: "Line items & BTW",
    body: "Materiaal, arbeid en voorrijden als losse regels. Btw en totalen worden automatisch berekend.",
  },
  {
    icon: PenLine,
    title: "Digitaal ondertekenen",
    body: "Klanten accepteren je offerte online met één klik. Geen geprint papier of heen-en-weer mailen.",
  },
  {
    icon: Eye,
    title: "Leesbevestiging",
    body: "Zie precies wanneer je offerte geopend is, zodat je weet wanneer je kunt opvolgen.",
  },
  {
    icon: Receipt,
    title: "Eén klik naar factuur",
    body: "Geaccepteerd? Zet de offerte direct om in een factuur — zonder de gegevens opnieuw in te voeren.",
  },
];

export default function OffertesPage() {
  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pt-16 sm:pt-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:px-5">
            <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10 lg:order-1">
              <OffertesMockup />
            </div>
            <div className="order-1 flex flex-col items-start gap-6 lg:order-2">
              <span className="inline-flex items-center gap-2 text-primary">
                <FileText className="size-5" strokeWidth={2} />
                <span className="text-base font-bold">Offertes</span>
              </span>
              <h1 className="font-display text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
                Offertes die in een minuut staan.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-foreground/70">
                Stel professionele offertes op in je eigen huisstijl, deel ze
                digitaal en zie wanneer ze gelezen worden. Van eerste regel tot
                getekende opdracht — zonder gedoe.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <AuthDialog>
                  <Button className="h-12 rounded-xl px-6 text-base font-bold">
                    Aan de slag
                  </Button>
                </AuthDialog>
                <Button
                  className="h-12 rounded-xl bg-black px-6 text-base font-bold text-white hover:bg-black/80"
                  nativeButton={false}
                  render={<a href="#contact" />}
                >
                  Boek een demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Media row 1 — image left */}
        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16 lg:px-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
              <AIQuoteMockup />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl leading-[1.05] font-medium tracking-tight sm:text-4xl">
                Een complete offerte vanuit je notities.
              </h2>
              <p className="text-base leading-relaxed text-foreground/70">
                Typ of dicteer wat je op locatie hebt afgesproken. Fixa Assist
                AI vertaalt het naar nette line items met de juiste prijzen en
                btw — inclusief materiaal, arbeid en voorrijden. Jij hoeft alleen
                nog te controleren en te versturen.
              </p>
            </div>
          </div>
        </section>

        {/* Media row 2 — image right */}
        <section className="px-4 pb-16 sm:pb-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16 lg:px-5">
            <div className="flex flex-col gap-4 lg:order-1">
              <h2 className="font-display text-3xl leading-[1.05] font-medium tracking-tight sm:text-4xl">
                Weet wanneer je klant heeft gekeken.
              </h2>
              <p className="text-base leading-relaxed text-foreground/70">
                Deel je offerte als digitale link. Je ziet wanneer hij geopend
                is, klanten accepteren met één klik en jij krijgt direct bericht.
                Geaccepteerd? Zet de offerte in één klik om naar een factuur.
              </p>
            </div>
            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10 lg:order-2">
              <OffertesMockup />
            </div>
          </div>
        </section>

        {/* Feature benefits — 6 cards */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Alles wat een offerte moet kunnen.
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-3xl bg-card p-6 md:p-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" strokeWidth={2} />
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-base text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full product overview */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Alles wat je nodig hebt in één systeem.
            </h2>
            <PricingFeatures />
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Veelgestelde vragen.
            </h2>
            <FAQAccordion />
          </div>
        </section>

        <StartCta />
      </main>
      <SiteFooter />
    </>
  );
}

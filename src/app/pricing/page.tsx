import {
  BarChart3,
  CalendarCheck,
  Coins,
  FileText,
  type LucideIcon,
  Package,
  PiggyBank,
  Receipt,
  Sparkles,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { PricingCalculator } from "@/components/pricing-calculator";
import { FAQAccordion } from "@/components/faq-accordion";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Prijzen — Fixa",
};

const reasons: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Coins,
    title: "Betaal alleen voor wat je verdient",
    body: "Je betaalt een klein percentage van je omzet. Geen omzet betekent geen kosten — het prijsmodel groeit gewoon met je bedrijf mee.",
  },
  {
    icon: Package,
    title: "Alles inbegrepen",
    body: "Alle tools zitten in één abonnement. Geen losse modules of verrassingen achteraf — alleen de standaard transactiekosten voor betalingen.",
  },
  {
    icon: PiggyBank,
    title: "Grote besparing voor kleine bedrijven",
    body: "Juist als starter of klein bedrijf profiteer je: lage vaste lasten en je betaalt naar wat je bedrijf aankan.",
  },
];

const included: { icon: LucideIcon; name: string; body: string }[] = [
  {
    icon: CalendarCheck,
    name: "Online aanvragen",
    body: "Klanten dienen aanvragen in via een formulier op je website.",
  },
  {
    icon: FileText,
    name: "Offertes",
    body: "Stel offertes op met line items en zie wanneer ze gelezen worden.",
  },
  {
    icon: Wrench,
    name: "Klussen & planning",
    body: "Plan jobs, stuur je team aan en houd overzicht op één agenda.",
  },
  {
    icon: Users,
    name: "Klanten",
    body: "Eén plek voor contactgegevens en de volledige werkhistorie.",
  },
  {
    icon: Receipt,
    name: "Facturen & betalingen",
    body: "Factureer automatisch vanaf afgeronde klussen en word direct betaald.",
  },
  {
    icon: BarChart3,
    name: "Rapporten",
    body: "Inzicht in omzet, marge en openstaande facturen in één oogopslag.",
  },
  {
    icon: Sparkles,
    name: "Fixa Assist AI",
    body: "AI stelt offertes op en vat klantgesprekken voor je samen.",
  },
  {
    icon: UserCog,
    name: "Team & rollen",
    body: "Nodig collega's uit met de juiste rechten en houd grip.",
  },
];

export default function PricingPage() {
  return (
    <>
      <main className="flex-1">
        {/* Title + intro */}
        <section className="px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:px-5">
            <h1 className="max-w-3xl font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Eén abonnement voor al je papierwerk.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/70">
              Fixa bevat alle tools om je bedrijf te runnen — van aanvraag tot
              betaling. Eén abonnement, geen losse pakketten. Zo bespaar je tijd
              op administratie en geef je je klanten een professionele ervaring.
            </p>
          </div>
        </section>

        {/* Pricing calculator */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl lg:px-5">
            <div className="rounded-3xl bg-violet p-8 text-white md:p-12">
              <PricingCalculator />
            </div>
          </div>
        </section>

        {/* Why this pricing */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Een prijs die met je meegroeit.
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {reasons.map(({ icon: Icon, title, body }) => (
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

        {/* What is included */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Alles wat erin zit.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {included.map(({ icon: Icon, name, body }) => (
                <div
                  key={name}
                  className="flex items-start gap-4 rounded-2xl bg-surface p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-foreground">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
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

        {/* Start vandaag met Fixa */}
        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center md:gap-12 lg:px-5">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
                Start vandaag met Fixa.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-foreground/70">
                Upload je bestaande factuur en verstuur binnen enkele minuten je
                eerste via Fixa. Gratis zolang je maandomzet onder €5k blijft.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
              <Button
                className="h-12 rounded-xl bg-black px-6 text-base font-bold text-white hover:bg-black/80"
                nativeButton={false}
                render={<a href="#contact" />}
              >
                Boek een demo
              </Button>
              <AuthDialog>
                <Button className="h-12 rounded-xl px-6 text-base font-bold">
                  Aan de slag
                </Button>
              </AuthDialog>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { PricingCalculator } from "@/components/pricing-calculator";
import { PricingFeatures } from "@/components/pricing-features";
import { FAQAccordion } from "@/components/faq-accordion";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Prijzen — Fixa",
};

const reasons: { title: string; body: string }[] = [
  {
    title: "Betaal alleen voor wat je verdient",
    body: "Je tarief is gebaseerd op je omzet. Heb je in een periode geen of minder omzet, dan betaal je ook minder — het prijsmodel groeit gewoon met je bedrijf mee.",
  },
  {
    title: "Alles inbegrepen",
    body: "Alle tools zitten in één abonnement. Geen losse modules of verrassingen achteraf — alleen de standaard transactiekosten voor betalingen.",
  },
  {
    title: "Grote besparing voor kleine bedrijven",
    body: "Juist als starter of klein bedrijf profiteer je: lage vaste lasten en je betaalt naar wat je bedrijf aankan.",
  },
];

export default function PricingPage() {
  return (
    <>
      <main className="flex-1">
        {/* Title + intro */}
        <section className="px-4 pt-16 pb-8 sm:pt-24 sm:pb-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:px-5">
            <h1 className="max-w-3xl font-display text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
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
        <section className="px-4 pb-12 sm:pb-16">
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
              Flexibel, transparant en scherp geprijsd.
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {reasons.map(({ title, body }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 rounded-3xl bg-card p-6 md:p-8"
                >
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-base text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* First-invoice offer */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl lg:px-5">
            <div className="flex flex-col items-start gap-5 rounded-3xl bg-teal p-8 text-white md:flex-row md:items-center md:justify-between md:gap-10 md:p-12">
              <div className="flex flex-col gap-3">
                <h2 className="max-w-2xl font-display text-3xl leading-[1.05] font-medium tracking-tight">
                  Verstuur je eerste factuur in juni of juli en betaal geen
                  kosten in 2026.
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-white/80">
                  Je eerste factuur versturen kost je nog geen 5 minuten. Upload
                  je bestaande factuur, vul de gegevens aan en verstuur — daarna
                  loopt het vanzelf.
                </p>
              </div>
              <AuthDialog>
                <Button className="h-12 shrink-0 rounded-xl px-6 text-base font-bold">
                  Aan de slag
                </Button>
              </AuthDialog>
            </div>
          </div>
        </section>

        {/* What is included */}
        <section className="px-4 py-12 sm:py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Alles is inbegrepen.
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

import { AboutHeadline } from "@/components/about-headline";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Over Fixa",
};

export default function OverPage() {
  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <section className="-mt-[72px] px-4">
          <div className="relative mx-auto flex min-h-[600px] w-full max-w-[1920px] flex-col justify-center overflow-hidden rounded-3xl bg-teal px-6 py-24 text-white sm:min-h-[680px] sm:px-10 lg:px-16">
            {/* soft background glows for depth */}
            <div className="pointer-events-none absolute -top-32 -right-16 size-[520px] rounded-full bg-teal-bright/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-24 size-[460px] rounded-full bg-primary/10 blur-3xl" />
            <div className="relative mx-auto flex w-full max-w-[1536px] flex-col gap-8">
              <div className="flex flex-col gap-5">
                <span className="text-base font-bold tracking-wide text-white/55 uppercase">
                  Over Fixa
                </span>
                <AboutHeadline />
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
                Vakmensen zijn op hun best met gereedschap in de hand — niet
                achter de administratie. Daarom bouwen we Fixa: techniek die het
                papierwerk overneemt, zodat jij je kunt richten op je vak.
              </p>
            </div>
          </div>
        </section>

        {/* Purpose story */}
        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-5">
            <div className="flex flex-col gap-4">
              <span className="text-base font-bold text-primary">
                Onze missie
              </span>
              <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
                Vakmensen verdienen beter.
              </h2>
            </div>
            <div className="flex flex-col gap-5 text-lg leading-relaxed text-foreground/70">
              <p>
                De beste vakmensen zijn bouwers in hart en nieren — gedreven om
                met hun handen iets moois neer te zetten. Maar te vaak gaat hun
                tijd op aan randzaken die niet hun kracht zijn: offertes
                versturen, documentatie bijhouden, administratie verwerken.
              </p>
              <p>
                In andere sectoren heeft techniek het werk allang makkelijker
                gemaakt. Restaurants, winkels en dienstverleners leveren betere
                service, werken efficiënter en houden focus — dankzij slimme
                systemen. Maar vakmensen hebben nauwelijks geprofiteerd van die
                ontwikkelingen.
              </p>
              <p>
                Wij vinden dat vakmensen beter verdienen: techniek die er voor
                hén is. Geen los pakket of ingewikkeld programma erbij, maar één
                systeem dat meedenkt, het saaie werk overneemt en zich aanpast
                aan hoe jij werkt.
              </p>
              <p>
                Daarom bouwen we Fixa: één samenhangend systeem dat je
                papierwerk vervangt. Om je werk effectiever te maken, je
                administratie te vereenvoudigen en je altijd in sync te houden
                met je klanten.
              </p>
              <p>
                Zo helpt Fixa vakmensen om productiever te zijn, met meer rust
                te werken en uiteindelijk meer te verdienen.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { IndustriesCarousel } from "@/components/industries-carousel";
import { ProductCarousel } from "@/components/product-carousel";
import { ReferralsCarousel } from "@/components/referrals-carousel";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Industries />
        <Product />
        <Workflow />
        <Referrals />
        <CTABand />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="-mt-[72px] px-4">
      <div className="relative mx-auto min-h-[600px] w-full max-w-7xl overflow-hidden rounded-3xl sm:min-h-[680px]">
        <Image
          src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=2400&q=80"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) calc(100vw - 32px), 100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative z-10 mx-auto grid h-full max-w-6xl grid-cols-1 gap-12 px-6 pt-[160px] pb-16 sm:pb-20 md:grid-cols-2 md:items-center">
          {/* Left: copy */}
          <div className="flex flex-col items-start gap-8 text-left text-white">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              Pre-launch
            </span>
            <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Minder papierwerk,
              <br />
              meer vakwerk.
            </h1>
            <p className="max-w-lg text-lg text-white/85 sm:text-xl">
              Fixa brengt aanvragen, intakes, offertes, werk en facturen samen
              in één voorspelbare flow — zodat je meer tijd hebt voor je vak en
              minder voor administratie.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AuthDialog>
                <Button className="h-12 rounded-xl px-6 text-base font-bold">
                  Boek een demo
                </Button>
              </AuthDialog>
              <Button
                variant="outline"
                className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                nativeButton={false}
                render={<a href="#workflow" />}
              >
                Aan de slag
              </Button>
            </div>
          </div>

          {/* Right: phone mockup as hero element */}
          <div className="hidden items-center justify-center md:flex">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div
      aria-hidden
      className="relative aspect-[9/19] w-[210px] rounded-[2.5rem] bg-black p-[6px] shadow-2xl ring-1 ring-white/10 lg:w-[240px]"
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[2.25rem] bg-cream text-xs font-medium tracking-wider text-cream-foreground/60 uppercase">
        App screenshot
      </div>
    </div>
  );
}

function Product() {
  return (
    <section id="product" className="py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Product
          </p>
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Eén flow voor je hele vakbedrijf.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Van eerste aanvraag tot betaalde factuur — Fixa zit overal tussen.
          </p>
        </div>
        <ProductCarousel />
      </div>
    </section>
  );
}

const workflowSteps = [
  { name: "Aanvraag", body: "Vang werk op via drie kanalen." },
  {
    name: "Intake",
    body: "Bepaal of een bezoek nodig is. Verzamel wat je nodig hebt voor de offerte.",
  },
  { name: "Offerte", body: "Opstellen, delen, aanpassen — tot het akkoord is." },
  { name: "Werk", body: "Plannen, toewijzen, uitvoeren." },
  { name: "Factuur", body: "Versturen, herinneren, geld ontvangen." },
];

function Workflow() {
  return (
    <section id="workflow" className="px-4 py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-display font-medium text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Van eerste telefoontje tot laatste factuur.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Eén workflow die past bij hoe vakwerk écht loopt.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-5">
          {workflowSteps.map((step, i) => (
            <li
              key={step.name}
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-5"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold">{step.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const industryCards = [
  {
    name: "Loodgieters",
    body: "Vang noodgevallen op, plan onderhoud en factureer direct vanaf de werkplek.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80",
  },
  {
    name: "Elektriciens",
    body: "Werk slim met digitale werkbonnen, materiaalbeheer en directe oplevering.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  },
  {
    name: "CV & klimaat",
    body: "Beheer onderhoudscontracten, plan servicebezoeken en houd elke installatie bij.",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80",
  },
  {
    name: "Hoveniers",
    body: "Plan seizoenswerk, factureer uren en materialen, en blijf groeien zonder admin.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    name: "Schoonmaak",
    body: "Coördineer teams, plan routes en factureer per contract of per oproep.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  },
  {
    name: "Klusbedrijf",
    body: "Van kleine reparatie tot verbouwing — offertes, planning en facturen op één plek.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  },
  {
    name: "Schilders",
    body: "Bereken projecten snel, plan crews en factureer per fase of na oplevering.",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  },
  {
    name: "Dakdekkers",
    body: "Beheer projectoffertes, bestel materialen en factureer per fase van het werk.",
    image:
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80",
  },
];

function Industries() {
  return (
    <section id="industries" className="py-20 sm:py-24">
      <div className="flex flex-col gap-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4">
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Voor vakmensen en servicebedrijven.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Of je als ZZP&apos;er solo werkt of een team aanstuurt — Fixa past
            zich aan jouw werkwijze aan.
          </p>
        </div>
        <IndustriesCarousel cards={industryCards} />
      </div>
    </section>
  );
}

function Referrals() {
  return (
    <section id="referrals" className="py-20 sm:py-24">
      <div className="flex flex-col gap-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4">
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Vakmensen aan het woord.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Lees waarom collega&apos;s overstapten en wat het hun bedrijf
            oplevert.
          </p>
        </div>
        <ReferralsCarousel />
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-2xl border border-border bg-foreground p-12 text-center text-background">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Wees een van de eersten die Fixa proberen.
        </h2>
        <p className="max-w-xl text-background/80">
          We bouwen Fixa in het open, samen met een kleine groep pilotklanten.
          Start je gratis proefperiode of neem contact op om mee te bouwen.
        </p>
        <AuthDialog>
          <Button size="lg" variant="secondary" className="rounded-full">
            Gratis proberen
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </AuthDialog>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} Fixa</span>
        <div className="flex items-center gap-6">
          <Link href="/plan" className="hover:text-foreground">
            Plan
          </Link>
          <a href="#features" className="hover:text-foreground">
            Functies
          </a>
          <a href="#workflow" className="hover:text-foreground">
            Hoe het werkt
          </a>
        </div>
      </div>
    </footer>
  );
}

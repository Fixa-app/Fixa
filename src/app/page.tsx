import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { IndustriesCarousel } from "@/components/industries-carousel";
import { ProductAccordion } from "@/components/product-accordion";
import {
  AIPlanningMockup,
  AIQuoteMockup,
  AIReplyMockup,
} from "@/components/ai-mockups";
import {
  OnlineIntakesMockup,
  PlanningMockup,
  RapportenMockup,
} from "@/components/product-mockups";
import { ReferralsCards } from "@/components/referrals-cards";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Product />
        <Industries />
        <AI />
        <Referrals />
        <WhyFixa />
        <CTABand />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="-mt-[72px] px-4">
      <div className="relative mx-auto min-h-[600px] w-full max-w-[1920px] overflow-hidden rounded-3xl sm:min-h-[680px]">
        <Image
          src="https://plus.unsplash.com/premium_photo-1663133630972-d9b620dfea27?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1536px] flex-col px-6 pt-[160px] pb-16 sm:pb-20 md:justify-center">
          <div className="flex max-w-2xl flex-col items-start gap-8 text-left text-white">
            <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Minder papierwerk,
              <br />
              meer vakwerk.
            </h1>
            <p className="max-w-lg text-lg text-white/85 sm:text-xl">
              Fixa verbindt op slimme wijze je dagelijkse werk met je
              administratie, zodat je soepeler kunt werken en met vertrouwen
              kunt groeien.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AuthDialog>
                <Button className="h-12 rounded-xl px-6 text-base font-bold">
                  Aan de slag
                </Button>
              </AuthDialog>
              <Button
                variant="outline"
                className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                nativeButton={false}
                render={<a href="#contact" />}
              >
                Boek een demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Product() {
  return (
    <section id="product" className="px-4 pt-8 pb-20 sm:pt-10 sm:pb-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5">
        <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
          Eén systeem, van aanvraag tot betaling.
        </h2>
        <ProductAccordion />
      </div>
    </section>
  );
}

const aiCards = [
  {
    title: "Offertes in een minuut",
    body: "AI leest je intake-notities en stelt direct een complete offerte op — line items, prijzen en BTW al ingevuld.",
    Mockup: AIQuoteMockup,
  },
  {
    title: "Slimme klantantwoorden",
    body: "AI vat klantgesprekken samen en stelt professionele reacties voor. Jij bevestigt met één klik.",
    Mockup: AIReplyMockup,
  },
  {
    title: "Routes & planning",
    body: "AI plant jobs op basis van locatie, vaardigheden en historie. Minder rijden, meer werk.",
    Mockup: AIPlanningMockup,
  },
];

function AI() {
  return (
    <section id="ai" className="px-4 py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-10 px-5">
        <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
          Hoe AI je werk versimpelt.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {aiCards.map(({ title, body, Mockup }) => (
            <article
              key={title}
              className="flex flex-col gap-6 rounded-3xl bg-[#EAE9E3] p-6 md:p-8"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-base text-muted-foreground">{body}</p>
              </div>
              <div className="flex aspect-[4/3] items-center justify-center">
                <Mockup />
              </div>
            </article>
          ))}
        </div>
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
      <IndustriesCarousel
        cards={industryCards}
        headerContent={
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Voor vakmensen en servicebedrijven.
          </h2>
        }
      />
    </section>
  );
}

function Referrals() {
  return (
    <section id="referrals" className="py-20 sm:py-24">
      <div className="flex flex-col gap-10">
        <div className="px-4">
          <div className="mx-auto w-full max-w-[1536px] px-5">
            <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
              Vakmensen aan het woord.
            </h2>
          </div>
        </div>
        <ReferralsCards />
      </div>
    </section>
  );
}

const whyFixaCards = [
  {
    title: "Betere aanvragen",
    body: "Klanten dienen aanvragen 24/7 in via je website of agenda. Geen heen-en-weer over beschikbaarheid — alle info direct in je systeem.",
    features: [
      { name: "Online aanvragen", href: "#" },
      { name: "Offertes", href: "#" },
    ],
    Mockup: OnlineIntakesMockup,
  },
  {
    title: "Slimmer werken",
    body: "Plan, dispatch en stuur je crews aan vanaf één plek. Geen losse spreadsheets of WhatsApp-groepen meer.",
    features: [
      { name: "Planning", href: "#" },
      { name: "Schedule", href: "#" },
    ],
    Mockup: PlanningMockup,
  },
  {
    title: "Meer winst",
    body: "Sneller factureren, sneller betaald krijgen, en zien wat je bedrijf oplevert — in één overzicht.",
    features: [
      { name: "Betalingen", href: "#" },
      { name: "Rapporten", href: "#" },
    ],
    Mockup: RapportenMockup,
  },
];

function WhyFixa() {
  return (
    <section id="why-fixa" className="px-4 py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-10 px-5">
        <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
          Waarom vakmensen kiezen voor Fixa.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {whyFixaCards.map(({ title, body, features, Mockup }) => (
            <article
              key={title}
              className="flex flex-col gap-6 rounded-3xl bg-[#EAE9E3] p-6 md:p-8"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-base text-muted-foreground">{body}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                  {features.map((f) => (
                    <Link
                      key={f.name}
                      href={f.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
                    >
                      {f.name}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Mockup />
              </div>
            </article>
          ))}
        </div>
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

const footerColumns: { title: string; links: { name: string; href: string }[] }[] =
  [
    {
      title: "Bedrijfstypen",
      links: [
        { name: "Loodgieters", href: "#" },
        { name: "Elektriciens", href: "#" },
        { name: "CV & klimaat", href: "#" },
        { name: "Hoveniers", href: "#" },
        { name: "Schoonmaak", href: "#" },
        { name: "Klusbedrijf", href: "#" },
        { name: "Schilders", href: "#" },
        { name: "Dakdekkers", href: "#" },
      ],
    },
    {
      title: "Features",
      links: [
        { name: "Online aanvragen", href: "#" },
        { name: "Offertes", href: "#" },
        { name: "Planning", href: "#" },
        { name: "Schedule", href: "#" },
        { name: "Betalingen", href: "#" },
        { name: "Rapporten", href: "#" },
        { name: "Fixa Assist AI", href: "#" },
      ],
    },
    {
      title: "Bedrijf",
      links: [
        { name: "Over", href: "#" },
        { name: "Prijzen", href: "/pricing" },
        { name: "Blog", href: "#" },
        { name: "Carrières", href: "#" },
      ],
    },
  ];

function SiteFooter() {
  return (
    <footer className="px-4 pb-4">
      <div
        className="relative mx-auto w-full max-w-[1920px] overflow-hidden rounded-3xl text-ink-foreground"
        style={{ backgroundColor: "#2F203C" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 70% at 95% 55%, #9C2D05 0%, transparent 55%), radial-gradient(ellipse 65% 85% at 55% 45%, #0D424E 0%, transparent 70%)",
          }}
        />
        <div className="relative flex w-full flex-col gap-16 px-5 py-16 md:py-20">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" aria-label="Fixa" className="inline-flex">
                <Image
                  src="/fixa-logo.svg"
                  alt="Fixa"
                  width={80}
                  height={80}
                  className="h-18 w-auto invert"
                />
              </Link>
            </div>
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold tracking-wide text-primary-dark-surface">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-foreground/85 transition-colors hover:text-ink-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-8 text-sm text-ink-foreground/60 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Fixa B.V.</span>
          <button
            type="button"
            className="transition-colors hover:text-ink-foreground"
          >
            Cookie-instellingen
          </button>
        </div>
        </div>
      </div>
    </footer>
  );
}

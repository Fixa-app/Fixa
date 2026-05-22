import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  FileText,
  Inbox,
  Receipt,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Industries />
        <Features />
        <Workflow />
        <CTABand />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="-mt-[88px] px-4">
      <div className="relative min-h-[720px] overflow-hidden rounded-3xl px-6 pt-[200px] pb-24 sm:min-h-[800px] sm:pb-32">
        <Image
          src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=2400&q=80"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) calc(100vw - 32px), 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center text-white">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
            Pre-launch
          </span>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl">
            Minder papierwerk,
            <br />
            meer vakwerk.
          </h1>
          <p className="max-w-2xl text-lg text-white/85 sm:text-xl">
            Fixa brengt aanvragen, intakes, offertes, werk en facturen samen in
            één voorspelbare flow — zodat je meer tijd hebt voor je vak en
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
      </div>
    </section>
  );
}

const features = [
  {
    icon: Inbox,
    title: "Vang elke aanvraag op",
    body: "Online formulieren, handmatige invoer of self-service via de Klanthub. Niets glipt door je vingers.",
  },
  {
    icon: Calendar,
    title: "Plan intakes",
    body: "Stel tijden voor, krijg bevestiging en kom voorbereid ter plaatse aan.",
  },
  {
    icon: FileText,
    title: "Stuur offertes die werken",
    body: "Interactieve offertes met upsell-regels. Klanten accepteren, weigeren of vragen aanpassingen in één klik.",
  },
  {
    icon: Wrench,
    title: "Voer het werk uit",
    body: "Bestel materialen, stem af met collega's en deel de planning met de klant — allemaal op één plek.",
  },
  {
    icon: Receipt,
    title: "Factureer en word betaald",
    body: "Deelbetalingen, automatische herinneringen en een betaalstatus die realtime bijwerkt.",
  },
  {
    icon: Users,
    title: "Klanthub",
    body: "Je klanten zien wat er speelt en wanneer — zonder dat jij hoeft te bellen, sms'en of mailen.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="border-t border-border bg-muted/20 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-display font-medium text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Eén plek voor alles tussen het telefoontje en de betaling.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Fixa vervangt de mailtjes, spreadsheets en notitieboekjes waarmee
            vakbedrijven nu hun werk bijhouden.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6"
            >
              <f.icon className="size-6 text-foreground/80" />
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
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
    <section id="workflow" className="px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
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
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80",
  },
  {
    name: "Elektriciens",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  },
  {
    name: "CV & klimaat",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80",
  },
  {
    name: "Hoveniers",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    name: "Schoonmaak",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  },
  {
    name: "Klusbedrijf",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  },
  {
    name: "Schilders",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  },
  {
    name: "Dakdekkers",
    image:
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80",
  },
];

function Industries() {
  return (
    <section
      id="industries"
      className="border-t border-border bg-muted/20 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-display font-medium text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Voor welke vakbedrijven?
          </h2>
          <p className="text-muted-foreground">
            Gebouwd voor iedereen die ter plaatse komt en zelf offertes,
            planning en facturen regelt.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {industryCards.map((industry) => (
            <a
              key={industry.name}
              href="#features"
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl transition-transform hover:scale-[1.02]"
            >
              <Image
                src={industry.image}
                alt={industry.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between text-lg font-semibold text-white">
                <span>{industry.name}</span>
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
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

function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
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

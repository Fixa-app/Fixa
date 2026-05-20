import {
  ArrowRight,
  Calendar,
  FileText,
  Inbox,
  Receipt,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Features />
        <Workflow />
        <Industries />
        <CTABand />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Pre-launch
        </span>
        <h1 className="font-display font-medium text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          Run je vakbedrijf vanuit één workflow.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Fixa brengt aanvragen, intakes, offertes, werk en facturen samen in
          één voorspelbare flow — zodat je meer tijd hebt voor je vak en minder
          voor administratie.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AuthDialog>
            <Button size="lg" className="rounded-full">
              Gratis proberen
            </Button>
          </AuthDialog>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full"
            nativeButton={false}
            render={<a href="#workflow" />}
          >
            Bekijk hoe het werkt
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Gemaakt voor loodgieters, elektriciens, klussers en alle vakmensen
          die ter plaatse komen.
        </p>
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

const industries = [
  "Loodgieters",
  "Elektriciens",
  "CV & klimaat",
  "Hoveniers",
  "Schoonmaak",
  "Klusbedrijf",
  "Schilders",
  "Dakdekkers",
];

function Industries() {
  return (
    <section
      id="industries"
      className="border-t border-border bg-muted/20 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Gemaakt voor vakbedrijven die ter plaatse komen.
        </h2>
        <ul className="flex flex-wrap justify-center gap-3 text-sm">
          {industries.map((industry) => (
            <li
              key={industry}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-foreground"
            >
              {industry}
            </li>
          ))}
        </ul>
        <p className="max-w-xl text-muted-foreground">
          Bestaat je dag uit offertes, bezoeken en facturen? Dan is Fixa er
          voor jou.
        </p>
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

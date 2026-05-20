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
        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          Run your trade business from one workflow.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Fixa turns requests, intakes, quotes, jobs, and invoices into a
          single, predictable flow — so you spend more time on the tools and
          less time on admin.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AuthDialog>
            <Button size="lg" className="rounded-full">
              Start free trial
            </Button>
          </AuthDialog>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full"
            nativeButton={false}
            render={<a href="#workflow" />}
          >
            See how it works
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Built for plumbers, electricians, handymen, and the trades that show
          up on site.
        </p>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Inbox,
    title: "Capture every request",
    body: "Online forms, manual entry, or self-service through the Client Hub. Nothing slips through the cracks.",
  },
  {
    icon: Calendar,
    title: "Schedule intakes",
    body: "Propose timeslots, get them confirmed, and arrive on site with everything you need.",
  },
  {
    icon: FileText,
    title: "Send quotes that close",
    body: "Interactive quotes with upsell line items. Clients accept, decline, or request changes in one click.",
  },
  {
    icon: Wrench,
    title: "Run the job",
    body: "Order third-party material, align co-workers, share the timeslot with the client — all in one place.",
  },
  {
    icon: Receipt,
    title: "Invoice and get paid",
    body: "Fractional payments, automated reminders, and a paid status that updates in real time.",
  },
  {
    icon: Users,
    title: "Client Hub",
    body: "Your clients see what is happening and when — without you having to call, text, or email.",
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
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            One place for everything between the call and the cash.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Fixa replaces the email threads, spreadsheets, and notebooks trades
            use to track work today.
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
  { name: "Request", body: "Capture work from three channels." },
  {
    name: "Intake",
    body: "Decide if a visit is needed. Gather what's required to quote.",
  },
  { name: "Quote", body: "Compose, share, iterate — until accepted." },
  { name: "Job", body: "Schedule, dispatch, execute." },
  { name: "Invoice", body: "Bill, remind, get paid." },
];

function Workflow() {
  return (
    <section id="workflow" className="px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            From first call to final invoice.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            One workflow that mirrors how trade work actually moves.
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
  "Plumbing",
  "Electrical",
  "HVAC",
  "Landscaping",
  "Cleaning",
  "Handyman",
  "Painting",
  "Roofing",
];

function Industries() {
  return (
    <section
      id="industries"
      className="border-t border-border bg-muted/20 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for the trades that show up on site.
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
          If your day is a mix of quotes, visits, and invoices, Fixa is for you.
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
          Be one of the first to try Fixa.
        </h2>
        <p className="max-w-xl text-background/80">
          We&apos;re building Fixa in the open with a small group of pilot
          customers. Start your free trial, or get in touch to help shape it.
        </p>
        <AuthDialog>
          <Button size="lg" variant="secondary" className="rounded-full">
            Start free trial
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
            Features
          </a>
          <a href="#workflow" className="hover:text-foreground">
            How it works
          </a>
        </div>
      </div>
    </footer>
  );
}

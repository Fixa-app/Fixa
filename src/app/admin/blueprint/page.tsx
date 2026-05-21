import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Status = "empty" | "drafting" | "ready";

const statusVariant: Record<Status, "secondary" | "default"> = {
  empty: "secondary",
  drafting: "secondary",
  ready: "default",
};

export default function BlueprintPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-16">
      <PageHeader />

      <Section
        eyebrow="01"
        title="Vision"
        description="The long-term ambition. Where Fixa wants to be in three years."
        status="empty"
        prompts={[
          "What category do we want to own?",
          "What does success look like in absolute terms — customers, ARR, geography?",
          "What's the one-sentence pitch we want every customer, investor, and hire to repeat?",
        ]}
      />

      <Section
        eyebrow="02"
        title="Target customer"
        description="Who specifically gets the most value out of Fixa from day one."
        status="empty"
        prompts={[
          "Which trades first? Plumbers, electricians, HVAC, handyman, all of the above?",
          "Solo operator, 2–5 person team, or larger crews?",
          "Geography — Netherlands only, EU, broader?",
          "Annual revenue / number of jobs per month — what's the cut-off?",
          "What do they call themselves: ZZP'er, vakman, klusbedrijf, MKB?",
        ]}
      />

      <Section
        eyebrow="03"
        title="Problem"
        description="What is specifically broken about how trades manage their work today."
        status="empty"
        prompts={[
          "What does a day in the life look like today (tools, paperwork, friction)?",
          "What costs them the most time? The most revenue?",
          "Where do existing tools (Jobber, Workiz, paper, WhatsApp) fall short?",
          "Why hasn't anyone solved this well already?",
        ]}
      />

      <Section
        eyebrow="04"
        title="Solution"
        description="Fixa's approach. Not the feature list — the core insight that makes us different."
        status="empty"
        prompts={[
          "What's the one thing we do differently from Jobber, Workiz, ServiceTitan?",
          "Is Assist AI a feature, a wrapper, or the whole product?",
          "Are we starting top-down (full ops) or wedge-first (e.g., just quoting)?",
          "What's the smallest version of Fixa that still delivers the core insight?",
        ]}
      />

      <Section
        eyebrow="05"
        title="Product principles"
        description="The rules we apply when making product decisions. Cited in code reviews and design discussions."
        status="empty"
        prompts={[
          "Mobile-first or desktop-first? Tradespeople work on phones in vans.",
          "How much manual work do we let users do vs. automate via AI?",
          "Do we optimize for solo operators or teams? Constraints differ.",
          "How opinionated is the workflow vs. how customizable?",
        ]}
      />

      <Section
        eyebrow="06"
        title="Scope by version"
        description="What lands in v1, v2, v3, and later. Stage-level breakdown lives in the workflow doc."
        status="drafting"
      >
        <Card>
          <CardContent className="flex flex-col gap-3 pt-6 text-sm">
            <p>
              Stage-level scope (Request → Intake → Quote → Job → Invoice) is
              already tagged v1/v2/v3/later in{" "}
              <Link
                href="/plan/workflow"
                className="font-medium underline underline-offset-2"
              >
                the workflow doc
              </Link>
              . When sections in this blueprint are written, they should
              reference (not duplicate) those tags.
            </p>
            <p className="text-muted-foreground">
              Top-level version theme summary still needs writing — what is the
              defining promise of v1 in one sentence? Of v2?
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section
        eyebrow="07"
        title="Data model"
        description="Core entities and how they relate. The thing we work out before writing the first migration."
        status="empty"
        prompts={[
          "Entities: client, request, quote, job, invoice, payment, user, team, organisation, ...",
          "What's the natural primary identifier per entity (uuid, slug, etc.)?",
          "Multi-tenancy: row-level via org_id, or schema-per-tenant?",
          "Soft-delete or hard-delete? Audit log on what?",
          "Where do attachments live (Supabase Storage vs. external)?",
        ]}
      />

      <Section
        eyebrow="08"
        title="Integrations"
        description="External systems Fixa connects to. Each one is a build decision and an ongoing maintenance cost."
        status="empty"
        prompts={[
          "Payments: iDEAL, Mollie, Stripe, what's the default?",
          "Accounting: Moneybird, Exact, e-Boekhouden, AFAS?",
          "Calendar: Google Calendar, Outlook, both?",
          "Communication: SMS provider, WhatsApp Business, email (Resend)?",
          "Lead sources: Google Reserve, website forms, what else?",
        ]}
      />

      <Section
        eyebrow="09"
        title="Open questions"
        description="Things we haven't decided. Park assumptions here so they do not get lost."
        status="empty"
        prompts={[
          "Pricing model — per-seat, per-job, flat?",
          "Free tier yes/no?",
          "Self-serve vs. sales-assisted onboarding?",
          "How do we handle dispute resolution between professional and client?",
          "Do we ever store payment cards directly, or always tokenize via provider?",
        ]}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-col gap-3 pb-12">
      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Fixa
      </p>
      <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
        Blueprint
      </h1>
      <p className="max-w-2xl text-base text-muted-foreground">
        The source of truth for what Fixa is, who it&apos;s for, and how it
        works. We elaborate this before we build — every table, every screen,
        every integration should trace back to a decision documented here.
      </p>
    </header>
  );
}

function Section({
  eyebrow,
  title,
  description,
  status,
  prompts,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status: Status;
  prompts?: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="grid gap-10 border-t border-border py-16 sm:grid-cols-[220px_1fr] sm:gap-16">
      <div className="flex flex-col items-start gap-3">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-medium tracking-tight">
          {title}
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
        <Badge variant={statusVariant[status]} className="mt-1">
          {status}
        </Badge>
      </div>
      <div className="flex flex-col gap-4">
        {children ?? <PromptsCard prompts={prompts ?? []} />}
      </div>
    </section>
  );
}

function PromptsCard({ prompts }: { prompts: string[] }) {
  if (prompts.length === 0) return null;
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Prompts to elaborate
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-1.5 text-sm text-muted-foreground">
          {prompts.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

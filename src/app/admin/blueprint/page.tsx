import { Fragment } from "react";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CalendarCheck,
  ClipboardList,
  FileText,
  Globe,
  Inbox,
  type LucideIcon,
  PenLine,
  Receipt,
  Repeat,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

type Surface = "Pro" | "Client" | "Online";

type CardData = {
  name: string;
  icon: LucideIcon;
  surface: Surface;
  description: string;
  statuses?: string[];
};

/* --------------------------- Cards --------------------------- */

const newRequestsPro: CardData = {
  name: "New requests",
  icon: PenLine,
  surface: "Pro",
  description: "Quick-add a new request manually from inside Fixa.",
};

const websitePro: CardData = {
  name: "Website",
  icon: Globe,
  surface: "Pro",
  description: "Public form on the pro's website that creates a new request.",
};

const requestsPro: CardData = {
  name: "Requests",
  icon: Inbox,
  surface: "Pro",
  description: "Triage incoming work. Decide whether to quote.",
  statuses: ["New", "Intake scheduled", "Intake done", "Overdue"],
};

const intakesPro: CardData = {
  name: "Intakes",
  icon: CalendarCheck,
  surface: "Pro",
  description: "On-location assessments before quoting.",
  statuses: ["Proposed", "Confirmed", "Completed", "Refused"],
};

const quotesPro: CardData = {
  name: "Quotes",
  icon: FileText,
  surface: "Pro",
  description: "Compose, share, iterate until accepted.",
  statuses: ["Draft", "Waiting for response", "Change requested", "Approved"],
};

const jobsPro: CardData = {
  name: "Jobs",
  icon: Wrench,
  surface: "Pro",
  description: "Schedule, dispatch, execute the accepted work.",
  statuses: [
    "Unscheduled",
    "In progress",
    "Late",
    "Action required",
    "Completed",
  ],
};

const schedule: CardData = {
  name: "Schedule",
  icon: Calendar,
  surface: "Pro",
  description: "Central calendar for intakes and jobs.",
};

const invoicesPro: CardData = {
  name: "Invoices",
  icon: Receipt,
  surface: "Pro",
  description: "Bill, remind, get paid, close the loop.",
  statuses: ["Draft", "Sent", "Late", "Paid"],
};

const servicePlansPro: CardData = {
  name: "Service plans",
  icon: Repeat,
  surface: "Pro",
  description:
    "Recurring service contracts — maintenance, monthly checks, subscriptions.",
  statuses: ["Draft", "Active", "Paused", "Cancelled"],
};

const reportsPro: CardData = {
  name: "Reports",
  icon: BarChart3,
  surface: "Pro",
  description:
    "Revenue, profitability, top customers, time-to-paid analytics.",
};

const clientsPro: CardData = {
  name: "Clients",
  icon: Users,
  surface: "Pro",
  description:
    "Customer records — contacts, history of requests/quotes/jobs/invoices, lifetime value.",
  statuses: ["Active", "Inactive", "VIP", "Archived"],
};

const newRequestsClient: CardData = {
  name: "New requests",
  icon: PenLine,
  surface: "Client",
  description: "Client submits a new request from their portal.",
};

const projectsClient: CardData = {
  name: "Projects",
  icon: ClipboardList,
  surface: "Client",
  description:
    "One timeline per engagement. Covers everything from request to paid invoice, with stage updates and actions in one place.",
  statuses: [
    "Request",
    "Quote",
    "Scheduled",
    "In progress",
    "Invoiced",
    "Paid",
  ],
};

const channelsOnline: CardData = {
  name: "Channels",
  icon: Workflow,
  surface: "Online",
  description: "External integrations — Google Reserve, marketplace, ChatGPT.",
};

/* --------------------------- Layout constants --------------------------- */

// 9 columns: 5 card columns (fixed) + 4 arrow gap columns (narrow)
//   col 1 = New requests
//   col 3 = Requests / Intakes (Better leads)
//   col 5 = Quotes (More work)
//   col 7 = Jobs / Schedule (Work smarter)
//   col 9 = Invoices (More profits)
const gridTemplate = "repeat(5, minmax(220px, 1fr))";
const gridTemplateWithArrows =
  "minmax(220px, 1fr) 20px minmax(220px, 1fr) 20px minmax(220px, 1fr) 20px minmax(220px, 1fr) 20px minmax(220px, 1fr)";

const CARD_MIN_HEIGHT = 150; // px; chosen so the tallest card content fits without scroll

/* --------------------------- Page --------------------------- */

export default function BlueprintPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-16">
      <header className="flex flex-col gap-3 pb-16">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Fixa
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
          Blueprint
        </h1>
      </header>

      <div className="-mx-6 overflow-x-auto px-6">
        <div className="flex min-w-[1180px] flex-col gap-2">
          <PhaseHeaders />
          <ProSection />
          <ClientSection />
          <OnlineSection />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Sections --------------------------- */

function PhaseHeaders() {
  return (
    <div
      className="grid gap-x-2"
      style={{ gridTemplateColumns: gridTemplateWithArrows }}
    >
      <div className="col-span-3">
        <Eyebrow>Better leads</Eyebrow>
      </div>
      <div />
      <Eyebrow>More work</Eyebrow>
      <div />
      <Eyebrow>Work smarter</Eyebrow>
      <div />
      <Eyebrow>More profits</Eyebrow>
    </div>
  );
}

function ProSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Pro dashboard</SurfaceDivider>
      <div
        className="grid items-start gap-x-2 gap-y-2"
        style={{ gridTemplateColumns: gridTemplateWithArrows }}
      >
        {/* Sub-row 1: primary entities + horizontal arrows */}
        <CardItem card={newRequestsPro} />
        <ConvergingConnector />
        <CardItem card={requestsPro} />
        <HorizontalArrow />
        <CardItem card={quotesPro} />
        <HorizontalArrow />
        <CardItem card={jobsPro} />
        <HorizontalArrow />
        <CardItem card={invoicesPro} />

        {/* Sub-row 2: below-primary (col 2 is occupied by the spanning connector) */}
        <CardItem card={websitePro} />
        <CardItem card={intakesPro} />
        <Empty />
        <CardItem card={servicePlansPro} />
        <Empty />
        <CardItem card={schedule} />
        <Empty />
        <CardItem card={reportsPro} />

        {/* Sub-row 3: deeper-stack cards */}
        <Empty />
        <Empty />
        <CardItem card={clientsPro} />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
      </div>
    </section>
  );
}

function ClientSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Client hub</SurfaceDivider>
      <div
        className="grid items-start gap-x-2 gap-y-2"
        style={{ gridTemplateColumns: gridTemplateWithArrows }}
      >
        <CardItem card={newRequestsClient} />
        <HorizontalArrow />
        <div className="col-span-7">
          <CardItem card={projectsClient} />
        </div>
      </div>
    </section>
  );
}

function OnlineSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Online</SurfaceDivider>
      <div
        className="grid items-start gap-x-2 gap-y-2"
        style={{ gridTemplateColumns: gridTemplateWithArrows }}
      >
        <CardItem card={channelsOnline} />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
      </div>
    </section>
  );
}

/* --------------------------- Building blocks --------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function SurfaceDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pt-6">
      <span className="text-xs font-bold tracking-widest text-foreground uppercase">
        {children}
      </span>
      <div className="h-px bg-border" />
    </div>
  );
}

function Empty() {
  return <div aria-hidden />;
}

function HorizontalArrow() {
  return (
    <div className="flex items-center justify-center self-center">
      <ArrowRight
        aria-hidden
        className="size-4 text-muted-foreground"
        strokeWidth={1.5}
      />
    </div>
  );
}

/**
 * Spans sub-rows 1 + 2 in column 2 of the Pro section.
 * Draws a Y-shape that merges New requests (sub-row 1) and Website (sub-row 2)
 * into a single arrow exiting at sub-row 1's vertical center toward Requests.
 *
 * The percentages assume both sub-rows have similar height (CARD_MIN_HEIGHT)
 * and small gap-y-2 between them. Adjust if rows grow significantly.
 */
function ConvergingConnector() {
  return (
    <div
      aria-hidden
      className="relative"
      style={{ gridRow: "1 / span 2", gridColumn: 2 }}
    >
      <div className="absolute top-[24%] bottom-[24%] left-1/2 w-px -translate-x-1/2 bg-border" />
      <div className="absolute top-[24%] left-1/2 right-1 h-px bg-border" />
      <ArrowRight
        className="absolute top-[24%] right-0 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.5}
      />
    </div>
  );
}

function CardItem({ card }: { card: CardData }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-md border border-border bg-card p-4"
      style={{ minHeight: CARD_MIN_HEIGHT }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <card.icon className="size-4 text-foreground/70" strokeWidth={2} />
          <span className="text-sm font-semibold">{card.name}</span>
        </div>
        <SurfaceBadge surface={card.surface} />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {card.description}
      </p>
      {card.statuses && card.statuses.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {card.statuses.map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const surfaceStyles: Record<Surface, string> = {
  Pro: "border-blue-200 bg-blue-50 text-blue-700",
  Client: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Online: "border-slate-300 bg-slate-100 text-slate-600",
};

function SurfaceBadge({ surface }: { surface: Surface }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap uppercase ${surfaceStyles[surface]}`}
    >
      {surface}
    </span>
  );
}

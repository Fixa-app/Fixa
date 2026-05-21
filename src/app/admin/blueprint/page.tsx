import { Fragment } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  FileText,
  Globe,
  Inbox,
  type LucideIcon,
  PenLine,
  Receipt,
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

const manual: CardData = {
  name: "Manual",
  icon: PenLine,
  surface: "Pro",
  description: "Professional creates the request inside Fixa.",
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

const clientRequest: CardData = {
  name: "Client request",
  icon: Users,
  surface: "Client",
  description: "Client submits a new request from their portal.",
};

const requestsClient: CardData = {
  name: "Requests",
  icon: Inbox,
  surface: "Client",
  description: "Client tracks submitted requests and current status.",
  statuses: ["Submitted", "Intake scheduled", "Quoted"],
};

const quotesClient: CardData = {
  name: "Quotes",
  icon: FileText,
  surface: "Client",
  description: "Client reviews and responds to quotes.",
  statuses: ["Pending", "Reviewing", "Accepted", "Declined"],
};

const jobsClient: CardData = {
  name: "Jobs",
  icon: Wrench,
  surface: "Client",
  description: "Client sees scheduled work and live updates.",
  statuses: ["Upcoming", "In progress", "Completed"],
};

const invoicesClient: CardData = {
  name: "Invoices",
  icon: Receipt,
  surface: "Client",
  description: "Client views and pays invoices.",
  statuses: ["Unpaid", "Paid"],
};

const website: CardData = {
  name: "Website",
  icon: Globe,
  surface: "Online",
  description: "Public form on the professional's website.",
};

const externalChannels: CardData = {
  name: "Channels",
  icon: Workflow,
  surface: "Online",
  description: "External integrations — Google Reserve, marketplace, ChatGPT.",
};

/* --------------------------- Layout constants --------------------------- */

const phaseLabels = [
  "Better leads",
  "More work",
  "Work smarter",
  "More profits",
];

// 7 columns: 4 phases (flexible width) + 3 arrow columns (fixed)
const gridTemplate =
  "minmax(0,1fr) 28px minmax(0,1fr) 28px minmax(0,1fr) 28px minmax(0,1fr)";

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

      <div className="flex flex-col gap-2">
        <PhaseHeaders />
        <ProSection />
        <ClientSection />
        <OnlineSection />
      </div>
    </div>
  );
}

/* --------------------------- Sections --------------------------- */

function PhaseHeaders() {
  return (
    <div
      className="grid gap-x-4"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {phaseLabels.map((label, i) => (
        <Fragment key={label}>
          <Eyebrow>{label}</Eyebrow>
          {i < phaseLabels.length - 1 && <div />}
        </Fragment>
      ))}
    </div>
  );
}

function ProSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Pro dashboard</SurfaceDivider>
      <div
        className="grid items-start gap-x-4 gap-y-2"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {/* Sub-row 1: above primary */}
        <CardItem card={manual} />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />

        {/* Sub-row 2: primary + horizontal arrows */}
        <CardItem card={requestsPro} />
        <HorizontalArrow />
        <CardItem card={quotesPro} />
        <HorizontalArrow />
        <CardItem card={jobsPro} />
        <HorizontalArrow />
        <CardItem card={invoicesPro} />

        {/* Sub-row 3: below primary */}
        <CardItem card={intakesPro} />
        <Empty />
        <Empty />
        <Empty />
        <CardItem card={schedule} />
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
        className="grid items-start gap-x-4 gap-y-2"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {/* Sub-row 1: above primary */}
        <CardItem card={clientRequest} />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />

        {/* Sub-row 2: primary + horizontal arrows */}
        <CardItem card={requestsClient} />
        <HorizontalArrow />
        <CardItem card={quotesClient} />
        <HorizontalArrow />
        <CardItem card={jobsClient} />
        <HorizontalArrow />
        <CardItem card={invoicesClient} />
      </div>
    </section>
  );
}

function OnlineSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Online</SurfaceDivider>
      <div
        className="grid items-start gap-x-4 gap-y-2"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <div className="flex flex-col gap-2">
          <CardItem card={website} />
          <CardItem card={externalChannels} />
        </div>
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

function CardItem({ card }: { card: CardData }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-4">
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

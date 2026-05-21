import { Fragment } from "react";
import {
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

// Pro dashboard
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

// Client hub
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

// Online
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

/* --------------------------- Board grid --------------------------- */

type Row = {
  label: string;
  cells: CardData[][];
};

const rows: Row[] = [
  {
    label: "Pro dashboard",
    cells: [
      [manual, requestsPro, intakesPro],
      [quotesPro],
      [jobsPro, schedule],
      [invoicesPro],
    ],
  },
  {
    label: "Client hub",
    cells: [
      [clientRequest, requestsClient],
      [quotesClient],
      [jobsClient],
      [invoicesClient],
    ],
  },
  {
    label: "Online",
    cells: [[website, externalChannels], [], [], []],
  },
];

const phaseLabels = [
  "Better leads",
  "More work",
  "Work smarter",
  "More profits",
];

/* --------------------------- Components --------------------------- */

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

      <Board />
    </div>
  );
}

function Board() {
  return (
    <div
      className="grid items-start gap-x-4 gap-y-10"
      style={{ gridTemplateColumns: "160px repeat(4, minmax(0, 1fr))" }}
    >
      <div />
      {phaseLabels.map((label) => (
        <Eyebrow key={label}>{label}</Eyebrow>
      ))}

      {rows.map((row, rowIdx) => (
        <Fragment key={row.label}>
          <RowLabel>{row.label}</RowLabel>
          {row.cells.map((cards, i) => (
            <GridCell key={`${rowIdx}-${i}`} cards={cards} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest text-foreground uppercase">
      {children}
    </p>
  );
}

function GridCell({ cards }: { cards: CardData[] }) {
  if (cards.length === 0) return <div />;
  return (
    <div className="flex flex-col gap-2">
      {cards.map((c) => (
        <CardItem key={c.name} card={c} />
      ))}
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

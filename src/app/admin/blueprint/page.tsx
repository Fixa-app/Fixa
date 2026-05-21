import { Fragment } from "react";
import {
  ArrowRight,
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
};

const entryChannels: CardData[] = [
  {
    name: "Manual",
    icon: PenLine,
    surface: "Pro",
    description: "Professional creates the request inside Fixa.",
  },
  {
    name: "Website",
    icon: Globe,
    surface: "Online",
    description: "Customer submits via the pro's website form.",
  },
  {
    name: "Client Hub",
    icon: Users,
    surface: "Client",
    description: "Existing client creates a new request from their portal.",
  },
  {
    name: "Channels",
    icon: Workflow,
    surface: "Online",
    description:
      "External integrations — Google Reserve, marketplace, ChatGPT.",
  },
];

type Phase = CardData & {
  category: string;
};

const requestPhase: Phase = {
  category: "Better leads",
  name: "Request",
  icon: Inbox,
  surface: "Pro",
  description:
    "Triage incoming work. Qualify, optional intake, decide to quote.",
};

const otherPhases: Phase[] = [
  {
    category: "More work",
    name: "Quote",
    icon: FileText,
    surface: "Pro",
    description: "Compose, share, iterate until accepted.",
  },
  {
    category: "Work smarter",
    name: "Job",
    icon: Wrench,
    surface: "Pro",
    description: "Schedule, dispatch, execute the accepted work.",
  },
  {
    category: "More profits",
    name: "Invoice",
    icon: Receipt,
    surface: "Pro",
    description: "Bill, remind, get paid, close the loop.",
  },
];

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
    <div className="flex items-stretch gap-3">
      <div className="flex flex-col gap-3">
        <Eyebrow>Better leads</Eyebrow>
        <div className="flex flex-1 items-stretch gap-2">
          <div className="flex w-[240px] flex-col gap-2">
            {entryChannels.map((ch) => (
              <CardItem key={ch.name} card={ch} dashRight />
            ))}
          </div>
          <Connector />
          <div className="flex items-center">
            <CardItem card={requestPhase} className="w-[240px]" />
          </div>
        </div>
      </div>

      {otherPhases.map((p) => (
        <Fragment key={p.name}>
          <ArrowBlock />
          <PhaseBlock phase={p} />
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

function PhaseBlock({ phase }: { phase: Phase }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{phase.category}</Eyebrow>
      <div className="flex flex-1 items-center">
        <CardItem card={phase} className="w-[240px]" />
      </div>
    </div>
  );
}

function ArrowBlock() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-4" />
      <div className="flex flex-1 items-center">
        <ArrowRight
          aria-hidden
          className="size-4 text-muted-foreground"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

function CardItem({
  card,
  className = "",
  dashRight = false,
}: {
  card: CardData;
  className?: string;
  dashRight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col gap-2 rounded-md border border-border bg-card p-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <card.icon
            className="size-4 text-foreground/70"
            strokeWidth={2}
          />
          <span className="text-sm font-semibold">{card.name}</span>
        </div>
        <SurfaceBadge surface={card.surface} />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {card.description}
      </p>
      {dashRight && (
        <div
          aria-hidden
          className="absolute top-1/2 -right-3 h-px w-4 -translate-y-1/2 bg-border"
        />
      )}
    </div>
  );
}

function Connector() {
  return (
    <div className="relative w-12 shrink-0">
      <div
        aria-hidden
        className="absolute top-[12%] bottom-[12%] left-1 border-l border-border"
      />
      <div
        aria-hidden
        className="absolute top-1/2 right-1 left-1 h-px -translate-y-1/2 bg-border"
      />
      <ArrowRight
        aria-hidden
        className="absolute top-1/2 right-0 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.5}
      />
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

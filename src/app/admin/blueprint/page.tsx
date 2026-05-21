import { Fragment } from "react";
import {
  ArrowRight,
  Globe,
  type LucideIcon,
  PenLine,
  Users,
  Workflow,
} from "lucide-react";

type Surface = "Pro" | "Client" | "Online";

type Card = {
  name: string;
  surface: Surface;
  description: string;
};

type EntryChannel = Card & {
  icon: LucideIcon;
};

const entryChannels: EntryChannel[] = [
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

type Phase = Card & {
  category: string;
};

const phases: Phase[] = [
  {
    category: "Better leads",
    name: "Request",
    surface: "Pro",
    description:
      "Triage incoming work. Qualify, optional intake, decide to quote.",
  },
  {
    category: "More work",
    name: "Quote",
    surface: "Pro",
    description: "Compose, share, iterate until accepted.",
  },
  {
    category: "Work smarter",
    name: "Job",
    surface: "Pro",
    description: "Schedule, dispatch, execute the accepted work.",
  },
  {
    category: "More profits",
    name: "Invoice",
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
    <div className="flex items-stretch gap-2">
      <div className="flex w-[260px] flex-col gap-3">
        {entryChannels.map((ch) => (
          <ChannelCard key={ch.name} channel={ch} />
        ))}
      </div>
      <Connector />
      <div className="flex flex-1 items-center">
        <PhasesGrid />
      </div>
    </div>
  );
}

function ChannelCard({ channel }: { channel: EntryChannel }) {
  return (
    <div className="relative flex flex-col gap-2 rounded-md border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <channel.icon
            className="size-4 text-foreground/70"
            strokeWidth={2}
          />
          <span className="text-sm font-semibold">{channel.name}</span>
        </div>
        <SurfaceBadge surface={channel.surface} />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {channel.description}
      </p>
      <div
        aria-hidden
        className="absolute top-1/2 -right-3 h-px w-4 -translate-y-1/2 bg-border"
      />
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

function PhasesGrid() {
  return (
    <div className="grid w-full grid-cols-4 gap-x-10 gap-y-3">
      {phases.map((p) => (
        <p
          key={`${p.name}-eyebrow`}
          className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
        >
          {p.category}
        </p>
      ))}
      {phases.map((phase, i) => (
        <Fragment key={`${phase.name}-card`}>
          <div className="relative flex flex-col gap-2 rounded-md border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold">{phase.name}</span>
              </div>
              <SurfaceBadge surface={phase.surface} />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {phase.description}
            </p>
            {i < phases.length - 1 && (
              <ArrowRight
                aria-hidden
                className="absolute top-1/2 -right-8 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.5}
              />
            )}
          </div>
        </Fragment>
      ))}
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

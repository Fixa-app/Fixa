import { Fragment } from "react";
import {
  ArrowRight,
  Globe,
  type LucideIcon,
  PenLine,
  Users,
  Workflow,
} from "lucide-react";

type EntryChannel = {
  name: string;
  icon: LucideIcon;
};

const entryChannels: EntryChannel[] = [
  { name: "Manual", icon: PenLine },
  { name: "Website", icon: Globe },
  { name: "Client Hub", icon: Users },
  { name: "Channels", icon: Workflow },
];

type Phase = {
  category: string;
  action: string;
};

const phases: Phase[] = [
  { category: "Better leads", action: "Request" },
  { category: "More work", action: "Quote" },
  { category: "Work smarter", action: "Job" },
  { category: "More profits", action: "Invoice" },
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
      <div className="flex w-[200px] flex-col gap-3">
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
    <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
      <channel.icon className="size-5 text-foreground/70" strokeWidth={2} />
      <span className="font-semibold">{channel.name}</span>
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
          key={`${p.action}-eyebrow`}
          className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
        >
          {p.category}
        </p>
      ))}
      {phases.map((phase, i) => (
        <Fragment key={`${phase.action}-card`}>
          <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="font-semibold">{phase.action}</span>
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

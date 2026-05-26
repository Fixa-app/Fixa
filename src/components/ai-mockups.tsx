import {
  CalendarCheck,
  Check,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";

function MockupShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center">{children}</div>
  );
}

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet-light px-2 py-0.5 text-[9px] font-semibold tracking-wider text-violet uppercase">
      <Sparkles className="size-2.5" />
      Assist AI
    </span>
  );
}

export function AIQuoteMockup() {
  return (
    <MockupShell>
      <div className="w-full max-w-[240px] rounded-xl bg-background p-4 shadow-xl ring-1 ring-foreground/5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Offerte #2034
          </span>
          <AiBadge />
        </div>
        <h5 className="mb-3 text-sm font-semibold tracking-tight">
          CV-ketel vervangen
        </h5>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-foreground">Vaillant ecoTEC ketel</span>
            <span className="font-medium">€ 1.250</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground">Installatie · 4u</span>
            <span className="font-medium">€ 280</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">BTW (21%)</span>
            <span className="text-muted-foreground">€ 321,30</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 text-sm font-bold tracking-tight">
            <span>Totaal</span>
            <span>€ 1.851,30</span>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-violet">
          <Sparkles className="mr-1 inline size-2.5" />
          Opgesteld vanuit intake-notities · 3 sec
        </div>
      </div>
    </MockupShell>
  );
}

export function AIReplyMockup() {
  return (
    <MockupShell>
      <div className="flex w-full max-w-[260px] flex-col gap-2">
        <div className="rounded-2xl rounded-bl-sm bg-background p-3 shadow-md ring-1 ring-foreground/5">
          <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground">
            <MessageSquare className="size-3" />
            Mevr. de Jong · 09:42
          </div>
          <p className="text-[11px] leading-snug text-foreground">
            Hoi! Kunnen jullie morgen rond 10 uur langskomen voor de lekkage?
          </p>
        </div>
        <div className="rounded-2xl bg-violet-light p-3 ring-1 ring-violet/30">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-violet">
              Voorgestelde reactie
            </span>
            <AiBadge />
          </div>
          <p className="text-[11px] leading-snug text-foreground">
            Goedemorgen! 10:00 past helaas niet, maar 11:30 wel. Schikt dat ook?
          </p>
          <div className="mt-2 flex gap-1.5">
            <button className="flex-1 rounded-md bg-primary py-1 text-[10px] font-semibold text-primary-foreground">
              Verstuur
            </button>
            <button className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-foreground">
              Aanpassen
            </button>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

export function AIPlanningMockup() {
  const days = ["Ma", "Di", "Wo", "Do", "Vr"];
  return (
    <MockupShell>
      <div className="w-full max-w-[260px] rounded-xl bg-background p-4 shadow-xl ring-1 ring-foreground/5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Week 49
          </span>
          <AiBadge />
        </div>
        <div className="mb-3 grid grid-cols-5 gap-1">
          {days.map((d, i) => (
            <div
              key={d}
              className="text-center text-[9px] font-semibold text-muted-foreground uppercase"
            >
              {d}
            </div>
          ))}
          {days.map((_, dayIdx) => (
            <div
              key={dayIdx}
              className="relative h-16 rounded-md bg-muted/40 p-0.5"
            >
              {dayIdx === 0 && (
                <div className="absolute inset-0.5 rounded bg-primary/80" />
              )}
              {dayIdx === 1 && (
                <div className="absolute inset-x-0.5 top-0.5 h-4 rounded bg-teal/70" />
              )}
              {dayIdx === 2 && (
                <>
                  <div className="absolute inset-x-0.5 top-0.5 h-5 rounded bg-primary/80" />
                  <div className="absolute inset-x-0.5 top-7 h-5 rounded border-2 border-dashed border-violet bg-violet-light" />
                </>
              )}
              {dayIdx === 3 && (
                <div className="absolute inset-x-0.5 top-2 bottom-2 rounded bg-teal/70" />
              )}
              {dayIdx === 4 && (
                <div className="absolute inset-x-0.5 bottom-0.5 h-6 rounded bg-primary-dark/80" />
              )}
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-violet/30 bg-violet-light p-2">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-3 shrink-0 text-violet" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-violet">
                AI-suggestie
              </span>
              <span className="flex items-center gap-1 text-[10px] leading-snug text-foreground">
                <MapPin className="size-2.5 text-muted-foreground" />
                Plan Visser-job op wo middag — 3 km vanaf vorige klus
              </span>
            </div>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

// Silence unused imports
void CalendarCheck;
void Check;

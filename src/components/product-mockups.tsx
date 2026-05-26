import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  TrendingUp,
  User,
} from "lucide-react";

function MockupShell({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center p-6 sm:p-10 ${bg}`}
    >
      {children}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-background p-5 shadow-xl ring-1 ring-foreground/5 ${className}`}
    >
      {children}
    </div>
  );
}

export function OnlineIntakesMockup() {
  return (
    <MockupShell bg="bg-gradient-to-br from-primary/15 to-primary/5">
      <Card className="w-full max-w-xs">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold tracking-tight">
            Plan een intake
          </h4>
          <Calendar className="size-4 text-muted-foreground" />
        </div>
        <div className="mb-2 text-xs text-muted-foreground">November 2026</div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
          {["M", "D", "W", "D", "V", "Z", "Z"].map((d, i) => (
            <span key={i} className="font-medium text-muted-foreground">
              {d}
            </span>
          ))}
          {Array.from({ length: 14 }).map((_, i) => {
            const day = i + 17;
            const isSelected = day === 28;
            return (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-md ${
                  isSelected
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="mt-3 border-t border-border pt-3">
          <div className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Vrije tijden
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {["9:00", "10:30", "13:00", "14:00", "15:30", "17:00"].map((t) => (
              <span
                key={t}
                className={`rounded-md border px-1 py-1 text-center text-[10px] font-medium ${
                  t === "14:00"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </MockupShell>
  );
}

export function OffertesMockup() {
  const lines = [
    { label: "Materiaal", price: "€ 450,00" },
    { label: "Arbeid (6u)", price: "€ 280,00" },
    { label: "Voorrijden", price: "€ 50,00" },
  ];
  return (
    <MockupShell bg="bg-gradient-to-br from-cream to-cream/40">
      <Card className="w-full max-w-xs">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Offerte #2034
            </div>
            <h4 className="text-sm font-semibold tracking-tight">
              CV-ketel vervangen
            </h4>
          </div>
          <FileText className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          {lines.map((l) => (
            <div key={l.label} className="flex items-center justify-between text-xs">
              <span className="text-foreground">{l.label}</span>
              <span className="font-medium text-foreground">{l.price}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">BTW (21%)</span>
              <span className="text-muted-foreground">€ 163,80</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight">Totaal</span>
              <span className="text-sm font-bold tracking-tight">€ 943,80</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-semibold text-foreground">
            <CheckCircle2 className="size-3" />
            Geopend
          </span>
          <span className="text-[10px] text-muted-foreground">2 uur geleden</span>
        </div>
      </Card>
    </MockupShell>
  );
}

export function PlanningMockup() {
  const days = ["Ma", "Di", "Wo", "Do", "Vr"];
  const jobs: { day: number; start: number; len: number; color: string; label: string }[] = [
    { day: 0, start: 0, len: 2, color: "bg-primary/80", label: "Visser" },
    { day: 1, start: 1, len: 3, color: "bg-mint/80", label: "Smit" },
    { day: 2, start: 0, len: 1, color: "bg-tangerine/80", label: "De Jong" },
    { day: 2, start: 2, len: 2, color: "bg-mint/70", label: "Bakker" },
    { day: 3, start: 1, len: 2, color: "bg-primary/80", label: "Visser" },
    { day: 4, start: 0, len: 3, color: "bg-tangerine/80", label: "Schoonmaak" },
  ];
  return (
    <MockupShell bg="bg-gradient-to-br from-primary/15 to-primary/5">
      <Card className="w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold tracking-tight">Week 48</h4>
          <Calendar className="size-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-5 gap-1">
          {days.map((d) => (
            <div
              key={d}
              className="mb-1 text-center text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
            >
              {d}
            </div>
          ))}
          {days.map((_, dayIdx) => (
            <div key={dayIdx} className="relative h-32 rounded-md bg-muted/40">
              {jobs
                .filter((j) => j.day === dayIdx)
                .map((j, i) => (
                  <div
                    key={i}
                    className={`absolute inset-x-0.5 truncate rounded px-1 py-0.5 text-[8px] font-semibold text-white ${j.color}`}
                    style={{
                      top: `${j.start * 25}%`,
                      height: `${j.len * 25}%`,
                    }}
                  >
                    {j.label}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </Card>
    </MockupShell>
  );
}

export function ScheduleMockup() {
  const slots = [
    {
      time: "08:30",
      title: "Intake Visser",
      meta: "Damstraat 12, Amsterdam",
      color: "border-l-primary",
    },
    {
      time: "10:00",
      title: "CV-ketel onderhoud",
      meta: "Crew: Mark & Joep",
      color: "border-l-mint",
    },
    {
      time: "13:30",
      title: "Lekkage badkamer",
      meta: "Crew: Mark",
      color: "border-l-tangerine",
    },
  ];
  return (
    <MockupShell bg="bg-gradient-to-br from-primary/10 to-primary/5">
      <Card className="w-full max-w-xs">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold tracking-tight">
            Vandaag — Di 28 nov
          </h4>
          <Clock className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          {slots.map((s) => (
            <div
              key={s.time}
              className={`flex gap-3 rounded-lg border-l-4 bg-muted/40 p-2.5 ${s.color}`}
            >
              <div className="text-[11px] font-semibold tracking-tight text-foreground">
                {s.time}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold text-foreground">
                  {s.title}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="size-2.5" />
                  {s.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </MockupShell>
  );
}

export function BetalingenMockup() {
  return (
    <MockupShell bg="bg-gradient-to-br from-mint/15 to-mint/5">
      <Card className="w-full max-w-xs">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Factuur F-2026-0184
            </div>
            <div className="text-2xl font-bold tracking-tight">€ 943,80</div>
          </div>
          <CreditCard className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-foreground">
              <User className="size-3 text-muted-foreground" />
              Visser BV
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-semibold text-foreground">
              <CheckCircle2 className="size-3" />
              Betaald
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Methode</span>
            <span className="font-medium text-foreground">iDEAL · ING</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Ontvangen</span>
            <span className="font-medium text-foreground">2 min geleden</span>
          </div>
        </div>
      </Card>
    </MockupShell>
  );
}

export function RapportenMockup() {
  const bars = [40, 55, 30, 70, 85, 60, 95];
  const labels = ["M", "D", "W", "D", "V", "Z", "Z"];
  return (
    <MockupShell bg="bg-gradient-to-br from-violet/15 to-violet/5">
      <Card className="w-full max-w-xs">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Weekomzet
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight">€ 14.750</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-mint">
                <TrendingUp className="size-3" />
                +4,5%
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-primary/80"
                style={{ height: `${h}%` }}
              />
              <span className="text-[9px] text-muted-foreground">
                {labels[i]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Marge</span>
            <span className="text-xs font-semibold">38%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Open</span>
            <span className="text-xs font-semibold">€ 2.180</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Jobs</span>
            <span className="text-xs font-semibold">12</span>
          </div>
        </div>
      </Card>
    </MockupShell>
  );
}

export const mockupByKey: Record<string, () => React.ReactElement> = {
  "online-intakes": OnlineIntakesMockup,
  quotes: OffertesMockup,
  planning: PlanningMockup,
  schedule: ScheduleMockup,
  payments: BetalingenMockup,
  reports: RapportenMockup,
};

// Silence unused imports (kept for potential future tweaks)
void ArrowUpRight;
void Circle;

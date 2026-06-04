import { ArrowRight, Check, Eye, FileText, Receipt } from "lucide-react";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center">{children}</div>
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
      className={`w-full max-w-[240px] rounded-xl bg-background p-4 shadow-xl ring-1 ring-foreground/5 ${className}`}
    >
      {children}
    </div>
  );
}

export function HuisstijlMockup() {
  return (
    <Shell>
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
            JB
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-tight">
              Jouw Bedrijf
            </span>
            <span className="text-[9px] text-muted-foreground">
              installatie & onderhoud
            </span>
          </div>
        </div>
        <div className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Offerte #2034
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-muted" />
          <div className="h-2 w-full rounded-full bg-muted" />
          <div className="h-2 w-2/3 rounded-full bg-muted" />
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-primary/80" />
      </Card>
    </Shell>
  );
}

export function LineItemsMockup() {
  const lines = [
    { label: "Materiaal", price: "€ 450,00" },
    { label: "Arbeid (6u)", price: "€ 280,00" },
    { label: "Voorrijden", price: "€ 50,00" },
  ];
  return (
    <Shell>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-tight">
            Specificatie
          </span>
          <FileText className="size-3.5 text-muted-foreground" />
        </div>
        <div className="space-y-1.5 text-[11px]">
          {lines.map((l) => (
            <div key={l.label} className="flex items-center justify-between">
              <span className="text-foreground">{l.label}</span>
              <span className="font-medium text-foreground">{l.price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-1.5 text-muted-foreground">
            <span>Btw (21%)</span>
            <span>€ 163,80</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold tracking-tight">
            <span>Totaal</span>
            <span>€ 943,80</span>
          </div>
        </div>
      </Card>
    </Shell>
  );
}

export function SignMockup() {
  return (
    <Shell>
      <Card>
        <div className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Offerte #2034
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-mint/20 text-mint">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-semibold tracking-tight">
            Akkoord — Visser BV
          </span>
          <span className="text-[9px] text-muted-foreground">
            digitaal getekend · 14 jun
          </span>
        </div>
      </Card>
    </Shell>
  );
}

export function ReadReceiptMockup() {
  const rows = [
    { label: "Verstuurd", value: "ma 09:11", accent: false },
    { label: "Geopend", value: "ma 11:24", accent: false },
    { label: "Status", value: "In behandeling", accent: true },
  ];
  return (
    <Shell>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-tight">
            Offerte #2034
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-2 py-0.5 text-[9px] font-semibold text-foreground">
            <Eye className="size-2.5" />
            Geopend
          </span>
        </div>
        <div className="space-y-2 text-[10px]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-muted-foreground">{r.label}</span>
              <span
                className={
                  r.accent
                    ? "font-semibold text-mint"
                    : "font-medium text-foreground"
                }
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}

export function ToInvoiceMockup() {
  return (
    <Shell>
      <Card>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 flex-col items-center gap-1">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <FileText className="size-4 text-muted-foreground" />
            </span>
            <span className="text-[9px] text-muted-foreground">Offerte</span>
          </div>
          <ArrowRight className="size-4 shrink-0 text-primary" />
          <div className="flex flex-1 flex-col items-center gap-1">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="size-4 text-primary" />
            </span>
            <span className="text-[9px] font-semibold text-foreground">
              Factuur
            </span>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-muted/40 p-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-foreground">Totaal</span>
            <span className="font-bold tracking-tight">€ 943,80</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[9px] text-mint">
            <Check className="size-2.5" strokeWidth={3} />
            Aangemaakt in één klik
          </div>
        </div>
      </Card>
    </Shell>
  );
}

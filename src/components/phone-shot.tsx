import { ArrowRight, Eye, Sparkles } from "lucide-react";

// Placeholder product shot: a phone device frame on a colored background.
export function PhoneShot({
  background,
  children,
}: {
  background: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center p-6 sm:p-8 ${background}`}
    >
      <div className="relative aspect-[9/19] h-full max-h-[440px] rounded-[2.2rem] bg-secondary p-1.5 shadow-2xl ring-1 ring-black/20">
        <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] bg-background">
          <div className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-secondary" />
          {children}
        </div>
      </div>
    </div>
  );
}

export function QuotePhoneScreen() {
  const lines = [
    { label: "Vaillant ketel", price: "€ 1.250" },
    { label: "Installatie · 4u", price: "€ 280" },
  ];
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-9 pb-4 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-tight">Offerte</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet-light px-1.5 py-0.5 text-[8px] font-semibold tracking-wider text-violet uppercase">
          <Sparkles className="size-2" />
          AI
        </span>
      </div>
      <div className="text-[13px] leading-tight font-semibold tracking-tight">
        CV-ketel vervangen
      </div>
      <div className="flex flex-col gap-1.5 text-[10px]">
        {lines.map((l) => (
          <div key={l.label} className="flex items-center justify-between">
            <span className="text-foreground">{l.label}</span>
            <span className="font-medium">{l.price}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border pt-1.5 text-[11px] font-bold tracking-tight">
          <span>Totaal</span>
          <span>€ 1.851</span>
        </div>
      </div>
      <div className="mt-auto flex h-8 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
        Versturen
      </div>
    </div>
  );
}

export function StatusPhoneScreen() {
  const rows = [
    { label: "Verstuurd", value: "ma 09:11", accent: false },
    { label: "Geopend", value: "ma 11:24", accent: false },
    { label: "Status", value: "In behandeling", accent: true },
  ];
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-9 pb-4 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-tight">
          Offerte #2034
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-mint/20 px-1.5 py-0.5 text-[8px] font-semibold text-foreground">
          <Eye className="size-2" />
          Geopend
        </span>
      </div>
      <div className="flex flex-col gap-2 text-[10px]">
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
      <div className="mt-auto flex h-8 items-center justify-center gap-1 rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
        Omzetten naar factuur
        <ArrowRight className="size-3" />
      </div>
    </div>
  );
}

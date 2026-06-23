"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ChevronRight,
  Inbox,
  FileText,
  Hammer,
  Receipt,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QUOTE_STATUS_LABELS,
  DASHBOARD_QUOTE_STATUSES,
  type DashboardStatusRow,
} from "@/lib/mock-data";
import type { Database } from "@/lib/database.types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];

type Quote = {
  id: string;
  status: QuoteStatus;
  total_amount: number;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s/g, "");
}

type BadgeVariant =
  | "default"
  | "secondary"
  | "teal"
  | "violet"
  | "burgundy"
  | "destructive";

const STATUS_BADGE: Record<string, BadgeVariant> = {
  ready_to_schedule: "teal",
  changes_requested: "burgundy",
  draft: "secondary",
  past_due: "destructive",
  awaiting_payment: "default",
};

function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <Badge variant={STATUS_BADGE[status] ?? "secondary"}>
      {label}
      <ChevronRight className="size-3" />
    </Badge>
  );
}

function getQuoteRows(quotes: Quote[]): DashboardStatusRow[] {
  return DASHBOARD_QUOTE_STATUSES.reduce<DashboardStatusRow[]>((acc, status) => {
    const rows = quotes.filter((q) => q.status === status);
    if (rows.length === 0) return acc;
    acc.push({
      status,
      label: QUOTE_STATUS_LABELS[status],
      count: rows.length,
      total: rows.reduce((sum, q) => sum + q.total_amount, 0),
    });
    return acc;
  }, []);
}

type SectionProps = {
  title: string;
  icon: LucideIcon;
  accentClass: string;
  rows: DashboardStatusRow[];
  onRowClick: (status: string) => void;
  onViewAll: () => void;
  emptyMessage: string;
  emptyAction?: { label: string; onClick: () => void };
};

function DashboardSection({
  title,
  icon: Icon,
  accentClass,
  rows,
  onRowClick,
  onViewAll,
  emptyMessage,
  emptyAction,
}: SectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl bg-card p-5">
      <div className="mb-1 flex items-center gap-3">
        <Icon className={`size-5 shrink-0 ${accentClass}`} />
        <span className="text-base font-bold text-foreground">{title}</span>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          {emptyAction && (
            <Button variant="outline" size="sm" onClick={emptyAction.onClick}>
              {emptyAction.label}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-2 mt-4 grid grid-cols-[1fr_48px_80px] gap-2 px-1 text-xs text-muted-foreground">
            <span>Status</span>
            <span className="text-right">Aantal</span>
            <span className="text-right">Bedrag</span>
          </div>

          <div className="space-y-1">
            {rows.map((row, i) => (
              <button
                key={row.status}
                onClick={() => onRowClick(row.status)}
                aria-label={`${title} status: ${row.label}. ${row.count} items. ${formatCurrency(row.total)} totaal.`}
                className="grid w-full grid-cols-[1fr_48px_80px] items-center gap-2 rounded-xl px-1 py-2 text-left transition-colors hover:bg-background active:scale-[0.99]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 0.25s ease ${i * 200}ms, transform 0.25s ease ${i * 200}ms`,
                }}
              >
                <StatusPill status={row.status} label={row.label} />
                <span className="text-right text-sm text-muted-foreground">
                  {row.count}
                </span>
                <span className="text-right text-sm font-medium">
                  {formatCurrency(row.total)}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <Button variant="outline" size="sm" onClick={onViewAll}>
              Volledige lijst
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function FloatingAddButton({ onSelect }: { onSelect: (type: string) => void }) {
  const [open, setOpen] = useState(false);

  const options = [
    { key: "request", label: "Aanvraag", icon: Inbox, iconClass: "text-burgundy-bright", disabled: false },
    { key: "quote", label: "Offerte", icon: FileText, iconClass: "text-primary", disabled: false },
    { key: "invoice", label: "Factuur", icon: Receipt, iconClass: "text-teal-bright", disabled: false },
    { key: "job", label: "Opdracht", icon: Hammer, iconClass: "text-violet-bright", disabled: true },
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 lg:hidden">
        {open && (
          <div className="flex flex-col items-end gap-2">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => {
                    if (!option.disabled) {
                      setOpen(false);
                      onSelect(option.key);
                    }
                  }}
                  disabled={option.disabled}
                  className={`flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
                    option.disabled
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-muted active:scale-[0.98]"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {option.label}
                    {option.disabled && (
                      <span className="ml-2 text-xs text-muted-foreground">binnenkort</span>
                    )}
                  </span>
                  <Icon className={`h-4 w-4 ${option.disabled ? "text-muted-foreground" : option.iconClass}`} />
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Sluiten" : "Nieuw item toevoegen"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-95"
        >
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}

export function HomeContent({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [greeting, setGreeting] = useState("Goedenavond");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("just_onboarded")) {
      setShowNotification(true);
      sessionStorage.removeItem("just_onboarded");
    }
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Goedemorgen" : h < 18 ? "Goedemiddag" : "Goedenavond",
    );
  }, []);

  useEffect(() => {
    async function loadQuotes() {
      const companyRes = await fetch("/api/quotes/company");
      if (!companyRes.ok) { setLoadingQuotes(false); return; }
      const { companyId, userId } = await companyRes.json();

      const res = await fetch(`/api/quotes/list?userId=${userId}&companyId=${companyId}`);
      if (!res.ok) { setLoadingQuotes(false); return; }

      const { quotes } = await res.json();
      setQuotes(quotes ?? []);
      setLoadingQuotes(false);
    }
    loadQuotes();
  }, []);

  const quoteRows = getQuoteRows(quotes);

  function handleAddSelect(type: string) {
    if (type === "quote") router.push("/dashboard/quotes/new");
    if (type === "request") router.push("/dashboard/requests/new");
    if (type === "invoice") router.push("/dashboard/invoices/new");
  }

  return (
    <div className="space-y-6 px-4 py-8 lg:px-6 lg:pt-6">
      <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight">
        {greeting}
        {firstName ? `, ${firstName}` : ""}
      </h1>

      {showNotification && (
        <div
          role="alert"
          className="animate-in fade-in rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-medium duration-500"
        >
          🎉 Je bedrijf is ingesteld. Welkom bij Fixa!
        </div>
      )}

      {!loadingQuotes && (
        <DashboardSection
          title="Offertes"
          icon={FileText}
          accentClass="text-primary"
          rows={quoteRows}
          onRowClick={(status) => router.push(`/dashboard/quotes?filter=${status}`)}
          onViewAll={() => router.push("/dashboard/quotes")}
          emptyMessage="Nog geen offertes om te tonen."
          emptyAction={{ label: "Nieuwe offerte", onClick: () => router.push("/dashboard/quotes/new") }}
        />
      )}

      <div className="rounded-2xl bg-card p-5">
        <div className="mb-1 flex items-center gap-3">
          <Receipt className="size-5 shrink-0 text-teal-bright" />
          <span className="text-base font-bold text-foreground">Facturen</span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Binnenkort beschikbaar.</p>
        </div>
      </div>

      <FloatingAddButton onSelect={handleAddSelect} />
    </div>
  );
}
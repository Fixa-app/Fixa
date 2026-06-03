"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronRight } from "lucide-react";
import {
  MOCK_QUOTES,
  MOCK_INVOICES,
  getQuoteDashboardRows,
  getInvoiceDashboardRows,
  type DashboardStatusRow,
} from "@/lib/mock-data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, "");
}

type StatusPillVariant =
  | "ready_to_schedule"
  | "changes_requested"
  | "draft"
  | "past_due"
  | "awaiting_payment";

const PILL_STYLES: Record<StatusPillVariant, string> = {
  ready_to_schedule:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  changes_requested:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  past_due: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  awaiting_payment:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

function StatusPill({ status, label }: { status: string; label: string }) {
  const style =
    PILL_STYLES[status as StatusPillVariant] ?? PILL_STYLES["draft"];
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${style}`}
    >
      {label}
      <ChevronRight className="h-3 w-3" />
    </span>
  );
}

type SectionProps = {
  title: string;
  rows: DashboardStatusRow[];
  onRowClick: (status: string) => void;
  onAddClick: () => void;
  onViewAll: () => void;
  addLabel: string;
  emptyMessage: string;
  emptyAction: string;
};

function DashboardSection({
  title,
  rows,
  onRowClick,
  onAddClick,
  onViewAll,
  addLabel,
  emptyMessage,
  emptyAction,
}: SectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl bg-muted/50 p-5">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {rows.length > 0 ? "Jouw volgende acties" : ""}
          </p>
        </div>
        <div className="group relative">
          <button
            onClick={onAddClick}
            aria-label={addLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="pointer-events-none absolute right-0 top-[-36px] hidden whitespace-nowrap rounded-lg border border-border bg-background px-2 py-1 text-xs group-hover:block">
            {addLabel}
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          <button
            onClick={onAddClick}
            className="mt-3 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {emptyAction}
          </button>
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
                aria-label={`${title.slice(0, -1)}status: ${row.label}. ${row.count} items. ${formatCurrency(row.total)} totaal.`}
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
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              Volledige lijst
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("just_onboarded")) {
      setShowNotification(true);
      sessionStorage.removeItem("just_onboarded");
    }
  }, []);

  const quoteRows = getQuoteDashboardRows(MOCK_QUOTES);
  const invoiceRows = getInvoiceDashboardRows(MOCK_INVOICES);

  return (
    <div className="space-y-4 px-4 py-8 md:px-10">
      <h1 className="font-display text-3xl font-bold">Overzicht</h1>

      {showNotification && (
        <div
          role="alert"
          className="animate-in fade-in rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-medium duration-500"
        >
          🎉 Je bedrijf is ingesteld. Welkom bij Fixa!
        </div>
      )}

      <DashboardSection
        title="Offertes"
        rows={quoteRows}
        onRowClick={(status) =>
          router.push(`/dashboard/quotes?filter=${status}`)
        }
        onAddClick={() => router.push("/dashboard/quotes/new")}
        onViewAll={() => router.push("/dashboard/quotes")}
        addLabel="Nieuwe offerte toevoegen"
        emptyMessage="Alles op orde. Klaar om je volgende offerte te sturen?"
        emptyAction="Nieuwe offerte"
      />

      <DashboardSection
        title="Facturen"
        rows={invoiceRows}
        onRowClick={(status) =>
          router.push(`/dashboard/invoices?filter=${status}`)
        }
        onAddClick={() => router.push("/dashboard/invoices/new")}
        onViewAll={() => router.push("/dashboard/invoices")}
        addLabel="Nieuwe factuur toevoegen"
        emptyMessage="Geen openstaande facturen. Klaar om de volgende te sturen?"
        emptyAction="Nieuwe factuur"
      />
    </div>
  );
}
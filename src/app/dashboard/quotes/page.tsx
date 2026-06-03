"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MOCK_QUOTES,
  QUOTE_STATUS_LABELS,
  type MockQuote,
} from "@/lib/mock-data";
import type { Database } from "@/lib/database.types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];

const ALL_STATUSES: QuoteStatus[] = [
  "draft",
  "awaiting_response",
  "changes_requested",
  "ready_to_schedule",
  "declined",
  "archived",
];

type SortOption = "newest" | "oldest" | "highest" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  highest: "Highest €",
  name: "Name (A-Z)",
};

type StatusPillVariant =
  | "ready_to_schedule"
  | "changes_requested"
  | "draft"
  | "awaiting_response"
  | "declined"
  | "archived";

const PILL_STYLES: Record<StatusPillVariant, string> = {
  ready_to_schedule:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  changes_requested:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  draft: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  awaiting_response:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  declined: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  archived: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Updated today";
  if (diffDays === 1) return "Updated 1 day ago";
  if (diffDays <= 7) return `Updated ${diffDays} days ago`;

  return `Updated ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function StatusPill({ status }: { status: QuoteStatus }) {
  const style = PILL_STYLES[status as StatusPillVariant] ?? PILL_STYLES["draft"];
  const label = QUOTE_STATUS_LABELS[status];
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

type DropdownProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
      >
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-xl border border-border bg-background shadow-md">
            <p className="border-b border-border px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {label.replace(":", "")}
            </p>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-muted ${
                  opt.label === value ? "font-bold" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function QuotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") ?? "all";

  const [filter, setFilter] = useState<string>(initialFilter);
  const [sort, setSort] = useState<SortOption>("newest");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [filter]);

  const filterOptions = [
    { value: "all", label: "All quotes" },
    ...ALL_STATUSES.map((s) => ({ value: s, label: QUOTE_STATUS_LABELS[s] })),
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest", label: "Highest €" },
    { value: "name", label: "Name (A-Z)" },
  ];

  const filtered = useMemo(() => {
    let quotes =
      filter === "all"
        ? MOCK_QUOTES
        : MOCK_QUOTES.filter((q) => q.status === filter);

    switch (sort) {
      case "newest":
        return [...quotes].sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case "oldest":
        return [...quotes].sort(
          (a, b) =>
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
      case "highest":
        return [...quotes].sort((a, b) => b.total_amount - a.total_amount);
      case "name":
        return [...quotes].sort((a, b) =>
          a.client_name.localeCompare(b.client_name)
        );
    }
  }, [filter, sort]);

  const filterLabel =
    filter === "all"
      ? "All quotes"
      : QUOTE_STATUS_LABELS[filter as QuoteStatus];

  return (
    <div className="px-4 py-8 md:px-10">
      <h1 className="font-display text-3xl font-bold mb-6">Offertes</h1>

      {/* Filter + Sort bar */}
      <div className="mb-4 flex items-center gap-2">
        <Dropdown
          label="Filter:"
          value={filterLabel}
          options={filterOptions}
          onChange={(v) => {
            setFilter(v);
            setVisible(false);
          }}
        />
        <Dropdown
          label="Sort:"
          value={SORT_LABELS[sort]}
          options={sortOptions}
          onChange={(v) => {
            setSort(v as SortOption);
            setVisible(false);
          }}
        />
      </div>

      {/* List card */}
      <div className="rounded-2xl bg-muted/50 p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              {filter === "all" ? "All quotes" : "Filtered quotes"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/quotes/new")}
            aria-label="Create new quote"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No quotes found for this filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("all")}
            >
              Clear filter
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            {filtered.map((quote, i) => (
              <button
                key={quote.id}
                onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                aria-label={`Quote from ${quote.client_name}, status ${QUOTE_STATUS_LABELS[quote.status]}, total ${formatCurrency(quote.total_amount)}`}
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-4 text-left transition-colors hover:bg-background active:scale-[0.99] ${
                  i % 2 === 0 ? "bg-transparent" : "bg-background/50"
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(4px)",
                  transition: `opacity 0.2s ease ${i * 150}ms, transform 0.2s ease ${i * 150}ms`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{quote.client_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(quote.updated_at)}
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    {formatCurrency(quote.total_amount)}
                  </p>
                </div>
                <StatusPill status={quote.status} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
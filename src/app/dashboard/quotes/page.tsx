"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  ChevronDown,
  Check,
  MoreHorizontal,
  Camera,
  LayoutTemplate,
} from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QUOTE_STATUS_LABELS } from "@/lib/mock-data";
import type { Database } from "@/lib/database.types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];

type Quote = {
  id: string;
  client_name: string;
  status: QuoteStatus;
  total_amount: number;
  updated_at: string;
};

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
  awaiting_response: "default",
  declined: "destructive",
  archived: "violet",
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
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
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
  return (
    <Badge variant={STATUS_BADGE[status] ?? "secondary"}>
      {QUOTE_STATUS_LABELS[status]}
    </Badge>
  );
}

function QuotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") ?? "all";

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [sort, setSort] = useState<SortOption>("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const companyRes = await fetch("/api/quotes/company");
      if (!companyRes.ok) { setLoading(false); return; }
      const { companyId, userId } = await companyRes.json();

      const res = await fetch(`/api/quotes/list?userId=${userId}&companyId=${companyId}`);
      if (!res.ok) { setLoading(false); return; }

      const { quotes } = await res.json();
      setQuotes(quotes ?? []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [filter, sort, quotes]);

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
    let result =
      filter === "all"
        ? quotes
        : quotes.filter((q) => q.status === filter);
    switch (sort) {
      case "newest":
        return [...result].sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case "oldest":
        return [...result].sort(
          (a, b) =>
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
      case "highest":
        return [...result].sort((a, b) => b.total_amount - a.total_amount);
      case "name":
        return [...result].sort((a, b) =>
          a.client_name.localeCompare(b.client_name)
        );
    }
  }, [filter, sort, quotes]);

  const filterLabel =
    filter === "all"
      ? "All quotes"
      : QUOTE_STATUS_LABELS[filter as QuoteStatus];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-8 lg:px-6 lg:pt-6">
        {/* Title row */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="self-start font-display text-3xl font-medium leading-[1.05] tracking-tight">
            Offertes
          </h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/dashboard/quotes/new")}>
              <Plus className="size-4" />
              Nieuwe offerte
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                aria-label="Meer opties"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
              >
                <MoreHorizontal className="size-5" />
              </Button>

              {moreOpen && (
                <>
                  <button
                    type="button"
                    aria-hidden
                    tabIndex={-1}
                    onClick={() => setMoreOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute top-full right-0 z-50 mt-2 flex w-56 flex-col gap-1 rounded-2xl bg-card p-2 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        router.push("/dashboard/quotes/new?import=photo");
                      }}
                      className="flex items-center gap-3 rounded-lg p-2 text-left text-base font-bold text-foreground transition-colors hover:bg-hover"
                    >
                      <Camera className="size-5 shrink-0" />
                      <span>Offerte importeren</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        router.push("/dashboard/quotes/new?template=1");
                      }}
                      className="flex items-center gap-3 rounded-lg p-2 text-left text-base font-bold text-foreground transition-colors hover:bg-hover"
                    >
                      <LayoutTemplate className="size-5 shrink-0" />
                      <span>Sjabloon kiezen</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter + Sort bar */}
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(true)}
          >
            <span className="relative font-normal text-muted-foreground group-hover/button:text-white">
              Filter:
              {filter !== "all" && (
                <span className="absolute -top-0.5 -right-1.5 size-1.5 rounded-full bg-primary" />
              )}
            </span>
            {filter === "all" ? (
              <span>{filterLabel}</span>
            ) : (
              <Badge variant={STATUS_BADGE[filter] ?? "secondary"}>
                {filterLabel}
              </Badge>
            )}
            <ChevronDown className="size-3 text-muted-foreground group-hover/button:text-white" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSortOpen(true)}>
            <span className="font-normal text-muted-foreground group-hover/button:text-white">
              Sort:
            </span>
            <span>{SORT_LABELS[sort]}</span>
            <ChevronDown className="size-3 text-muted-foreground group-hover/button:text-white" />
          </Button>
        </div>

        {/* List */}
        <div>
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {filter === "all" ? "Alle offertes" : "Gefilterde offertes"}
            </h2>
            <p className="text-base text-muted-foreground">
              {filtered.length}{" "}
              {filtered.length === 1 ? "resultaat" : "resultaten"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                {quotes.length === 0
                  ? "Je hebt nog geen offertes."
                  : "Geen offertes gevonden voor dit filter."}
              </p>
              {quotes.length === 0 ? (
                <Button onClick={() => router.push("/dashboard/quotes/new")}>
                  Nieuwe offerte
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Filter wissen
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((quote, i) => (
                <button
                  key={quote.id}
                  onClick={() =>
                    router.push(`/dashboard/quotes/${quote.id}`)
                  }
                  aria-label={`Quote from ${quote.client_name}, status ${QUOTE_STATUS_LABELS[quote.status]}, total ${formatCurrency(quote.total_amount)}`}
                  className="flex w-full items-center justify-between gap-4 rounded-xl bg-card p-4 text-left transition-all hover:bg-hover active:scale-[0.99]"
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

      {/* Filter drawer */}
      <Drawer.Root open={filterOpen} onOpenChange={setFilterOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6">
              <Drawer.Title className="mb-4 font-display text-lg font-semibold">
                Filter by:
              </Drawer.Title>
              <div className="space-y-1">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setFilterOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-muted"
                  >
                    {opt.value === "all" ? (
                      <span className={filter === opt.value ? "font-bold" : ""}>
                        {opt.label}
                      </span>
                    ) : (
                      <Badge variant={STATUS_BADGE[opt.value] ?? "secondary"}>
                        {opt.label}
                      </Badge>
                    )}
                    {filter === opt.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 pb-safe">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilterOpen(false)}
                >
                  Sluiten
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Sort drawer */}
      <Drawer.Root open={sortOpen} onOpenChange={setSortOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6">
              <Drawer.Title className="mb-4 font-display text-lg font-semibold">
                Sort by:
              </Drawer.Title>
              <div className="space-y-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span className={sort === opt.value ? "font-bold" : ""}>
                      {opt.label}
                    </span>
                    {sort === opt.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 pb-safe">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSortOpen(false)}
                >
                  Sluiten
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

export default function QuotesPage() {
  return (
    <Suspense fallback={<div />}>
      <QuotesContent />
    </Suspense>
  );
}
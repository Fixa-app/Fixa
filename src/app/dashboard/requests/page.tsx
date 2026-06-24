"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ChevronDown, Check, CheckCircle2 } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format-relative-time";

type RequestStatus = "created" | "converted" | "archived";

type RequestRow = {
  id: string;
  client_name: string;
  status: RequestStatus;
  updated_at: string;
};

const ALL_STATUSES: RequestStatus[] = ["created", "converted", "archived"];

const STATUS_LABEL: Record<RequestStatus, string> = {
  created: "Aangemaakt",
  converted: "Omgezet naar offerte",
  archived: "Gearchiveerd",
};

type BadgeVariant = "default" | "secondary" | "teal" | "violet" | "burgundy" | "destructive";

const STATUS_BADGE: Record<string, BadgeVariant> = {
  created: "default",
  converted: "teal",
  archived: "secondary",
};

type SortOption = "newest" | "oldest" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  name: "Name (A-Z)",
};

function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <Badge variant={STATUS_BADGE[status] ?? "secondary"}>
      <CheckCircle2 className="h-3 w-3" />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

function RequestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") ?? "all";

  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [sort, setSort] = useState<SortOption>("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const companyRes = await fetch("/api/quotes/company");
      if (!companyRes.ok) { setLoading(false); return; }
      const { companyId, userId } = await companyRes.json();

      const res = await fetch(`/api/requests/list?userId=${userId}&companyId=${companyId}`);
      if (!res.ok) { setLoading(false); return; }

      const { requests } = await res.json();
      setRequests(requests ?? []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [filter, sort, requests]);

  const filterOptions = [
    { value: "all", label: "All requests" },
    ...ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name", label: "Name (A-Z)" },
  ];

  const filtered = useMemo(() => {
    let result = filter === "all" ? requests : requests.filter((r) => r.status === filter);
    switch (sort) {
      case "newest":
        return [...result].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      case "oldest":
        return [...result].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
      case "name":
        return [...result].sort((a, b) => a.client_name.localeCompare(b.client_name));
    }
  }, [filter, sort, requests]);

  const filterLabel = filter === "all" ? "All requests" : STATUS_LABEL[filter as RequestStatus];

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
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="self-start font-display text-3xl font-medium leading-[1.05] tracking-tight">
            Aanvragen
          </h1>
          <Button onClick={() => router.push("/dashboard/requests/new")} aria-label="Nieuwe aanvraag">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nieuwe aanvraag</span>
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            <span className="relative font-normal text-muted-foreground group-hover/button:text-white">
              Filter:
              {filter !== "all" && (
                <span className="absolute -top-0.5 -right-1.5 size-1.5 rounded-full bg-primary" />
              )}
            </span>
            {filter === "all" ? (
              <span>{filterLabel}</span>
            ) : (
              <Badge variant={STATUS_BADGE[filter] ?? "secondary"}>{filterLabel}</Badge>
            )}
            <ChevronDown className="size-3 text-muted-foreground group-hover/button:text-white" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSortOpen(true)}>
            <span className="font-normal text-muted-foreground group-hover/button:text-white">Sort:</span>
            <span>{SORT_LABELS[sort]}</span>
            <ChevronDown className="size-3 text-muted-foreground group-hover/button:text-white" />
          </Button>
        </div>

        <div>
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {filter === "all" ? "Alle aanvragen" : "Gefilterde aanvragen"}
            </h2>
            <p className="text-base text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "resultaat" : "resultaten"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                {requests.length === 0 ? "Je hebt nog geen aanvragen." : "Geen aanvragen gevonden voor dit filter."}
              </p>
              {requests.length === 0 ? (
                <Button onClick={() => router.push("/dashboard/requests/new")}>Nieuwe aanvraag</Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setFilter("all")}>Filter wissen</Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((req, i) => (
                <button
                  key={req.id}
                  onClick={() => router.push(`/dashboard/requests/${req.id}`)}
                  aria-label={`Aanvraag van ${req.client_name}, status ${STATUS_LABEL[req.status]}`}
                  className="flex w-full items-center justify-between gap-4 rounded-xl bg-card p-4 text-left transition-all hover:bg-hover active:scale-[0.99]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(4px)",
                    transition: `opacity 0.2s ease ${i * 150}ms, transform 0.2s ease ${i * 150}ms`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">{req.client_name}</p>
                    <p className="text-sm text-muted-foreground">{formatRelativeTime(req.updated_at)}</p>
                  </div>
                  <StatusPill status={req.status} />
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
              <Drawer.Title className="mb-4 font-display text-lg font-semibold">Filter by:</Drawer.Title>
              <div className="space-y-1">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilter(opt.value); setFilterOpen(false); }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-muted"
                  >
                    {opt.value === "all" ? (
                      <span className={filter === opt.value ? "font-bold" : ""}>{opt.label}</span>
                    ) : (
                      <Badge variant={STATUS_BADGE[opt.value] ?? "secondary"}>{opt.label}</Badge>
                    )}
                    {filter === opt.value && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="mt-4 pb-safe">
                <Button variant="outline" className="w-full" onClick={() => setFilterOpen(false)}>Sluiten</Button>
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
              <Drawer.Title className="mb-4 font-display text-lg font-semibold">Sort by:</Drawer.Title>
              <div className="space-y-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span className={sort === opt.value ? "font-bold" : ""}>{opt.label}</span>
                    {sort === opt.value && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="mt-4 pb-safe">
                <Button variant="outline" className="w-full" onClick={() => setSortOpen(false)}>Sluiten</Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

export default function RequestsOverviewPage() {
  return (
    <Suspense fallback={<div />}>
      <RequestsContent />
    </Suspense>
  );
}
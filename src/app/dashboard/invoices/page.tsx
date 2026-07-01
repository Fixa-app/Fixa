"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_BADGE, ALL_INVOICE_STATUSES, type InvoiceStatus } from "@/lib/status-config";
import { formatRelativeTime } from "@/lib/format-relative-time";

type InvoiceRow = {
  id: string;
  invoice_number: string | null;
  client_name: string;
  status: InvoiceStatus;
  due_date: string | null;
  updated_at: string;
  total_amount: number;
};

type SortOption = "newest" | "oldest" | "amount";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  oldest: "Oldest",
  amount: "Amount (high-low)",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace(/\s/g, "");
}

export default function InvoicesOverviewPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const companyRes = await fetch("/api/quotes/company");
      if (!companyRes.ok) { setLoading(false); return; }
      const { companyId, userId } = await companyRes.json();

      const res = await fetch(`/api/invoices/list?userId=${userId}&companyId=${companyId}`);
      if (!res.ok) { setLoading(false); return; }
      const { invoices } = await res.json();
      setInvoices(invoices ?? []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [filter, sort, invoices]);

  const filterOptions = [
    { value: "all", label: "All invoices" },
    ...(ALL_INVOICE_STATUSES ?? []).map((s) => ({ value: s, label: INVOICE_STATUS_LABELS[s] })),
  ];

  const filtered = useMemo(() => {
    let result = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);
    switch (sort) {
      case "newest": return [...result].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      case "oldest": return [...result].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
      case "amount": return [...result].sort((a, b) => b.total_amount - a.total_amount);
    }
  }, [filter, sort, invoices]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Laden...</p></div>;
  }

  return (
    <>
      <div className="px-4 py-8 lg:px-6 lg:pt-6">
        <div className="mb-6">
          <h1 className="self-start font-display text-3xl font-medium leading-[1.05] tracking-tight">Facturen</h1>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            <span className="font-normal text-muted-foreground">Filter:</span>
            {filter === "all" ? <span>All invoices</span> : (
              <Badge variant={(INVOICE_STATUS_BADGE as Record<string, string>)[filter] as "default" | "secondary" | "teal" | "violet" | "burgundy" | "destructive" ?? "secondary"}>
                {INVOICE_STATUS_LABELS[filter as InvoiceStatus]}
              </Badge>
            )}
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSortOpen(true)}>
            <span className="font-normal text-muted-foreground">Sort:</span>
            <span>{SORT_LABELS[sort]}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Alle facturen</h2>
          <p className="text-base text-muted-foreground">{filtered.length} {filtered.length === 1 ? "resultaat" : "resultaten"}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {invoices.length === 0 ? "Je hebt nog geen facturen." : "Geen facturen gevonden voor dit filter."}
            </p>
            {filter !== "all" && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setFilter("all")}>Filter wissen</Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((inv, i) => (
              <button
                key={inv.id}
                onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
                className="flex w-full items-center justify-between gap-4 rounded-xl bg-card p-4 text-left transition-all hover:bg-hover active:scale-[0.99]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(4px)",
                  transition: `opacity 0.2s ease ${i * 100}ms, transform 0.2s ease ${i * 100}ms`,
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{inv.client_name}</p>
                  <p className="text-sm text-muted-foreground">{inv.invoice_number ?? "Concept"} · {formatRelativeTime(inv.updated_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant={(INVOICE_STATUS_BADGE as Record<string, "default" | "secondary" | "teal" | "violet" | "burgundy" | "destructive">)[inv.status] ?? "secondary"}>
                    {INVOICE_STATUS_LABELS[inv.status]}
                  </Badge>
                  <span className="text-sm font-medium">{formatCurrency(inv.total_amount)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
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
                  <button key={opt.value} onClick={() => { setFilter(opt.value); setFilterOpen(false); }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-muted">
                    {opt.value === "all" ? <span className={filter === opt.value ? "font-bold" : ""}>{opt.label}</span> : (
                      <Badge variant={(INVOICE_STATUS_BADGE as Record<string, "default" | "secondary" | "teal" | "violet" | "burgundy" | "destructive">)[opt.value] ?? "secondary"}>{opt.label}</Badge>
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
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                  <button key={value} onClick={() => { setSort(value); setSortOpen(false); }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-muted">
                    <span className={sort === value ? "font-bold" : ""}>{label}</span>
                    {sort === value && <Check className="h-4 w-4 text-primary" />}
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
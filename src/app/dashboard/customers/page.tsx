"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format-relative-time";

type Client = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  updated_at: string;
};

type SortOption = "recent" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Recent gebruikt",
  name: "Naam (A-Z)",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((n) => n.length > 0 && n[0] === n[0].toUpperCase() && n[0] !== n[0].toLowerCase())
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function ClientAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
      {getInitials(name)}
    </div>
  );
}

export default function CustomersPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const companyRes = await fetch("/api/quotes/company");
      if (!companyRes.ok) { setLoading(false); return; }
      const { companyId, userId } = await companyRes.json();

      const res = await fetch(`/api/customers/list?userId=${userId}&companyId=${companyId}`);
      if (!res.ok) { setLoading(false); return; }

      const { clients } = await res.json();
      setClients(clients ?? []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [sort, clients]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Recent gebruikt" },
    { value: "name", label: "Naam (A-Z)" },
  ];

  const sorted = useMemo(() => {
    switch (sort) {
      case "recent":
        return [...clients].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      case "name":
        return [...clients].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [clients, sort]);

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
        <div className="mb-6">
          <h1 className="self-start font-display text-3xl font-medium leading-[1.05] tracking-tight">
            Klanten
          </h1>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSortOpen(true)}>
            <span className="font-normal text-muted-foreground group-hover/button:text-white">Sort:</span>
            <span>{SORT_LABELS[sort]}</span>
            <ChevronDown className="size-3 text-muted-foreground group-hover/button:text-white" />
          </Button>
        </div>

        <div>
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Alle klanten</h2>
            <p className="text-base text-muted-foreground">
              {sorted.length} {sorted.length === 1 ? "resultaat" : "resultaten"}
            </p>
          </div>

          {sorted.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">Je hebt nog geen klanten.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((client, i) => (
                <button
                  key={client.id}
                  onClick={() => router.push(`/dashboard/customers/${client.id}`)}
                  aria-label={`Klant: ${client.name}`}
                  className="flex w-full items-center gap-4 rounded-xl bg-card p-4 text-left transition-all hover:bg-hover active:scale-[0.99]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(4px)",
                    transition: `opacity 0.2s ease ${i * 100}ms, transform 0.2s ease ${i * 100}ms`,
                  }}
                >
                  <ClientAvatar name={client.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.address || client.phone || client.email || "Geen gegevens"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatRelativeTime(client.updated_at)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
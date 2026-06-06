"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

const NL_TUSSENVOEGSELS = new Set([
  "van", "de", "den", "der", "het", "'t", "uit", "op", "voor", "in", "aan", "ten", "ter", "te"
]);

function capitalizeNL(input: string): string {
  return input
    .split(" ")
    .map((word, i) => {
      if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      if (NL_TUSSENVOEGSELS.has(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((n) => n.length > 0 && n[0] === n[0].toUpperCase() && n[0] !== n[0].toLowerCase())
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function formatLastQuoted(dateStr: string | null) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Vandaag gebruikt";
  if (diffDays === 1) return "Gisteren gebruikt";
  if (diffDays <= 7) return `${diffDays} dagen geleden gebruikt`;
  return `Gebruikt op ${date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

function ClientAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
      {getInitials(name)}
    </div>
  );
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function NewQuoteStep1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get("prefill") ?? "";

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(prefill);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [visible, setVisible] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  useEffect(() => {
    async function loadRecent() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const res = await fetch(`/api/quotes/clients?userId=${userId}`);
      if (!res.ok) return;
      const { clients } = await res.json();
      setRecentClients(clients ?? []);
      setTimeout(() => setVisible(true), 50);
    }
    loadRecent();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setClients([]);
      return;
    }
    const timer = setTimeout(async () => {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const res = await fetch(`/api/quotes/clients?userId=${userId}&q=${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const { clients } = await res.json();
      setClients(clients ?? []);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  function selectClient(client: Client) {
    setSelectedClient(client);
    setAddress(client.address ?? "");
    setPhone(client.phone ?? "");
    setEmail(client.email ?? "");
    setErrors({});
  }

  async function handleCreateNew() {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const name = capitalizeNL(query.trim());

    // Check if client with same name already exists
    const checkRes = await fetch(`/api/quotes/clients?userId=${userId}&q=${encodeURIComponent(name)}`);
    if (checkRes.ok) {
      const { clients: existing } = await checkRes.json();
      const exact = existing?.find((c: Client) => c.name.toLowerCase() === name.toLowerCase());
      if (exact) {
        selectClient(exact);
        return;
      }
    }

    const res = await fetch("/api/quotes/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId }),
    });
    if (!res.ok) return;
    const { client } = await res.json();
    if (client) selectClient(client);
  }

  async function handleContinue() {
    if (!selectedClient) return;

    const newErrors: Record<string, string> = {};
    if (!phone.trim()) {
      newErrors.phone = "Telefoonnummer is verplicht";
    } else if (!/^\+?[\d\s-]{8,}$/.test(phone)) {
      newErrors.phone = "Ongeldig telefoonnummer";
    }
    if (!email.trim()) {
      newErrors.email = "E-mailadres is verplicht";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ongeldig e-mailadres";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);

    const userId = await getCurrentUserId();
    if (!userId) { setSaving(false); return; }

    // Update client
    await fetch("/api/quotes/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedClient.id, address, phone, email, userId }),
    });

    // Create draft quote
    const res = await fetch("/api/quotes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selectedClient.id, userId }),
    });

    if (res.ok) {
      const { quote } = await res.json();
      router.push(`/dashboard/quotes/new/${quote.id}/items`);
    }

    setSaving(false);
  }

  const showRecent = !query.trim() && recentClients.length > 0;
  const showResults = query.trim().length > 0;
  const hasMatches = clients.length > 0;

  if (selectedClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedClient(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Terug naar klant zoeken"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/3 bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">1/3</span>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold">Nieuwe offerte</h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={selectedClient.name}
              disabled
              aria-label={`Geselecteerde klant: ${selectedClient.name}`}
              className="flex h-12 flex-1 rounded-xl border border-input bg-muted px-4 text-base text-muted-foreground"
            />
            <button
              onClick={() => setSelectedClient(null)}
              aria-label="Andere klant kiezen"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline whitespace-nowrap"
            >
              klant wijzigen
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="address">Adres</label>
            {/* TODO: Replace with Google Places Autocomplete */}
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Straat, huisnummer, stad"
              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">Telefoonnummer</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((p) => { const n = { ...p }; delete n.phone; return n; });
              }}
              placeholder="0612345678"
              aria-label="Telefoonnummer"
              className={`flex h-12 w-full rounded-xl border bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.phone ? "border-destructive" : "border-input"
              }`}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">E-mailadres</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => { const n = { ...p }; delete n.email; return n; });
              }}
              placeholder="naam@voorbeeld.nl"
              aria-label="E-mailadres"
              className={`flex h-12 w-full rounded-xl border bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.email ? "border-destructive" : "border-input"
              }`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl p-6">
            <Button className="w-full" onClick={handleContinue} disabled={saving}>
              {saving ? "Bezig..." : "Volgende"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/quotes")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Terug naar offertes"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/3 bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">1/3</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold">Nieuwe offerte</h1>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Typ om een klant te zoeken of toe te voegen"
          aria-label="Klant zoeken of aanmaken"
          className="flex h-12 w-full rounded-full border border-input bg-background px-5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {showRecent && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground mb-2">Recente klanten</p>
            {recentClients.map((client, i) => (
              <button
                key={client.id}
                onClick={() => selectClient(client)}
                aria-label={`Recente klant: ${client.name}, ${formatLastQuoted(client.updated_at) ?? ""}`}
                className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors hover:bg-muted/50 active:scale-[0.99]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(4px)",
                  transition: `opacity 0.2s ease ${i * 150}ms, transform 0.2s ease ${i * 150}ms`,
                }}
              >
                <ClientAvatar name={client.name} />
                <div>
                  <p className="font-bold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatLastQuoted(client.updated_at) ?? "Nog niet gebruikt"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground mb-2">
              {hasMatches ? "Gevonden – selecteer of voeg toe" : "Geen resultaten"}
            </p>

            {clients.map((client, i) => (
              <button
                key={client.id}
                onClick={() => selectClient(client)}
                className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors hover:bg-muted/50 active:scale-[0.99]"
                style={{
                  opacity: 1,
                  animation: `fadeUp 0.2s ease ${i * 150}ms both`,
                }}
              >
                <ClientAvatar name={client.name} />
                <div>
                  <p className="font-bold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatLastQuoted(client.updated_at) ?? "Nog niet gebruikt"}
                  </p>
                </div>
              </button>
            ))}

            <button
              onClick={handleCreateNew}
              className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                <span className="text-xl font-light text-muted-foreground">+</span>
              </div>
              <p className="font-medium">
                Nieuwe klant aanmaken: <span className="font-bold">{capitalizeNL(query)}</span>
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div />}>
      <NewQuoteStep1Content />
    </Suspense>
  );
}
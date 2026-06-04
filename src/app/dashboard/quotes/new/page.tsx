"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatLastQuoted(dateStr: string | null) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Vandaag geciteerd";
  if (diffDays === 1) return "Gisteren geciteerd";
  if (diffDays <= 7) return `${diffDays} dagen geleden geciteerd`;
  return `Geciteerd op ${date.toLocaleDateString("nl-NL", {
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

async function getCompanyId(supabase: ReturnType<typeof createClient>) {
  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .single();
  return membership?.company_id ?? null;
}

function NewQuoteStep1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get("prefill") ?? "";

  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(prefill);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [visible, setVisible] = useState(false);

  // Selected client state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  // Load recent clients on mount
  useEffect(() => {
    async function loadRecent() {
      const companyId = await getCompanyId(supabase);
      if (!companyId) return;

      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId)
        .order("updated_at", { ascending: false })
        .limit(3);

      if (data) {
        setRecentClients(data);
        setTimeout(() => setVisible(true), 50);
      }
    }
    loadRecent();
  }, []);

  // Search clients as user types
  useEffect(() => {
    if (!query.trim()) {
      setClients([]);
      return;
    }

    const timer = setTimeout(async () => {
      const companyId = await getCompanyId(supabase);
      if (!companyId) return;

      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId)
        .ilike("name", `%${query}%`)
        .limit(5);

      setClients(data ?? []);
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
    const companyId = await getCompanyId(supabase);
    if (!companyId) return;

    const { data: newClient } = await supabase
      .from("clients")
      .insert({ name: query.trim(), company_id: companyId })
      .select()
      .single();

    if (newClient) selectClient(newClient);
  }

  async function handleContinue() {
    if (!selectedClient) return;

    const newErrors: Record<string, string> = {};
    if (!phone.trim()) newErrors.phone = "Telefoonnummer is verplicht";
    if (!email.trim()) newErrors.email = "E-mailadres is verplicht";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);

    // Update client record
    await supabase
      .from("clients")
      .update({ address, phone, email })
      .eq("id", selectedClient.id);

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const companyId = await getCompanyId(supabase);
    if (!companyId) return;

    // Create draft quote
    const { data: quote } = await supabase
      .from("quotes")
      .insert({
        company_id: companyId,
        client_id: selectedClient.id,
        created_by_user_id: user.id,
        status: "draft",
      })
      .select()
      .single();

    if (quote) {
      router.push(`/dashboard/quotes/new/${quote.id}/items`);
    }

    setSaving(false);
  }

  const showRecent = !query.trim() && recentClients.length > 0;
  const showResults = query.trim().length > 0;
  const hasMatches = clients.length > 0;

  // Step 1b: client selected — show details form
  if (selectedClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
          <h1 className="font-display text-3xl font-bold">Nieuwe offerte</h1>

          {/* Selected client */}
          <div>
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
            <p className="mt-1.5 text-xs text-muted-foreground">
              Klant wijzigen verwijdert je concept niet
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="address">
              Adres
            </label>
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

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">
              Telefoonnummer
            </label>
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
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              E-mailadres
            </label>
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
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl p-6">
            <Button className="w-full" onClick={handleContinue} disabled={saving}>
              {saving ? "Bezig..." : "Volgende"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1a: client search
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
        <h1 className="font-display text-3xl font-bold">Nieuwe offerte</h1>

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Typ om een klant te zoeken of toe te voegen"
          aria-label="Klant zoeken of aanmaken"
          className="flex h-12 w-full rounded-full border border-input bg-background px-5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {/* Recent clients */}
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
                    {formatLastQuoted(client.updated_at) ?? "Nog niet geciteerd"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search results */}
        {showResults && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground mb-2">
              {hasMatches
                ? "Gevonden – selecteer of voeg toe"
                : "Geen resultaten"}
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
                    {formatLastQuoted(client.updated_at) ?? "Nog niet geciteerd"}
                  </p>
                </div>
              </button>
            ))}

            {/* Create new */}
            <button
              onClick={handleCreateNew}
              className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                <span className="text-xl font-light text-muted-foreground">+</span>
              </div>
              <p className="font-medium">
                Nieuwe klant aanmaken: <span className="font-bold">{query}</span>
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
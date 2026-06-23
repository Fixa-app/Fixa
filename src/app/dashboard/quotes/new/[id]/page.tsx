"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export default function EditQuoteStep1Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const res = await fetch(`/api/quotes/${id}?userId=${userId}`);
      if (!res.ok) return;

      const { quote, client } = await res.json();
      setClientId(quote.client_id);
      setClientName(client?.name ?? "");
      setAddress(client?.address ?? "");
      setPhone(client?.phone ?? "");
      setEmail(client?.email ?? "");
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleContinue() {
    if (!clientId) return;

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

    await fetch("/api/quotes/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: clientId, address, phone, email, userId }),
    });

    // Komt vanuit quote detail (edit-potlood) — stap 2 moet daarna terug naar detail i.p.v. preview
    router.push(`/dashboard/quotes/new/${id}/items?from=detail`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/dashboard/quotes/${id}`)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Terug naar offerte details"
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

        <h1 className="font-display text-3xl font-bold">Offerte bewerken</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={clientName}
            disabled
            aria-label={`Klant: ${clientName}`}
            className="flex h-12 flex-1 rounded-xl border border-input bg-muted px-4 text-base text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="address">Adres</label>
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
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Plus, ChevronDown } from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type TaxRate = 0 | 9 | 21;
type ItemType = "labor" | "transport" | "material" | "other";

type LineItem = {
  id: string;
  title: string | null;
  description: string;
  quantity: number;
  rate: number;
  tax_percentage: number;
  item_type: ItemType;
  margin_percentage: number | null;
  margin_amount: number | null;
  sort_order: number;
  // UI only
  show_margin: boolean;
  margin_type: "percentage" | "fixed";
};

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount).replace(/\s/g, "");
}

function calcItemSubtotal(item: LineItem): number {
  const base = item.quantity * item.rate;
  if (!item.show_margin) return base;
  if (item.margin_type === "percentage" && item.margin_percentage) {
    return base * (1 + item.margin_percentage / 100);
  }
  if (item.margin_type === "fixed" && item.margin_amount) {
    return base + item.margin_amount;
  }
  return base;
}

function calcTotals(items: LineItem[]) {
  const byTax: Record<number, number> = { 0: 0, 9: 0, 21: 0 };
  let subtotal = 0;
  for (const item of items) {
    const s = calcItemSubtotal(item);
    subtotal += s;
    byTax[item.tax_percentage] = (byTax[item.tax_percentage] ?? 0) + s;
  }
  const taxTotal = Object.entries(byTax).reduce(
    (sum, [rate, base]) => sum + base * (Number(rate) / 100), 0
  );
  return { subtotal, byTax, taxTotal, total: subtotal + taxTotal };
}

function dbToUiItem(item: any): LineItem {
  return {
    ...item,
    show_margin: !!(item.margin_percentage || item.margin_amount),
    margin_type: item.margin_percentage ? "percentage" : "fixed",
  };
}

export default function NewQuoteItemsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [items, setItems] = useState<LineItem[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  // Load quote data on mount
  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const res = await fetch(`/api/quotes/${id}/items?userId=${userId}`);
      if (!res.ok) return;

      const { quote, lineItems, defaults, clientName } = await res.json();

      setItems(lineItems.map(dbToUiItem));
      setJobTitle(quote.job_title ?? "");
      setIntroText(quote.intro_text ?? defaults.intro ?? `Beste ${clientName},\n\nHierbij ontvangt u van ons de offerte voor de onderstaande werkzaamheden.`);
      setDisclaimer(quote.disclaimer ?? defaults.disclaimer ?? "Deze offerte is 30 dagen geldig. Na deze periode kunnen prijzen wijzigen.");
      setClientName(clientName);
      setLoading(false);
    }
    load();
  }, [id]);

  // Save field to quote
  async function saveQuoteField(field: string, value: string) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [field]: value }),
    });
  }

  // Update line item in DB
  async function updateItem(itemId: string, updates: Partial<LineItem>) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/quotes/${id}/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId, ...updates }),
    });
  }

  // Add new line item
  async function handleAdd() {
    const userId = await getCurrentUserId();
    if (!userId) return;

    const res = await fetch(`/api/quotes/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, item_type: "other" }),
    });
    if (!res.ok) return;
    const { lineItem } = await res.json();
    setItems(prev => [...prev, dbToUiItem(lineItem)]);
  }

  // Delete line item
  async function handleDelete(itemId: string) {
    const userId = await getCurrentUserId();
    if (!userId) return;

    await fetch(`/api/quotes/${id}/items?userId=${userId}&itemId=${itemId}`, {
      method: "DELETE",
    });
    setItems(prev => prev.filter(i => i.id !== itemId));
  }

  // Handle field change — update local state immediately, debounce DB save
  function handleChange(itemId: string, field: keyof LineItem, value: unknown) {
    setItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, [field]: value } : item)
    );
    // Save to DB (debounced by browser event loop)
    const dbField = field as string;
    if (!["show_margin", "margin_type"].includes(dbField)) {
      updateItem(itemId, { [field]: value } as Partial<LineItem>);
    }
  }

  async function handleSave() {
    setSaving(true);
    const userId = await getCurrentUserId();
    if (!userId) { setSaving(false); return; }

    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, job_title: jobTitle, intro_text: introText, disclaimer }),
    });

    router.push(`/dashboard/quotes/new/${id}/preview`);
    setSaving(false);
  }

  async function handleDiscard() {
    const userId = await getCurrentUserId();
    if (!userId) return;

    await fetch(`/api/quotes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    router.push("/dashboard/quotes");
  }

  const { subtotal, byTax, taxTotal, total } = calcTotals(items);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-40">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/quotes/new")}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Terug"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">2/3</span>
            </div>
          </div>

          {/* Job title */}
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold">Wat offreer je?</h1>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onBlur={() => saveQuoteField("job_title", jobTitle)}
              placeholder="Alleen voor jezelf – niet zichtbaar voor klant"
              aria-label="Taakomschrijving (niet zichtbaar voor klant)"
              className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Line items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                {/* Title + delete */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.title ?? ""}
                    onChange={(e) => handleChange(item.id, "title", e.target.value)}
                    placeholder="Bijv. Uurloon, Materiaal, Reiskosten"
                    className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    aria-label="Verwijder dit item"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Description */}
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChange(item.id, "description", e.target.value)}
                  placeholder="Beschrijf kort de werkzaamheden"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                {/* Supplier placeholder */}
                <label className="flex items-start gap-2 cursor-not-allowed opacity-50">
                  <input type="checkbox" disabled className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ik heb info van een leverancier nodig</p>
                    <p className="text-xs text-muted-foreground">Binnenkort beschikbaar</p>
                  </div>
                </label>

                {/* Quantity + Rate + Tax */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Aantal</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => handleChange(item.id, "quantity", Number(e.target.value) || 0)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Stukprijs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={item.rate}
                        onChange={(e) => handleChange(item.id, "rate", Number(e.target.value) || 0)}
                        className="w-full h-10 rounded-lg border border-input bg-background pl-7 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">BTW</label>
                    <select
                      value={item.tax_percentage}
                      onChange={(e) => handleChange(item.id, "tax_percentage", Number(e.target.value) as TaxRate)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value={21}>21%</option>
                      <option value={9}>9%</option>
                      <option value={0}>0%</option>
                    </select>
                  </div>
                </div>

                {/* Subtotal */}
                {item.quantity > 0 && item.rate > 0 && (
                  <p className="text-sm text-muted-foreground text-right">
                    Subtotaal (ex BTW): <span className="font-medium text-foreground">{formatCurrency(calcItemSubtotal(item))}</span>
                  </p>
                )}

                {/* Marge toggle */}
                <button
                  onClick={() => handleChange(item.id, "show_margin", !item.show_margin)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${item.show_margin ? "rotate-180" : ""}`} />
                  {item.show_margin ? "Marge verbergen" : "Marge toevoegen"}
                </button>

                {/* Marge velden */}
                {item.show_margin && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Marge type</label>
                      <select
                        value={item.margin_type}
                        onChange={(e) => handleChange(item.id, "margin_type", e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Vast bedrag</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Waarde</label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          value={item.margin_type === "percentage" ? (item.margin_percentage ?? "") : (item.margin_amount ?? "")}
                          onChange={(e) => {
                            const val = Number(e.target.value) || null;
                            if (item.margin_type === "percentage") {
                              handleChange(item.id, "margin_percentage", val);
                            } else {
                              handleChange(item.id, "margin_amount", val);
                            }
                          }}
                          className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {item.margin_type === "percentage" ? "%" : "€"}
                        </span>
                      </div>
                    </div>
                    <p className="col-span-2 text-xs text-muted-foreground" aria-label="Deze marge is verborgen voor je klant">
                      Marge verborgen voor klant
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Add button */}
            <button
              onClick={handleAdd}
              aria-label="Nog een post toevoegen"
              className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-border p-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Product of dienst toevoegen</p>
                <p className="text-sm text-muted-foreground">Zoals repareren, installeren of schoonmaken</p>
              </div>
            </button>
          </div>

          {/* Totals */}
          <div className="space-y-1 pt-2 border-t border-border" aria-live="polite">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotaal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {Object.entries(byTax).map(([rate, base]) =>
              base > 0 ? (
                <div key={rate} className="flex justify-between text-sm text-muted-foreground">
                  <span>{rate}% BTW over {formatCurrency(base)}</span>
                  <span>{formatCurrency(base * (Number(rate) / 100))}</span>
                </div>
              ) : null
            )}
            <div className="flex justify-between font-bold pt-1 border-t border-border">
              <span>Totaal</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Tot slot */}
          <div className="space-y-4 pt-4">
            <h2 className="font-display text-2xl font-bold">Tot slot</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="intro-text">Aanhef</label>
              <textarea
                id="intro-text"
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                onBlur={() => saveQuoteField("intro_text", introText)}
                aria-label="Aanhef"
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="disclaimer">Disclaimer</label>
              <textarea
                id="disclaimer"
                value={disclaimer}
                onChange={(e) => setDisclaimer(e.target.value)}
                onBlur={() => saveQuoteField("disclaimer", disclaimer)}
                aria-label="Disclaimer"
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl px-6 py-4 space-y-2">
            <button
              onClick={() => setShowDiscard(true)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Verwijderen
            </button>
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? "Bezig..." : "Concept opslaan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Discard drawer */}
      <Drawer.Root open={showDiscard} onOpenChange={setShowDiscard}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6 space-y-4">
              <Drawer.Title className="font-display text-xl font-bold">Concept verwijderen?</Drawer.Title>
              <p className="text-sm text-muted-foreground">
                Je concept wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt.
              </p>
              <div className="flex gap-3 pb-safe">
                <Button variant="outline" className="flex-1" onClick={() => setShowDiscard(false)}>Annuleren</Button>
                <Button variant="secondary" className="flex-1" onClick={handleDiscard}>Verwijderen</Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
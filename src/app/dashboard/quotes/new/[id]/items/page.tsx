"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSmartBack } from "@/lib/use-smart-back";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
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
  sort_order: number;
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
  return item.quantity * item.rate;
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

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);
  return ref;
}

function NewQuoteItemsContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const fromDetail = searchParams.get("from") === "detail";
  const smartBack = useSmartBack("/dashboard/quotes/new");

  const [items, setItems] = useState<LineItem[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [jobTitleError, setJobTitleError] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<{ id: string; title: string; rate: number; unit: string }[]>([]);
  const [referencePhotos, setReferencePhotos] = useState<Record<string, string[]>>({});

  const introRef = useAutoResize(introText);
  const disclaimerRef = useAutoResize(disclaimer);

  useEffect(() => {
    const stored = sessionStorage.getItem("quote_suggested_products");
    if (stored) {
      setSuggestedProducts(JSON.parse(stored));
      sessionStorage.removeItem("quote_suggested_products");
    }
    const storedPhotos = sessionStorage.getItem("quote_reference_photos");
    if (storedPhotos) {
      setReferencePhotos(JSON.parse(storedPhotos));
      sessionStorage.removeItem("quote_reference_photos");
    }
  }, []);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const res = await fetch(`/api/quotes/${id}/items?userId=${userId}`);
      if (!res.ok) return;

      const { quote, lineItems, defaults } = await res.json();

      setItems(lineItems);
      setJobTitle(quote.job_title ?? "");
      const defaultIntro = `Beste [klantnaam],\n\nHierbij ontvangt u van ons de offerte voor de onderstaande werkzaamheden.\n\n[adres]`;
      setIntroText(quote.intro_text ?? defaults.intro ?? defaultIntro);
      setDisclaimer(quote.disclaimer ?? defaults.disclaimer ?? "Deze offerte is geldig tot [offertedatum + 30 dagen]. Na deze periode kunnen prijzen wijzigen.");
      setLoading(false);
    }
    load();
  }, [id]);

  async function saveQuoteField(field: string, value: string) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [field]: value }),
    });
  }

  async function updateItem(itemId: string, updates: Partial<LineItem>) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/quotes/${id}/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId, ...updates }),
    });
  }

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
    setItems(prev => [...prev, lineItem]);
  }

  async function handleDelete(itemId: string) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/quotes/${id}/items?userId=${userId}&itemId=${itemId}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== itemId));
  }

  async function handleAddSuggestedProduct(product: { id: string; title: string; rate: number; unit: string }) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    const res = await fetch(`/api/quotes/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, item_type: "other", title: product.title, rate: product.rate }),
    });
    if (!res.ok) return;
    const { lineItem } = await res.json();
    setItems((prev) => [...prev, lineItem]);
    setSuggestedProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  function handleChange(itemId: string, field: keyof LineItem, value: unknown) {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, [field]: value } : item));
    updateItem(itemId, { [field]: value } as Partial<LineItem>);
  }

  async function handleSave() {
    if (!jobTitle.trim()) {
      setJobTitleError(true);
      return;
    }
    setJobTitleError(false);
    setSaving(true);
    const userId = await getCurrentUserId();
    if (!userId) { setSaving(false); return; }
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, job_title: jobTitle, intro_text: introText, disclaimer }),
    });

    if (fromDetail) {
      router.push(`/dashboard/quotes/${id}`);
    } else {
      router.push(`/dashboard/quotes/new/${id}/preview`);
    }
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

  function handleBack() {
    if (fromDetail) {
      router.push(`/dashboard/quotes/new/${id}?from=detail`);
    } else {
      smartBack();
    }
  }

  const { subtotal, byTax, total } = calcTotals(items);

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
              onClick={handleBack}
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

          {/* Klusnaam */}
          <div className="space-y-3">
            <h1 className="font-display text-2xl font-bold">Wat offreer je?</h1>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="job-title">Klusnaam</label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  if (e.target.value.trim()) setJobTitleError(false);
                }}
                onBlur={() => saveQuoteField("job_title", jobTitle)}
                placeholder="Bijv. Badkamer renovatie Jansen, Dak reparatie nr. 12"
                aria-label="Klusnaam (niet zichtbaar voor klant)"
                className={`w-full h-12 rounded-xl border bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  jobTitleError ? "border-destructive" : "border-input"
                }`}
              />
              {jobTitleError && (
                <p className="text-sm text-destructive">Geef deze offerte een klusnaam voordat je opslaat.</p>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-4 space-y-4">

                {/* Title + delete */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.title ?? ""}
                    onChange={(e) => handleChange(item.id, "title", e.target.value)}
                    placeholder="Bijv. Uurloon, Tegelwerk, Reiskosten"
                    className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    aria-label="Verwijder dit item"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors flex-shrink-0"
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

                {referencePhotos[item.id] && referencePhotos[item.id].length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Foto&apos;s van de aanvraag</p>
                    <div className="flex flex-wrap gap-2">
                      {referencePhotos[item.id].map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Foto van de aanvraag"
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item.quantity > 0 && item.rate > 0 && (
                  <p className="text-sm text-muted-foreground text-right">
                    Subtotaal (ex BTW):{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(calcItemSubtotal(item))}
                    </span>
                  </p>
                )}
              </div>
            ))}

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

          {/* Voorgestelde extra's uit eerdere offertes */}
          {suggestedProducts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Vaak gebruikt, niet in deze offerte:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddSuggestedProduct(product)}
                    className="flex items-center gap-2 rounded-full border border-dashed border-border bg-background px-3 py-2 text-sm hover:bg-muted/40 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{product.title}</span>
                    <span className="text-muted-foreground">{formatCurrency(product.rate)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                ref={introRef}
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                onBlur={() => saveQuoteField("intro_text", introText)}
                aria-label="Aanhef"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-hidden min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="disclaimer">Disclaimer</label>
              <textarea
                id="disclaimer"
                ref={disclaimerRef}
                value={disclaimer}
                onChange={(e) => setDisclaimer(e.target.value)}
                onBlur={() => saveQuoteField("disclaimer", disclaimer)}
                aria-label="Disclaimer"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-hidden min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl px-6 py-4 space-y-2">
            {fromDetail ? (
              <button
                onClick={() => router.push(`/dashboard/quotes/${id}`)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Annuleren
              </button>
            ) : (
              <button
                onClick={() => setShowDiscard(true)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Verwijderen
              </button>
            )}
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? "Bezig..." : fromDetail ? "Wijzigingen opslaan" : "Concept opslaan"}
            </Button>
          </div>
        </div>
      </div>

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
                <Button variant="outline" className="flex-1" onClick={() => setShowDiscard(false)}>
                  Annuleren
                </Button>
                <Button variant="secondary" className="flex-1" onClick={handleDiscard}>
                  Verwijderen
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

export default function NewQuoteItemsPage() {
  return (
    <Suspense fallback={<div />}>
      <NewQuoteItemsContent />
    </Suspense>
  );
}
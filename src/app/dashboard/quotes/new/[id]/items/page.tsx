"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Camera } from "lucide-react";
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

type Photo = {
  id: string;
  storage_path: string;
  url: string | null;
  line_item_id: string | null;
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

function getExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function resolveDisclaimer(template: string): string {
  return template.replace(/\[offertedatum \+ 30 dagen\]/gi, getExpiryDate());
}

export default function NewQuoteItemsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [items, setItems] = useState<LineItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [maxReachedFor, setMaxReachedFor] = useState<string | null>(null);

  const introRef = useAutoResize(introText);
  const disclaimerRef = useAutoResize(disclaimer);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const [itemsRes, photosRes] = await Promise.all([
        fetch(`/api/quotes/${id}/items?userId=${userId}`),
        fetch(`/api/quotes/${id}/photos?userId=${userId}`),
      ]);

      if (itemsRes.ok) {
        const { quote, lineItems, defaults, clientName, clientAddress } = await itemsRes.json();
        setItems(lineItems);
        setJobTitle(quote.job_title ?? "");
        const defaultIntro = `Beste [klantnaam],\n\nHierbij ontvangt u van ons de offerte voor de onderstaande werkzaamheden.\n\n[adres]`;
        setIntroText(quote.intro_text ?? defaults.intro ?? defaultIntro);
        setDisclaimer(quote.disclaimer ?? defaults.disclaimer ?? "Deze offerte is geldig tot [offertedatum + 30 dagen]. Na deze periode kunnen prijzen wijzigen.");
      }

      if (photosRes.ok) {
        const { photos } = await photosRes.json();
        setPhotos(photos ?? []);
      }

      setLoading(false);
    }
    load();
  }, [id]);

  function photosForItem(itemId: string) {
    return photos.filter(p => p.line_item_id === itemId);
  }

  async function handlePhotoUpload(itemId: string, file: File) {
    const userId = await getCurrentUserId();
    if (!userId) return;

    setUploadingFor(itemId);

    // Upload to Supabase Storage via browser client
    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/${id}/${itemId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('quote-photos')
      .upload(path, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploadingFor(null);
      return;
    }

    // Save reference via API
    const res = await fetch(`/api/quotes/${id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, storagePath: path, lineItemId: itemId, sortOrder: photosForItem(itemId).length }),
    });

    if (res.ok) {
      const { photo } = await res.json();
      setPhotos(prev => [...prev, photo]);
    }

    setUploadingFor(null);
  }

  async function handlePhotoDelete(photo: Photo) {
    const userId = await getCurrentUserId();
    if (!userId) return;

    await fetch(`/api/quotes/${id}/photos?userId=${userId}&photoId=${photo.id}&storagePath=${encodeURIComponent(photo.storage_path)}`, {
      method: 'DELETE',
    });

    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== photo.id);
      // Clear max warning if we now have room
      if (photo.line_item_id) {
        const remaining = updated.filter(p => p.line_item_id === photo.line_item_id).length;
        if (remaining < 3) setMaxReachedFor(null);
      }
      return updated;
    });
  }

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
    setPhotos(prev => prev.filter(p => p.line_item_id !== itemId));
  }

  function handleChange(itemId: string, field: keyof LineItem, value: unknown) {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, [field]: value } : item));
    updateItem(itemId, { [field]: value } as Partial<LineItem>);
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
            <div className="space-y-3">
              <label className="text-sm font-medium" htmlFor="job-title">Klusnaam</label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onBlur={() => saveQuoteField("job_title", jobTitle)}
                placeholder="Bijv. Badkamer renovatie Jansen, Dak reparatie nr. 12"
                aria-label="Klusnaam (niet zichtbaar voor klant)"
                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-4">
            {items.map((item) => {
              const itemPhotos = photosForItem(item.id);
              const isUploading = uploadingFor === item.id;

              return (
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

                  {/* Photo upload — max 3 vakjes */}
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, slotIndex) => {
                      const photo = itemPhotos[slotIndex];
                      const isThisSlotUploading = isUploading && !photo && slotIndex === itemPhotos.length;

                      if (photo) {
                        // Gevuld vakje
                        return (
                          <div key={photo.id} className="group relative h-20 w-20 flex-shrink-0">
                            {photo.url && (
                              <img
                                src={photo.url}
                                alt="Foto"
                                className="h-full w-full rounded-lg object-cover"
                              />
                            )}
                            <button
                              onClick={() => handlePhotoDelete(photo)}
                              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border shadow-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                              aria-label="Verwijder foto"
                            >
                              <Trash2 className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        );
                      }

                      if (slotIndex === itemPhotos.length) {
                        // Eerste lege slot — upload knop
                        return (
                          <label
                            key={`slot-${slotIndex}`}
                            className="flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/60"
                          >
                            {isThisSlotUploading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border border-muted-foreground border-t-transparent" />
                            ) : (
                              <Camera className="h-5 w-5 text-muted-foreground" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                const remaining = 3 - itemPhotos.length;
                                if (files.length > remaining) {
                                  setMaxReachedFor(item.id);
                                }
                                files.slice(0, remaining).forEach(file => handlePhotoUpload(item.id, file));
                                e.target.value = '';
                              }}
                            />
                          </label>
                        );
                      }

                      // Leeg slot na de upload knop — disabled weergave
                      return (
                        <div
                          key={`slot-${slotIndex}`}
                          className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-border/40 bg-muted/10"
                        >
                          <Camera className="h-5 w-5 text-muted-foreground/30" />
                        </div>
                      );
                    })}
                  </div>
                  {maxReachedFor === item.id && (
                    <p className="text-xs text-muted-foreground animate-in fade-in">
                      Maximum 3 foto's per post bereikt
                    </p>
                  )}

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

                  {item.quantity > 0 && item.rate > 0 && (
                    <p className="text-sm text-muted-foreground text-right">
                      Subtotaal (ex BTW):{" "}
                      <span className="font-medium text-foreground">
                        {formatCurrency(calcItemSubtotal(item))}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}

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
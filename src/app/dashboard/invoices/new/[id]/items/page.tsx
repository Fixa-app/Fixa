"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSmartBack } from "@/lib/use-smart-back";

type LineItem = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  rate: number;
  tax_percentage: number;
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

function calcItemSubtotal(item: LineItem) {
  return item.quantity * item.rate;
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

function DescriptionInput({ value, onChange, onBlur }: { value: string; onChange: (v: string) => void; onBlur: () => void }) {
  const ref = useAutoResize(value);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder="Omschrijving (optioneel)"
      rows={1}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-hidden"
    />
  );
}

export default function InvoiceItemsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const goBack = useSmartBack("/dashboard");

  const [items, setItems] = useState<LineItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const res = await fetch(`/api/invoices/${id}?userId=${userId}`);
      if (!res.ok) return;
      const json = await res.json();
      setItems(json.lineItems ?? []);
      setInvoiceNumber(json.invoice?.invoice_number ?? "");
      setLoading(false);
    }
    load();
  }, [id]);

  async function saveField(field: string, value: unknown) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [field]: value }),
    });
  }

  function handleChange(itemId: string, field: keyof LineItem, value: unknown) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    );
  }

  async function saveItemField(itemId: string, field: string, value: unknown) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/invoices/${id}/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId, [field]: value }),
    });
  }

  async function handleAdd() {
    const userId = await getCurrentUserId();
    if (!userId) return;
    const res = await fetch(`/api/invoices/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return;
    const { lineItem } = await res.json();
    setItems((prev) => [...prev, lineItem]);
  }

  async function handleDelete(itemId: string) {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await fetch(`/api/invoices/${id}/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId }),
    });
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  async function handleSave() {
    setSaving(true);
    router.push(`/dashboard/invoices/new/${id}/preview`);
    setSaving(false);
  }

  const subtotal = items.reduce((sum, item) => sum + calcItemSubtotal(item), 0);
  const taxTotal = items.reduce((sum, item) => sum + calcItemSubtotal(item) * (item.tax_percentage / 100), 0);
  const total = subtotal + taxTotal;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Laden...</p></div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-6 mx-auto w-full max-w-2xl pb-40">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Terug">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/2 bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">1/2</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold">Factuur samenstellen</h1>
          <p className="text-sm text-muted-foreground">{invoiceNumber}</p>
        </div>

        {/* Line items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleChange(item.id, "title", e.target.value)}
                  onBlur={() => saveItemField(item.id, "title", item.title)}
                  placeholder="Omschrijving werkzaamheden"
                  className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label="Verwijder regel"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <DescriptionInput
                value={item.description}
                onChange={(v) => handleChange(item.id, "description", v)}
                onBlur={() => saveItemField(item.id, "description", item.description)}
              />

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Aantal</label>
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) => handleChange(item.id, "quantity", Number(e.target.value) || 0)}
                    onBlur={() => saveItemField(item.id, "quantity", item.quantity)}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Prijs (ex BTW)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.rate}
                    onChange={(e) => handleChange(item.id, "rate", Number(e.target.value) || 0)}
                    onBlur={() => saveItemField(item.id, "rate", item.rate)}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">BTW %</label>
                  <select
                    value={item.tax_percentage}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      handleChange(item.id, "tax_percentage", v);
                      saveItemField(item.id, "tax_percentage", v);
                    }}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value={0}>0%</option>
                    <option value={9}>9%</option>
                    <option value={21}>21%</option>
                  </select>
                </div>
              </div>

              {item.quantity > 0 && item.rate > 0 && (
                <p className="text-sm text-muted-foreground text-right">
                  Subtotaal: <span className="font-medium text-foreground">{formatCurrency(calcItemSubtotal(item))}</span>
                </p>
              )}
            </div>
          ))}

          <button
            onClick={handleAdd}
            className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-border p-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Meerwerk toevoegen</p>
              <p className="text-sm text-muted-foreground">Extra regel toevoegen aan de factuur</p>
            </div>
          </button>
        </div>

        {/* Totalen */}
        {items.length > 0 && (
          <div className="rounded-2xl bg-card p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotaal ex BTW</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">BTW</span>
              <span>{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>Totaal incl. BTW</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          <Button className="w-full" onClick={handleSave} disabled={saving || items.length === 0}>
            {saving ? "Bezig..." : "Volgende"}
          </Button>
        </div>
      </div>
    </div>
  );
}
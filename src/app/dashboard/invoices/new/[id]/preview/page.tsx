"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_BADGE } from "@/lib/status-config";
import { formatRelativeTime } from "@/lib/format-relative-time";

type LineItem = {
  id: string;
  title: string | null;
  description: string;
  quantity: number;
  rate: number;
  tax_percentage: number;
};

type InvoiceData = {
  invoice: {
    id: string;
    invoice_number: string | null;
    status: string;
    due_date: string | null;
    updated_at: string;
  };
  lineItems: LineItem[];
  client: { name: string; address: string | null; phone: string | null; email: string | null } | null;
  company: {
    name: string;
    street: string | null;
    city: string | null;
    postal: string | null;
    phone: string | null;
    email: string | null;
    kvk: string | null;
    vat_number: string | null;
    iban: string | null;
    logo_url: string | null;
  } | null;
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export default function InvoicePreviewPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const res = await fetch(`/api/invoices/${id}?userId=${userId}`);
      if (!res.ok) return;
      setData(await res.json());
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSend() {
    setSending(true);
    const userId = await getCurrentUserId();
    if (!userId) { setSending(false); return; }

    // Haal definitief factuurnummer op via de send-route
    const res = await fetch(`/api/invoices/${id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      router.push(`/dashboard/invoices/${id}`);
    }
    setSending(false);
  }

  if (loading || !data) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Laden...</p></div>;
  }

  const { invoice, lineItems, client, company } = data;
  const subtotal = lineItems.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const taxTotal = lineItems.reduce((sum, i) => sum + i.quantity * i.rate * (i.tax_percentage / 100), 0);
  const total = subtotal + taxTotal;
  const invoiceDate = formatDate(new Date().toISOString());
  const dueDateStr = invoice.due_date ? formatDate(invoice.due_date) : formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-2xl space-y-4 pb-32">

        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/dashboard/invoices/new/${id}/items`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-full bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">2/2</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold">{client?.name ?? "Factuur"}</h1>
          <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
          <div className="flex items-center gap-2">
            <Badge variant={INVOICE_STATUS_BADGE[invoice.status as keyof typeof INVOICE_STATUS_BADGE] ?? "secondary"}>
              {INVOICE_STATUS_LABELS[invoice.status as keyof typeof INVOICE_STATUS_LABELS] ?? invoice.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatRelativeTime(invoice.updated_at)}</span>
          </div>
        </div>

        {/* Factuur document */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                {company?.logo_url && <img src={company.logo_url} alt={company.name} className="h-12 w-auto object-contain mb-2" />}
                <p className="font-bold">{company?.name}</p>
                {company?.street && <p className="text-sm text-muted-foreground">{company.street}</p>}
                {company?.postal && company?.city && <p className="text-sm text-muted-foreground">{company.postal} {company.city}</p>}
                {company?.phone && <p className="text-sm text-muted-foreground">{company.phone}</p>}
                {company?.email && <p className="text-sm text-muted-foreground">{company.email}</p>}
              </div>
              <div className="text-right space-y-1 flex-shrink-0">
                {company?.kvk && <p className="text-xs text-muted-foreground">KVK: {company.kvk}</p>}
                {company?.vat_number && <p className="text-xs text-muted-foreground">BTW: {company.vat_number}</p>}
                {company?.iban && <p className="text-xs text-muted-foreground">IBAN: {company.iban}</p>}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold">{client?.name}</p>
                {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
              </div>
              <div className="text-right space-y-1 flex-shrink-0">
                <p className="text-sm"><span className="text-muted-foreground">Factuur: </span><span className="font-medium">{invoice.invoice_number}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Datum: </span><span className="font-medium">{invoiceDate}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Vervaldatum: </span><span className="font-medium">{dueDateStr}</span></p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-muted-foreground pb-2">Omschrijving</th>
                  <th className="text-right font-medium text-muted-foreground pb-2 w-12">Aant.</th>
                  <th className="text-right font-medium text-muted-foreground pb-2 w-20">Prijs</th>
                  <th className="text-right font-medium text-muted-foreground pb-2 w-24">Totaal</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-3">
                      <p className="font-medium">{item.title || "—"}</p>
                      {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                    </td>
                    <td className="text-right py-3 text-muted-foreground">{item.quantity}</td>
                    <td className="text-right py-3">{formatCurrency(item.rate)}</td>
                    <td className="text-right py-3 font-medium">{formatCurrency(item.quantity * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6">
            <div className="ml-auto max-w-xs space-y-1">
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
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl px-6 py-4 space-y-2">
          <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/invoices/new/${id}/items`)}>
            Terug naar bewerken
          </Button>
          <Button className="w-full" onClick={handleSend} disabled={sending}>
            <Send className="h-4 w-4" />
            {sending ? "Bezig..." : "Factuur versturen"}
          </Button>
        </div>
      </div>
    </div>
  );
}
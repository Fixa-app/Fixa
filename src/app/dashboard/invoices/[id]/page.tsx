"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer } from "vaul";
import { createClient } from "@/lib/supabase/client";
import { useSmartBack } from "@/lib/use-smart-back";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_BADGE, type InvoiceStatus } from "@/lib/status-config";
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
    status: InvoiceStatus;
    due_date: string | null;
    sent_at: string | null;
    paid_at: string | null;
    updated_at: string;
    created_at: string;
  };
  lineItems: LineItem[];
  client: { name: string; address: string | null; email: string | null; phone: string | null } | null;
  company: { name: string; logo_url: string | null } | null;
};

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(amount).replace(/\s/g, "");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("31")) return digits;
  if (digits.startsWith("0")) return "31" + digits.slice(1);
  return digits;
}

const WORKFLOW_STATUS_OPTIONS: InvoiceStatus[] = ["awaiting_payment", "paid", "past_due"];

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const goBack = useSmartBack("/dashboard/invoices");

  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  async function handleStatusChange(status: InvoiceStatus) {
    setUpdatingStatus(true);
    const userId = await getCurrentUserId();
    if (!userId) { setUpdatingStatus(false); return; }

    const updates: Record<string, unknown> = { status };
    if (status === 'paid') updates.paid_at = new Date().toISOString();

    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...updates }),
    });

    setData((prev) => prev ? { ...prev, invoice: { ...prev.invoice, status, ...updates } as InvoiceData['invoice'] } : null);
    setStatusSheetOpen(false);
    setUpdatingStatus(false);
  }

  if (loading || !data) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Laden...</p></div>;
  }

  const { invoice, lineItems, client, company } = data;
  const subtotal = lineItems.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const taxTotal = lineItems.reduce((sum, i) => sum + i.quantity * i.rate * (i.tax_percentage / 100), 0);
  const total = subtotal + taxTotal;
  const phoneHref = client?.phone ? `tel:${client.phone}` : undefined;
  const whatsappHref = client?.phone ? `https://wa.me/${toWhatsAppNumber(client.phone)}` : undefined;

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-2xl space-y-4 pb-32">

          <div className="flex items-center gap-4">
            <button onClick={goBack} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Terug">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-2xl font-bold flex-1 truncate">{invoice.invoice_number ?? "Factuur"}</h1>
          </div>

          {/* Status + tijd */}
          <div className="flex items-center gap-2">
            <Badge variant={INVOICE_STATUS_BADGE[invoice.status] ?? "secondary"}>
              <CheckCircle2 className="h-3 w-3" />
              {INVOICE_STATUS_LABELS[invoice.status] ?? invoice.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatRelativeTime(invoice.updated_at)}</span>
          </div>

          {/* Client */}
          <div className="rounded-2xl bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Klant</h2>
              <div className="flex items-center gap-2">
                {phoneHref && (
                  <a href={phoneHref} aria-label="Bel klant" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors">
                    <Phone className="h-4 w-4" />
                  </a>
                )}
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold">{client?.name ?? "Onbekende klant"}</p>
              {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
              {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
              {client?.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
            </div>
          </div>

          {/* Factuurgegevens */}
          <div className="rounded-2xl bg-card p-5 space-y-2">
            <h2 className="font-display text-xl font-bold mb-3">Factuur</h2>
            {invoice.sent_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Verstuurd op</span>
                <span>{formatDate(invoice.sent_at)}</span>
              </div>
            )}
            {invoice.due_date && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vervaldatum</span>
                <span>{formatDate(invoice.due_date)}</span>
              </div>
            )}
            {invoice.paid_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Betaald op</span>
                <span>{formatDate(invoice.paid_at)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-border space-y-1">
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

          {/* Regels */}
          <div className="rounded-2xl bg-card p-5 space-y-3">
            <h2 className="font-display text-xl font-bold">Regels</h2>
            {lineItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.title || "—"}</p>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                  <p className="text-xs text-muted-foreground">{item.quantity}× {formatCurrency(item.rate)}</p>
                </div>
                <p className="font-medium flex-shrink-0">{formatCurrency(item.quantity * item.rate)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl px-6 py-4">
            <Button className="w-full" onClick={() => setStatusSheetOpen(true)}>
              Status wijzigen
            </Button>
          </div>
        </div>
      </div>

      {/* Status-sheet */}
      <Drawer.Root open={statusSheetOpen} onOpenChange={setStatusSheetOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6 space-y-2">
              <Drawer.Title className="font-display text-xl font-bold mb-4">Status wijzigen</Drawer.Title>
              {WORKFLOW_STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updatingStatus || invoice.status === status}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-muted disabled:opacity-40 ${invoice.status === status ? "bg-muted" : ""}`}
                >
                  <Badge variant={INVOICE_STATUS_BADGE[status] ?? "secondary"}>
                    {INVOICE_STATUS_LABELS[status]}
                  </Badge>
                  {invoice.status === status && <span className="text-xs text-muted-foreground">Huidig</span>}
                </button>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
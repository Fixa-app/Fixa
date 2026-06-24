"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSmartBack } from "@/lib/use-smart-back";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_BADGE,
  QUOTE_WORKFLOW_STATUS_OPTIONS,
  type QuoteStatus,
} from "@/lib/status-config";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MoreVertical,
  Pencil,
  Archive,
  Check,
  Share2,
} from "lucide-react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

type LineItem = {
  id: string;
  title: string | null;
  description: string;
  quantity: number;
  rate: number;
  tax_percentage: number;
};

type QuoteData = {
  quote: {
    id: string;
    job_title: string | null;
    intro_text: string | null;
    disclaimer: string | null;
    quote_number: string | null;
    status: QuoteStatus;
    created_at: string;
    updated_at: string;
    sent_at: string | null;
  };
  lineItems: LineItem[];
  client: {
    name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  company: {
    name: string;
    logo_url: string | null;
  } | null;
};

const STATUS_LABEL = QUOTE_STATUS_LABELS;
const STATUS_BADGE_VARIANT = QUOTE_STATUS_BADGE;
const WORKFLOW_STATUS_OPTIONS = QUOTE_WORKFLOW_STATUS_OPTIONS;

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

function resolveTokens(text: string, clientName: string, address: string): string {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const expiryStr = expiryDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  return text
    .replace(/\[klantnaam\]/gi, clientName)
    .replace(/\[adres\]/gi, address)
    .replace(/\[offertedatum \+ 30 dagen\]/gi, expiryStr);
}

function calcTotals(items: LineItem[]) {
  const byTax: Record<number, number> = { 0: 0, 9: 0, 21: 0 };
  let subtotal = 0;
  for (const item of items) {
    const s = item.quantity * item.rate;
    subtotal += s;
    byTax[item.tax_percentage] = (byTax[item.tax_percentage] ?? 0) + s;
  }
  const taxTotal = Object.entries(byTax).reduce((sum, [rate, base]) => sum + base * (Number(rate) / 100), 0);
  return { subtotal, byTax, taxTotal, total: subtotal + taxTotal };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function toWhatsAppNumber(phone: string): string {
  // Verwacht NL-nummers; +31 of 06 formaat naar internationaal zonder + en spaties
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("31")) return digits;
  if (digits.startsWith("0")) return "31" + digits.slice(1);
  return digits;
}

export default function QuoteDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const goBack = useSmartBack("/dashboard/quotes");

  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sharing, setSharing] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const res = await fetch(`/api/quotes/${id}?userId=${userId}`);
      if (!res.ok) return;
      const json: QuoteData = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleShare() {
    if (!data) return;
    setSharing(true);
    const userId = await getCurrentUserId();
    if (!userId) { setSharing(false); return; }

    const res = await fetch(`/api/quotes/${id}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) { setSharing(false); return; }
    const { token } = await res.json();
    const hubUrl = `${window.location.origin}/hub/${token}`;

    // Geen 'text' meegeven — sommige share-doelen (zoals "Kopiëren") plakken
    // title/text en url samen, waardoor de URL niet los te gebruiken is.
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Offerte van ${data.company?.name ?? "Fixa"}`,
          url: hubUrl,
        });
      } catch {
        // Gebruiker annuleerde het deelmenu — geen actie nodig
      }
    } else {
      await navigator.clipboard.writeText(hubUrl);
    }

    setSharing(false);
  }

  async function handleStatusChange(status: QuoteStatus) {
    if (!data) return;
    setUpdatingStatus(true);
    const userId = await getCurrentUserId();
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status }),
    });
    setData({ ...data, quote: { ...data.quote, status } });
    setUpdatingStatus(false);
    setStatusSheetOpen(false);
  }

  async function handleArchive() {
    if (!data) return;
    setUpdatingStatus(true);
    const userId = await getCurrentUserId();
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: "archived" }),
    });
    setUpdatingStatus(false);
    setStatusSheetOpen(false);
    setArchiveConfirmOpen(false);
    router.push("/dashboard/quotes");
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  const { quote, lineItems, client } = data;
  const clientName = client?.name ?? "";
  const clientAddress = client?.address ?? "";
  const introText = resolveTokens(quote.intro_text ?? "", clientName, clientAddress);
  const disclaimerText = resolveTokens(quote.disclaimer ?? "", clientName, clientAddress);
  const { subtotal, byTax, total } = calcTotals(lineItems);
  const canConvert = quote.status === "ready_to_schedule";
  const wasEdited = quote.updated_at !== quote.created_at;
  const whatsappHref = client?.phone
    ? `https://wa.me/${toWhatsAppNumber(client.phone)}`
    : undefined;
  const phoneHref = client?.phone ? `tel:${client.phone}` : undefined;

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-2xl space-y-4 pb-32">

          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Terug"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-2xl font-bold flex-1 ml-3">Offerte details</h1>
            <button
              onClick={handleShare}
              disabled={sharing}
              aria-label="Deel met klant"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => router.push(`/dashboard/quotes/new/${id}`)}
              aria-label="Offerte bewerken"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors ml-2"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          {/* Client sectie */}
          <div className="rounded-2xl bg-card p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Klant</h2>
              <div className="flex items-center gap-2">
                {phoneHref && (
                  <a
                    href={phoneHref}
                    aria-label="Bel klant"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Stuur WhatsApp naar klant"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                <div className="relative" ref={overflowRef}>
                  <button
                    onClick={() => setOverflowOpen((o) => !o)}
                    aria-label="Meer opties"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {overflowOpen && (
                    <div className="absolute right-0 top-11 z-10 w-48 rounded-xl border border-border bg-background shadow-md animate-in fade-in duration-200">
                      <button
                        onClick={() => { setOverflowOpen(false); setStatusSheetOpen(true); }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-left hover:bg-muted/40 transition-colors rounded-xl"
                      >
                        Status wijzigen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-bold">{client?.name}</p>
                {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
                {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                {client?.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
              </div>
              <Badge variant={STATUS_BADGE_VARIANT[quote.status]} className="flex-shrink-0">
                {STATUS_LABEL[quote.status]}
              </Badge>
            </div>
          </div>

          {/* Job title sectie */}
          <div className="rounded-2xl bg-card p-5 space-y-1 animate-in fade-in duration-300">
            <h1 className="font-display text-2xl font-bold select-text">
              {quote.job_title || "Naamloze offerte"}
            </h1>
            <p className="text-sm text-muted-foreground select-text">
              {quote.quote_number ?? "Conceptnummer nog niet toegewezen"}
            </p>
            {wasEdited && (
              <p className="text-xs text-muted-foreground">
                Laatst gewijzigd op {formatDate(quote.updated_at)}
              </p>
            )}
          </div>

          {/* Offer sectie */}
          <div className="rounded-2xl bg-card overflow-hidden animate-in fade-in duration-300">
            <div className="p-5 pb-0">
              <h2 className="font-display text-xl font-bold">Offerte</h2>
            </div>

            <div className="p-5 overflow-x-auto" role="table">
              <table className="w-full text-sm">
                <thead>
                  <tr role="row" className="border-b border-border">
                    <th role="columnheader" className="text-left font-medium text-muted-foreground pb-2">Omschrijving</th>
                    <th role="columnheader" className="text-right font-medium text-muted-foreground pb-2 w-12">Aant.</th>
                    <th role="columnheader" className="text-right font-medium text-muted-foreground pb-2 w-20">Prijs</th>
                    <th role="columnheader" className="text-right font-medium text-muted-foreground pb-2 w-12">BTW</th>
                    <th role="columnheader" className="text-right font-medium text-muted-foreground pb-2 w-24">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, i) => (
                    <tr
                      key={item.id}
                      role="row"
                      className="border-b border-border/50 animate-in fade-in slide-in-from-bottom-1"
                      style={{ animationDelay: `${i * 60}ms`, animationDuration: "300ms" }}
                    >
                      <td role="cell" className="py-3">
                        <p className="font-medium">{item.title || "—"}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td role="cell" className="text-right py-3 text-muted-foreground">{item.quantity}</td>
                      <td role="cell" className="text-right py-3">{formatCurrency(item.rate)}</td>
                      <td role="cell" className="text-right py-3 text-muted-foreground">{item.tax_percentage}%</td>
                      <td role="cell" className="text-right py-3 font-medium">{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 pb-5">
              <div className="ml-auto max-w-xs space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotaal ex BTW</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {Object.entries(byTax).map(([rate, base]) =>
                  base > 0 ? (
                    <div key={rate} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{rate}% BTW</span>
                      <span>{formatCurrency(base * (Number(rate) / 100))}</span>
                    </div>
                  ) : null
                )}
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Totaal incl. BTW</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text sectie */}
          {(introText || disclaimerText) && (
            <div className="rounded-2xl bg-card p-5 space-y-4 animate-in fade-in duration-300" style={{ animationDelay: "150ms" }}>
              <h2 className="font-display text-xl font-bold">Tekst</h2>
              {introText && (
                <p className="text-sm whitespace-pre-line leading-relaxed">{introText}</p>
              )}
              {disclaimerText && (
                <p className="text-xs text-muted-foreground whitespace-pre-line border-t border-border pt-3">
                  {disclaimerText}
                </p>
              )}
            </div>
          )}

          {/* Log sectie */}
          <div className="rounded-2xl bg-card p-5 space-y-3 animate-in fade-in duration-300" style={{ animationDelay: "200ms" }}>
            <h2 className="font-display text-xl font-bold">Geschiedenis</h2>
            <div className="space-y-3">
              <div className="text-sm animate-in fade-in" style={{ animationDelay: "0ms" }}>
                <p className="font-medium">Offerte aangemaakt</p>
                <p className="text-xs text-muted-foreground">{formatDate(quote.created_at)}</p>
              </div>
              {quote.sent_at && (
                <div className="text-sm animate-in fade-in" style={{ animationDelay: "150ms" }}>
                  <p className="font-medium">Offerte verstuurd</p>
                  <p className="text-xs text-muted-foreground">{formatDate(quote.sent_at)}</p>
                </div>
              )}
              {!quote.sent_at && (
                <p className="text-sm text-muted-foreground">Nog geen verdere activiteit.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky convert bar */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl px-6 py-4 space-y-1">
            {!canConvert && (
              <p className="text-xs text-center text-muted-foreground">
                Beschikbaar zodra de klant deze offerte accepteert
              </p>
            )}
            <Button
              className="w-full"
              disabled={!canConvert}
              aria-label="Offerte omzetten naar opdracht"
            >
              Offerte omzetten naar opdracht
            </Button>
          </div>
        </div>
      </div>

      {/* Status wijzigen bottom sheet */}
      <Drawer.Root open={statusSheetOpen} onOpenChange={setStatusSheetOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6 space-y-1">
              <Drawer.Title className="font-display text-xl font-bold mb-3">Status wijzigen</Drawer.Title>
              {WORKFLOW_STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updatingStatus}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-muted/40 transition-colors"
                >
                  <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
                  {quote.status === status && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}

              <div className="border-t border-border my-2" />

              <button
                onClick={() => { setStatusSheetOpen(false); setArchiveConfirmOpen(true); }}
                disabled={updatingStatus}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-muted/40 transition-colors text-muted-foreground"
              >
                <Archive className="h-4 w-4" />
                <span className="text-sm font-medium">Archiveren</span>
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Archive confirm sheet */}
      <Drawer.Root open={archiveConfirmOpen} onOpenChange={setArchiveConfirmOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6 space-y-4">
              <Drawer.Title className="font-display text-xl font-bold">Offerte archiveren?</Drawer.Title>
              <p className="text-sm text-muted-foreground">
                De offerte verdwijnt uit je actieve lijst maar blijft bewaard.
              </p>
              <div className="flex gap-3 pb-safe">
                <Button variant="outline" className="flex-1" onClick={() => setArchiveConfirmOpen(false)}>
                  Annuleren
                </Button>
                <Button variant="secondary" className="flex-1" onClick={handleArchive}>
                  Archiveren
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
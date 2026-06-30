"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Check, MessageSquare, FileText, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";

type LineItem = {
  id: string;
  title: string | null;
  description: string;
  quantity: number;
  rate: number;
  tax_percentage: number;
};

type HubData = {
  quote: {
    id: string;
    job_title: string | null;
    intro_text: string | null;
    disclaimer: string | null;
    quote_number: string | null;
    status: string;
    approved_at: string | null;
  };
  lineItems: LineItem[];
  client: { name: string; address: string | null } | null;
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

function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("31")) return digits;
  if (digits.startsWith("0")) return "31" + digits.slice(1);
  return digits;
}

function formatAcceptedDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
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
  return { subtotal, byTax, total: subtotal + taxTotal };
}

export default function ClientHubPage() {
  const { token } = useParams<{ token: string }>();

  const [data, setData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundOrExpired, setNotFoundOrExpired] = useState<"not_found" | "expired" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionTaken, setActionTaken] = useState<"accepted" | "changes_requested" | null>(null);
  const [changesSheetOpen, setChangesSheetOpen] = useState(false);
  const [changesMessage, setChangesMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/hub/${token}`);
      if (res.status === 404) { setNotFoundOrExpired("not_found"); setLoading(false); return; }
      if (res.status === 410) { setNotFoundOrExpired("expired"); setLoading(false); return; }
      if (!res.ok) { setLoading(false); return; }
      const json: HubData = await res.json();
      setData(json);
      if (json.quote.status === "ready_to_schedule") setActionTaken("accepted");
      if (json.quote.status === "changes_requested") setActionTaken("changes_requested");
      setLoading(false);
    }
    load();
  }, [token]);

  async function handleAccept() {
    setSubmitting(true);
    const res = await fetch(`/api/hub/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    });
    if (res.ok) setActionTaken("accepted");
    setSubmitting(false);
  }

  async function handleRequestChanges() {
    if (!changesMessage.trim()) return;
    setSubmitting(true);
    const res = await fetch(`/api/hub/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request_changes", message: changesMessage }),
    });
    if (res.ok) {
      setActionTaken("changes_requested");
      setChangesSheetOpen(false);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  if (notFoundOrExpired === "not_found") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">Deze offerte kon niet gevonden worden.</p>
      </div>
    );
  }

  if (notFoundOrExpired === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">Deze link is verlopen. Vraag de aannemer om een nieuwe link.</p>
      </div>
    );
  }

  if (!data) return null;

  const { quote, lineItems, client, company } = data;
  const clientName = client?.name ?? "";
  const clientAddress = client?.address ?? "";
  const introText = resolveTokens(quote.intro_text ?? "", clientName, clientAddress);
  const disclaimerText = resolveTokens(quote.disclaimer ?? "", clientName, clientAddress);
  const { subtotal, byTax, total } = calcTotals(lineItems);
  const quoteDate = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  const companyPhoneHref = company?.phone ? `tel:${company.phone}` : undefined;
  const companyWhatsappHref = company?.phone ? `https://wa.me/${toWhatsAppNumber(company.phone)}` : undefined;

  const ActionPanel = (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card p-5 space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide">Offerte</span>
        </div>
        <p className="font-bold text-lg">{quote.job_title || company?.name}</p>
        {quote.quote_number && <p className="text-sm text-muted-foreground">{quote.quote_number}</p>}
      </div>

      <div className="rounded-2xl bg-card p-5 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Totaalbedrag</p>
        <p className="font-display text-2xl font-bold">{formatCurrency(total)}</p>
        <p className="text-xs text-muted-foreground">incl. BTW</p>
      </div>

      <div className="rounded-2xl bg-card p-5 space-y-3">
        {actionTaken === "accepted" ? (
          <div>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Check className="h-5 w-5 flex-shrink-0" />
              Geaccepteerd
            </div>
            {quote.approved_at && (
              <p className="text-xs text-muted-foreground mt-1">{formatAcceptedDate(quote.approved_at)}</p>
            )}
          </div>
        ) : actionTaken === "changes_requested" ? (
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <MessageSquare className="h-5 w-5 flex-shrink-0" />
            Je vraag is verstuurd
          </div>
        ) : (
          <>
            <Button className="w-full" onClick={handleAccept} disabled={submitting}>
              {submitting ? "Bezig..." : "Offerte accepteren"}
            </Button>
            <button
              onClick={() => setChangesSheetOpen(true)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Ik heb een vraag of wijziging
            </button>
          </>
        )}
      </div>

      {company && (
        <div className="rounded-2xl bg-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Contact</p>
          <p className="text-sm font-medium">{company.name}</p>
          {(companyPhoneHref || companyWhatsappHref) && (
            <div className="flex items-center gap-2">
              {companyPhoneHref && (
                <a
                  href={companyPhoneHref}
                  aria-label="Bel de aannemer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted/40 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
              {companyWhatsappHref && (
                <a
                  href={companyWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Stuur WhatsApp naar de aannemer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted/40 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
          {company.email && <p className="text-sm text-muted-foreground">{company.email}</p>}
        </div>
      )}
    </div>
  );

  const DocumentPanel = (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {company?.logo_url && (
              <img src={company.logo_url} alt={company.name} className="h-12 w-auto object-contain mb-2" />
            )}
            <p className="font-bold">{company?.name}</p>
            {company?.street && <p className="text-sm text-muted-foreground">{company.street}</p>}
            {company?.postal && company?.city && (
              <p className="text-sm text-muted-foreground">{company.postal} {company.city}</p>
            )}
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
            {quote.quote_number && (
              <p className="text-sm"><span className="text-muted-foreground">Offerte: </span><span className="font-medium">{quote.quote_number}</span></p>
            )}
            <p className="text-sm"><span className="text-muted-foreground">Datum: </span><span className="font-medium">{quoteDate}</span></p>
          </div>
        </div>
      </div>

      {introText && (
        <div className="p-6 border-b border-border">
          <p className="text-sm whitespace-pre-line">{introText}</p>
        </div>
      )}

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

      <div className="p-6 border-b border-border">
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

      {disclaimerText && (
        <div className="p-6">
          <p className="text-xs text-muted-foreground whitespace-pre-line">{disclaimerText}</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        {/* Desktop: twee kolommen, document links + sticky actiesidebar rechts */}
        <div className="hidden lg:flex mx-auto w-full max-w-6xl gap-6 p-6">
          <div className="flex-1 min-w-0">{DocumentPanel}</div>
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-6">{ActionPanel}</div>
          </div>
        </div>

        {/* Mobiel: gestapeld, document eerst, acties als sticky footer onderaan */}
        <div className="lg:hidden mx-auto w-full max-w-2xl p-4 space-y-4 pb-32">
          {DocumentPanel}
        </div>
      </div>

      {/* Mobiele sticky actiebar — desktop heeft de sidebar al */}
      <div className="lg:hidden sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl px-6 py-4 space-y-2">
          {actionTaken === "accepted" ? (
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <Check className="h-5 w-5" />
                Geaccepteerd
              </div>
              {quote.approved_at && (
                <p className="text-xs text-muted-foreground mt-1">{formatAcceptedDate(quote.approved_at)}</p>
              )}
            </div>
          ) : actionTaken === "changes_requested" ? (
            <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground font-medium">
              <MessageSquare className="h-5 w-5" />
              Je vraag is verstuurd
            </div>
          ) : (
            <>
              <button
                onClick={() => setChangesSheetOpen(true)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Ik heb een vraag of wijziging
              </button>
              <div className="flex items-center gap-2">
                {companyPhoneHref && (
                  <a
                    href={companyPhoneHref}
                    aria-label="Bel de aannemer"
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border hover:bg-muted/40 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
                {companyWhatsappHref && (
                  <a
                    href={companyWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Stuur WhatsApp naar de aannemer"
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border hover:bg-muted/40 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                <Button className="flex-1" onClick={handleAccept} disabled={submitting}>
                  {submitting ? "Bezig..." : "Offerte accepteren"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Wijziging aanvragen sheet */}
      <Drawer.Root open={changesSheetOpen} onOpenChange={setChangesSheetOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[10px] bg-background">
            <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="p-6 space-y-4">
              <Drawer.Title className="font-display text-xl font-bold">Wat wil je laten weten?</Drawer.Title>
              <textarea
                value={changesMessage}
                onChange={(e) => setChangesMessage(e.target.value)}
                placeholder="Bijv. Kunnen jullie ook de douche meenemen in de offerte?"
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="flex gap-3 pb-safe">
                <Button variant="outline" className="flex-1" onClick={() => setChangesSheetOpen(false)}>
                  Annuleren
                </Button>
                <Button className="flex-1" onClick={handleRequestChanges} disabled={!changesMessage.trim() || submitting}>
                  {submitting ? "Bezig..." : "Versturen"}
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
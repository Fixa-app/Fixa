"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type LineItem = {
  id: string;
  title: string | null;
  description: string;
  quantity: number;
  rate: number;
  tax_percentage: number;
  sort_order: number;
};

type QuoteData = {
  quote: {
    id: string;
    job_title: string | null;
    intro_text: string | null;
    disclaimer: string | null;
    quote_number: string | null;
    status: string;
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
  settings: {
    next_quote_number: number | null;
    quote_number_format: string | null;
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

function resolveTokens(text: string, clientName: string, address: string): string {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const expiryStr = expiryDate.toLocaleDateString("nl-NL", {
    day: "numeric", month: "long", year: "numeric"
  });

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
  const taxTotal = Object.entries(byTax).reduce(
    (sum, [rate, base]) => sum + base * (Number(rate) / 100), 0
  );
  return { subtotal, byTax, taxTotal, total: subtotal + taxTotal };
}

function previewQuoteNumber(settings: QuoteData['settings']): string {
  if (!settings?.next_quote_number) return "—";
  const year = new Date().getFullYear();
  const format = settings.quote_number_format ?? '{YEAR}-{NUMBER}';
  return format
    .replace('{YEAR}', String(year))
    .replace('{NUMBER}', String(settings.next_quote_number).padStart(3, '0'));
}

export default function NewQuotePreviewPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [quoteNumberDraft, setQuoteNumberDraft] = useState("");
  const [savingQuoteNumber, setSavingQuoteNumber] = useState(false);
  const [savedQuoteNumber, setSavedQuoteNumber] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const res = await fetch(`/api/quotes/${id}/preview?userId=${userId}`);
      if (!res.ok) return;

      const json = await res.json();
      setData(json);
      setLogoUrl(json.company?.logo_url ?? null);
      setSavedQuoteNumber(json.settings?.next_quote_number ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSend() {
    setSending(true);
    const userId = await getCurrentUserId();
    if (!userId) { setSending(false); return; }

    const res = await fetch(`/api/quotes/${id}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setSent(true);
      setTimeout(() => router.push("/dashboard/quotes"), 1500);
    }
    setSending(false);
  }

  async function handleLogoUpload(file: File) {
    if (file.size > 1024 * 1024) return;
    setLogoUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "png";
    const path = `${data?.company?.name?.replace(/\s+/g, "-") ?? "company"}/logo.${ext}`;
    const { error } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
      const url = urlData.publicUrl + `?t=${Date.now()}`;
      await fetch(`/api/quotes/${id}/preview`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: await getCurrentUserId(), logoUrl: url, companyId: data?.company ? (data as any).companyId : null }),
      });
      setLogoUrl(url);
    }
    setLogoUploading(false);
  }

  async function handleSaveQuoteNumber() {
    setSavingQuoteNumber(true);
    const userId = await getCurrentUserId();
    const num = parseInt(quoteNumberDraft) || 1;
    await fetch(`/api/quotes/${id}/preview`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nextQuoteNumber: num, companyId: (data as any)?.quote?.company_id }),
    });
    setSavedQuoteNumber(num);
    setSavingQuoteNumber(false);
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  const { quote, lineItems, client, company, settings } = data;
  const clientName = client?.name ?? "";
  const clientAddress = client?.address ?? "";
  const introText = resolveTokens(quote.intro_text ?? "", clientName, clientAddress);
  const disclaimerText = resolveTokens(quote.disclaimer ?? "", clientName, clientAddress);
  const { subtotal, byTax, taxTotal, total } = calcTotals(lineItems);
  const quoteNumber = quote.quote_number ?? previewQuoteNumber(settings);
  const quoteDate = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-2xl pb-32">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push(`/dashboard/quotes/new/${id}/items`)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Terug"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">3/3</span>
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold mb-6">Controleer je offerte</h1>

          {/* Offerte document */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">

            {/* Header offerte */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={company?.name}
                      className="h-12 w-auto object-contain mb-2"
                    />
                  ) : (
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 mb-2 hover:bg-muted/60 transition-colors">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {logoUploading ? "Uploaden..." : "Logo toevoegen"}
                      </span>
                      <input type="file" accept="image/jpeg,image/png" className="hidden" disabled={logoUploading}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = ""; }} />
                    </label>
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

            {/* Klant + offerte info */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold">{client?.name}</p>
                  {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
                </div>
                <div className="text-right space-y-1 flex-shrink-0">
                  {savedQuoteNumber || quote.quote_number ? (
                    <p className="text-sm"><span className="text-muted-foreground">Offerte:</span> <span className="font-medium">{quoteNumber}</span></p>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Offerte:</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={quoteNumberDraft}
                        onChange={(e) => setQuoteNumberDraft(e.target.value)}
                        placeholder="Nr."
                        className="w-16 h-7 rounded-md border border-dashed border-border bg-muted/40 px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      {quoteNumberDraft && (
                        <button onClick={handleSaveQuoteNumber} disabled={savingQuoteNumber}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-sm"><span className="text-muted-foreground">Datum:</span> <span className="font-medium">{quoteDate}</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Geldig tot:</span> <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span></p>
                </div>
              </div>
            </div>

            {/* Aanhef */}
            {introText && (
              <div className="p-6 border-b border-border">
                <p className="text-sm whitespace-pre-line">{introText}</p>
              </div>
            )}

            {/* Line items */}
            <div className="p-6 border-b border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium text-muted-foreground pb-2">Omschrijving</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 w-12">Aant.</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 w-20">Prijs</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 w-12">BTW</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 w-24">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-3">
                        <p className="font-medium">{item.title || "—"}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td className="text-right py-3 text-muted-foreground">{item.quantity}</td>
                      <td className="text-right py-3">{formatCurrency(item.rate)}</td>
                      <td className="text-right py-3 text-muted-foreground">{item.tax_percentage}%</td>
                      <td className="text-right py-3 font-medium">{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totalen */}
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

            {/* Disclaimer */}
            {disclaimerText && (
              <div className="p-6">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{disclaimerText}</p>
              </div>
            )}
          </div>


        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto w-full max-w-2xl px-6 py-4 space-y-2">
            <button
              onClick={() => router.push("/dashboard/quotes")}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Opslaan als concept
            </button>
            <Button
              className="w-full"
              onClick={handleSend}
              disabled={sending || sent || (!settings?.next_quote_number && !savedQuoteNumber)}
            >
              {sent ? "✓ Verstuurd" : sending ? "Bezig..." : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Offerte versturen
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
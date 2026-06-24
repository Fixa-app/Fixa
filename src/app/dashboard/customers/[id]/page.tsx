"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Phone, MessageCircle, FileText, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSmartBack } from "@/lib/use-smart-back";
import { formatRelativeTime } from "@/lib/format-relative-time";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_BADGE,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_BADGE,
  type QuoteStatus,
  type RequestStatus,
} from "@/lib/status-config";

type Client = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
};

type RequestRow = { id: string; status: RequestStatus; updated_at: string };
type QuoteRow = { id: string; status: QuoteStatus; job_title: string | null; updated_at: string };

async function getCurrentUserId(): Promise<string | null> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("31")) return digits;
  if (digits.startsWith("0")) return "31" + digits.slice(1);
  return digits;
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const goBack = useSmartBack("/dashboard/customers");

  const [client, setClient] = useState<Client | null>(null);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const res = await fetch(`/api/customers/${id}?userId=${userId}`);
      if (!res.ok) return;
      const json = await res.json();
      setClient(json.client);
      setRequests(json.requests ?? []);
      setQuotes(json.quotes ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading || !client) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  const whatsappHref = client.phone ? `https://wa.me/${toWhatsAppNumber(client.phone)}` : undefined;
  const phoneHref = client.phone ? `tel:${client.phone}` : undefined;
  const hasHistory = requests.length > 0 || quotes.length > 0;

  return (
    <div className="p-4 md:p-6 mx-auto w-full max-w-2xl space-y-4 pb-12">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={goBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Terug naar klanten"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-2xl font-bold flex-1">Klant details</h1>
      </div>

      {/* Contactgegevens */}
      <div className="rounded-2xl bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{client.name}</h2>
          <div className="flex items-center gap-2">
            {phoneHref && (
              <a href={phoneHref} aria-label="Bel klant" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors">
                <Phone className="h-4 w-4" />
              </a>
            )}
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Stuur WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="space-y-0.5">
          {client.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
          {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
          {client.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
        </div>
      </div>

      {/* Historie */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold px-1">Historie</h2>

        {!hasHistory && (
          <div className="rounded-2xl bg-card p-5">
            <p className="text-sm text-muted-foreground">Nog geen aanvragen of offertes bij deze klant.</p>
          </div>
        )}

        {requests.map((req) => (
          <button
            key={req.id}
            onClick={() => router.push(`/dashboard/requests/${req.id}`)}
            className="flex w-full items-center justify-between gap-4 rounded-xl bg-card p-4 text-left transition-all hover:bg-hover active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Inbox className="h-4 w-4 text-burgundy-bright flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">Aanvraag</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(req.updated_at)}</p>
              </div>
            </div>
            <Badge variant={REQUEST_STATUS_BADGE[req.status] ?? "secondary"}>
              {REQUEST_STATUS_LABELS[req.status] ?? req.status}
            </Badge>
          </button>
        ))}

        {quotes.map((quote) => (
          <button
            key={quote.id}
            onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
            className="flex w-full items-center justify-between gap-4 rounded-xl bg-card p-4 text-left transition-all hover:bg-hover active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{quote.job_title || "Naamloze offerte"}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(quote.updated_at)}</p>
              </div>
            </div>
            <Badge variant={QUOTE_STATUS_BADGE[quote.status] ?? "secondary"}>
              {QUOTE_STATUS_LABELS[quote.status] ?? quote.status}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
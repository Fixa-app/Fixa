"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Phone, MessageCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useSmartBack } from "@/lib/use-smart-back";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_BADGE } from "@/lib/status-config";

type RequestItem = {
  id: string;
  title: string | null;
  description: string | null;
  photos: string[];
};

type RequestData = {
  request: {
    id: string;
    status: "created" | "converted" | "archived";
    created_at: string;
    converted_to_quote_id: string | null;
  };
  items: RequestItem[];
  client: {
    name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
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

function RequestDetailContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const goBack = useSmartBack("/dashboard");

  const [data, setData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const res = await fetch(`/api/requests/${id}?userId=${userId}`);
      if (!res.ok) return;
      const json: RequestData = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleConvert() {
    setConverting(true);
    const userId = await getCurrentUserId();
    if (!userId) { setConverting(false); return; }

    const res = await fetch(`/api/requests/${id}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      const { quoteId, suggestedProducts, referencePhotosByLineItemId } = await res.json();
      if (suggestedProducts && suggestedProducts.length > 0) {
        sessionStorage.setItem("quote_suggested_products", JSON.stringify(suggestedProducts));
      }
      if (referencePhotosByLineItemId && Object.keys(referencePhotosByLineItemId).length > 0) {
        sessionStorage.setItem("quote_reference_photos", JSON.stringify(referencePhotosByLineItemId));
      }
      router.push(`/dashboard/quotes/new/${quoteId}/items`);
    }
    setConverting(false);
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  const { request, items, client } = data;
  const whatsappHref = client?.phone ? `https://wa.me/${toWhatsAppNumber(client.phone)}` : undefined;
  const phoneHref = client?.phone ? `tel:${client.phone}` : undefined;
  const isConverted = request.status === "converted";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-2xl space-y-4 pb-32">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Terug"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {isNew ? (
            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full bg-primary transition-all" />
                </div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">2/2</span>
            </div>
          ) : (
            <h1 className="font-display text-2xl font-bold flex-1">Aanvraag details</h1>
          )}
        </div>

        {/* Client sectie */}
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
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Stuur WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="font-bold">{client?.name ?? "Geen klant gekoppeld"}</p>
            {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
            {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
            {client?.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold px-1">Wat is het probleem?</h2>
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-card p-4 space-y-3">
              <p className="font-bold">{item.title}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
              {item.photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.photos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Foto van situatie"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status + tijdstip */}
        <div className="flex items-center gap-2 px-1">
          <Badge variant={REQUEST_STATUS_BADGE[request.status] ?? "secondary"}>
            <CheckCircle2 className="h-3 w-3" />
            {REQUEST_STATUS_LABELS[request.status] ?? request.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatRelativeTime(request.status === "created" ? request.created_at : request.created_at)}
          </span>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto w-full max-w-2xl px-6 py-4">
          {isConverted ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push(`/dashboard/quotes/${request.converted_to_quote_id}`)}
            >
              <FileText className="h-4 w-4" />
              Bekijk offerte
            </Button>
          ) : (
            <Button className="w-full" onClick={handleConvert} disabled={converting || !client}>
              {converting ? "Bezig..." : "Omzetten naar offerte"}
            </Button>
          )}
          {!client && !isConverted && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Koppel eerst een klant voordat je kunt omzetten.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  return (
    <Suspense fallback={<div />}>
      <RequestDetailContent />
    </Suspense>
  );
}
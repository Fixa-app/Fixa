"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function NewQuotePreviewPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
        {/* Header */}
        <div className="flex items-center gap-4">
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

        <h1 className="font-display text-3xl font-bold">Controleer je offerte</h1>
        <p className="text-muted-foreground text-sm">Quote ID: {id}</p>
        <p className="text-muted-foreground text-sm">Preview — binnenkort beschikbaar.</p>
      </div>
    </div>
  );
}
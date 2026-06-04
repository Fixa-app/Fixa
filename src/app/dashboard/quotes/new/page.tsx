"use client";

import { ArrowLeft, User, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewQuoteClientPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-6 mx-auto w-full max-w-2xl pb-32">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/quotes")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Terug naar offertes"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/3 bg-primary transition-all" />
              </div>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">1/3</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold">Voor wie is de offerte?</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Zoek op naam..."
            className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Client list placeholder */}
        <div className="space-y-2">
          {["Van der Berg Installaties", "Bakker & Zonen BV", "Smit Aannemersbedrijf"].map((name) => (
            <button
              key={name}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>

        {/* New client */}
        <button className="flex w-full items-center gap-4 rounded-xl border border-dashed border-border p-4 text-left transition-colors hover:bg-muted/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="font-medium text-muted-foreground">Nieuwe klant aanmaken</span>
        </button>
      </div>
    </div>
  );
}
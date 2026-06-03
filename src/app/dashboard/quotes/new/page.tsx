import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewQuotePage() {
  return (
    <div className="px-4 py-8 md:px-10">
      <Link
        href="/dashboard/quotes"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar offertes
      </Link>

      <div className="mt-8 flex flex-col items-center justify-center text-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-6">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">
          Offerte aanmaken
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-8">
          De flow voor het aanmaken van offertes is binnenkort beschikbaar.
        </p>
        <Link href="/dashboard/quotes">
  <Button variant="outline" size="sm">
    Terug naar offertes
  </Button>
</Link>
      </div>
    </div>
  );
}
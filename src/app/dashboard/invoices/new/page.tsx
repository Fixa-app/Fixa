"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function InvoicesNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");

  useEffect(() => {
    async function create() {
      const userId = await getCurrentUserId();
      if (!userId) { router.push("/login"); return; }

      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, quoteId }),
      });

      if (res.ok) {
        const { invoice } = await res.json();
        router.replace(`/dashboard/invoices/new/${invoice.id}/items`);
      }
    }
    create();
  }, [quoteId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Factuur aanmaken...</p>
    </div>
  );
}

export default function InvoicesNewPage() {
  return (
    <Suspense fallback={<div />}>
      <InvoicesNewContent />
    </Suspense>
  );
}
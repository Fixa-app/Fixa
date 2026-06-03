"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("just_onboarded")) {
      setShowNotification(true);
      sessionStorage.removeItem("just_onboarded");
    }
  }, []);

  const stats = [
    { label: "Open aanvragen", value: "0" },
    { label: "Offertes in afwachting", value: "0" },
    { label: "Omzet deze maand", value: "€0,00" },
  ];

  return (
    <div className="space-y-6 px-6 py-8 md:px-10">
      <h1 className="font-display text-3xl font-bold">Overzicht</h1>

      {showNotification && (
        <div
          role="alert"
          className="animate-in fade-in rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-sm font-medium duration-500"
        >
          🎉 Je bedrijf is ingesteld. Welkom bij Fixa!
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          href="/dashboard/quotes"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
        >
          <h2 className="text-xl font-bold">Offertes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Je hebt nog geen offertes verstuurd.
          </p>
        </Link>
        <Link
          href="/dashboard/invoices"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
        >
          <h2 className="text-xl font-bold">Facturen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nog geen facturen. Verstuur er een na je eerste klus.
          </p>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
          Activiteit
        </h2>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nog geen activiteit. Nieuwe aanvragen en updates verschijnen hier.
        </p>
      </div>
    </div>
  );
}

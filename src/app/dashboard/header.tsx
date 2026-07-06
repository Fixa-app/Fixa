"use client";

import Link from "next/link";
import { Bell, HelpCircle, Search } from "lucide-react";
import { CompanySwitcher } from "./company-switcher";

export function DashboardHeader({
  companies,
  activeCompanyId,
  companyName,
  userName,
}: {
  companies: { id: string; name: string }[];
  activeCompanyId: string;
  companyName: string;
  userName: string;
}) {
  const firstName = userName.split(" ")[0] || userName;

  return (
    <header className="hidden h-16 shrink-0 bg-background lg:flex">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6">
      {/* Company name (above the page) */}
      <div className="min-w-0">
        <CompanySwitcher
          companies={companies}
          activeId={activeCompanyId}
          companyName={companyName}
        />
      </div>

      {/* Right: search, messages, help, account */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="mr-1 flex h-9 items-center gap-2 rounded-lg bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-hover"
        >
          <Search className="size-4" />
          <span>Zoeken</span>
        </button>
        <button
          type="button"
          aria-label="Berichten"
          className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-hover"
        >
          <Bell className="size-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-hover"
        >
          <HelpCircle className="size-5" strokeWidth={2} />
        </button>
        <Link
          href="/dashboard/account"
          aria-label="Account"
          className="ml-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
        >
          {(firstName[0] ?? "?").toUpperCase()}
        </Link>
      </div>
      </div>
    </header>
  );
}

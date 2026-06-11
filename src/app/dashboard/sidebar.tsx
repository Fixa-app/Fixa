"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, Inbox, Plus, Receipt, Users, Wrench } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_SECTIONS } from "./nav";
import { SETTINGS_NAV } from "./settings/nav";

const ROLE_LABELS: Record<string, string> = {
  owner: "Eigenaar",
  admin: "Beheerder",
  member: "Lid",
};

const CREATE_ITEMS = [
  { label: "Klant", icon: Users, href: "/dashboard/customers" },
  { label: "Aanvraag", icon: Inbox, href: "#" },
  { label: "Offerte", icon: FileText, href: "/dashboard/quotes/new" },
  { label: "Opdracht", icon: Wrench, href: "#" },
  { label: "Factuur", icon: Receipt, href: "/dashboard/invoices" },
];

export function DashboardSidebar({
  userName,
  role,
}: {
  companies: { id: string; name: string }[];
  activeCompanyId: string;
  companyName: string;
  userName: string;
  role: string;
  onboardingCompleted: number;
  onboardingTotal: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");
  const firstName = userName.split(" ")[0] || userName;
  const [createOpen, setCreateOpen] = useState(false);

  // When in settings, a secondary panel slides over the primary names.
  const inSettings = pathname.startsWith("/dashboard/settings");
  const currentTab = searchParams.get("tab") ?? "company";

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-64 shrink-0 flex-col border-r border-border/50 bg-background lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" aria-label="Fixa">
          <Image
            src="/fixa-logo.svg"
            alt="Fixa"
            width={120}
            height={48}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Create */}
      <div className="relative px-3 pt-4">
        <button
          type="button"
          onClick={() => setCreateOpen((v) => !v)}
          aria-expanded={createOpen}
          className={`flex w-full items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${
            createOpen
              ? "bg-hover text-foreground"
              : "text-foreground hover:bg-hover"
          }`}
        >
          <Plus
            className={`size-4 shrink-0 transition-transform ${
              createOpen ? "rotate-45" : ""
            }`}
          />
          {!inSettings && <span className="flex-1 text-left">Nieuw</span>}
        </button>

        {createOpen && (
          <>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setCreateOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div className="absolute top-2 left-full z-50 ml-2 flex w-52 flex-col gap-0.5 rounded-2xl border border-border bg-card p-2 shadow-xl">
              {CREATE_ITEMS.map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setCreateOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <Icon
                    className="size-5 shrink-0 text-foreground"
                    strokeWidth={2}
                  />
                  <span className="text-base font-semibold text-foreground">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-1">
        {NAV_SECTIONS.map((section, i) => (
          <div key={section.title ?? `top-${i}`} className="space-y-1">
            {section.title && (
              <p className="px-2 pb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group/nav relative flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${
                    item.comingSoon
                      ? "pointer-events-none text-muted-foreground"
                      : active
                        ? "bg-hover text-foreground"
                        : "text-foreground hover:bg-hover"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {!inSettings && <span className="flex-1">{item.label}</span>}
                  {!inSettings && item.comingSoon && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      binnenkort
                    </span>
                  )}
                  {/* Name tooltip — shown when the secondary panel covers the labels */}
                  {inSettings && (
                    <span className="pointer-events-none absolute top-1/2 left-10 z-30 hidden -translate-y-1/2 rounded-lg bg-foreground px-2.5 py-1 text-sm font-medium whitespace-nowrap text-background shadow-lg group-hover/nav:block">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="border-t border-border p-3">
        <Link
          href="/dashboard/account"
          className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
            isActive("/dashboard/account") ? "bg-hover" : "hover:bg-hover"
          }`}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {(firstName[0] ?? "?").toUpperCase()}
          </span>
          {!inSettings && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-foreground">
                {firstName}
              </p>
              {role && (
                <p className="truncate text-sm text-muted-foreground">
                  {ROLE_LABELS[role] ?? role}
                </p>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* Secondary panel — only present when there is a sub-menu (settings),
          slides in over the primary names with the icons still visible */}
      {inSettings && (
        <div className="absolute inset-y-0 right-0 left-14 z-20 flex animate-in flex-col bg-background duration-300 fade-in slide-in-from-right-4">
          {/* Title — same font + row as the company name in the header */}
          <div className="flex h-16 items-center px-3">
            <h2 className="truncate text-base font-bold">Instellingen</h2>
          </div>
          {/* Items — aligned with the primary nav rows */}
          <div className="flex flex-col gap-1 px-3 pt-4">
            {SETTINGS_NAV.map(({ key, label }) => (
              <Link
                key={key}
                href={`/dashboard/settings?tab=${key}`}
                className={`rounded-lg p-2 text-base font-bold transition-colors ${
                  currentTab === key
                    ? "bg-hover text-foreground"
                    : "text-foreground hover:bg-hover"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

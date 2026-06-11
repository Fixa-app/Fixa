"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, Inbox, Plus, Receipt, Users, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "./nav";

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
  companies,
  activeCompanyId,
  companyName,
  userName,
  role,
  onboardingCompleted,
  onboardingTotal,
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
  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");
  const firstName = userName.split(" ")[0] || userName;
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-64 shrink-0 flex-col border-r border-border/50 bg-background lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard">
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
              ? "bg-foreground/[0.06] text-foreground"
              : "text-foreground hover:text-foreground/70"
          }`}
        >
          <Plus
            className={`size-4 shrink-0 transition-transform ${
              createOpen ? "rotate-45" : ""
            }`}
          />
          <span className="flex-1 text-left">Nieuw</span>
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
                  className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${
                    item.comingSoon
                      ? "pointer-events-none text-muted-foreground"
                      : active
                      ? "bg-card text-foreground"
                      : "text-foreground hover:text-foreground/70"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      binnenkort
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
            isActive("/dashboard/account")
              ? "bg-card"
              : "hover:bg-foreground/[0.06]"
          }`}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {(firstName[0] ?? "?").toUpperCase()}
          </span>
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
        </Link>
      </div>
    </aside>
  );
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Inbox,
  Plus,
  Receipt,
  Users,
  Wrench,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_SECTIONS } from "./nav";
import { SETTINGS_NAV } from "./settings/nav";

const CREATE_ITEMS = [
  { label: "Klant", icon: Users, href: "/dashboard/customers" },
  { label: "Aanvraag", icon: Inbox, href: "#" },
  { label: "Offerte", icon: FileText, href: "/dashboard/quotes/new" },
  { label: "Opdracht", icon: Wrench, href: "#" },
  { label: "Factuur", icon: Receipt, href: "/dashboard/invoices" },
];

export function DashboardSidebar({}: {
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
  const [createOpen, setCreateOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore the collapsed preference after mount.
  useEffect(() => {
    setCollapsed(localStorage.getItem("sidebar_collapsed") === "1");
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("sidebar_collapsed", next ? "1" : "0");
      return next;
    });

  // In settings the primary is forced to an icon rail and the secondary
  // panel opens beside it (the arrow can't collapse the secondary menu).
  const inSettings = pathname.startsWith("/dashboard/settings");
  const currentTab = searchParams.get("tab") ?? "company";
  const primaryCollapsed = collapsed || inSettings;
  const labelClass = `flex-1 min-w-0 truncate transition-opacity duration-200 ${
    primaryCollapsed ? "pointer-events-none opacity-0" : ""
  }`;

  return (
    <aside className="sticky top-0 z-30 hidden h-screen shrink-0 flex-row border-r border-border/50 bg-background lg:flex">
      {/* Primary column */}
      <div
        className={`flex h-full flex-col bg-background transition-[width] duration-300 ease-out ${
          primaryCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand */}
        <div
          className={`flex h-16 items-center overflow-hidden ${
            primaryCollapsed ? "px-3" : "px-4"
          }`}
        >
          <Link href="/dashboard" aria-label="Fixa">
            <Image
              src="/fixa-logo.svg"
              alt="Fixa"
              width={120}
              height={48}
              className={primaryCollapsed ? "h-8 w-auto max-w-none" : "h-10 w-auto"}
            />
          </Link>
        </div>

        {/* Create */}
        <div className="relative px-3 pt-4">
          <button
            type="button"
            onClick={() => setCreateOpen((v) => !v)}
            aria-expanded={createOpen}
            title={primaryCollapsed ? "Nieuw" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${
              createOpen
                ? "bg-hover text-foreground"
                : "text-foreground hover:bg-hover"
            }`}
          >
            <Plus
              className={`size-5 shrink-0 transition-transform ${
                createOpen ? "rotate-45" : ""
              }`}
            />
            <span className={`${labelClass} text-left`}>Nieuw</span>
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-1 pb-4">
          {NAV_SECTIONS.map((section, i) => (
            <div key={section.title ?? `top-${i}`} className="space-y-1">
              {section.title && !primaryCollapsed && (
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
                    title={primaryCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${
                      item.comingSoon
                        ? "pointer-events-none text-muted-foreground"
                        : active
                          ? "bg-hover text-foreground"
                          : "text-foreground hover:bg-hover"
                    }`}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className={labelClass}>{item.label}</span>
                    {!primaryCollapsed && item.comingSoon && (
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

        {/* Collapse / expand toggle — hidden in settings */}
        {!inSettings && (
          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Menu uitklappen" : "Menu inklappen"}
              className="flex w-full items-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
            >
              {collapsed ? (
                <ArrowRight className="size-5 shrink-0" />
              ) : (
                <ArrowLeft className="size-5 shrink-0" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Secondary column — opens left→right from the divider */}
      <div
        className={`h-full overflow-hidden bg-background transition-[width] duration-300 ease-out ${
          inSettings ? "w-52 border-l border-border/50" : "w-0"
        }`}
      >
        <div className="flex h-full w-52 flex-col">
          <div className="flex h-16 items-center px-3">
            <h2 className="truncate text-base font-bold">Instellingen</h2>
          </div>
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
      </div>
    </aside>
  );
}

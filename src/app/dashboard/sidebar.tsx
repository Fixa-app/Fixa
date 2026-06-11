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

  // In settings, a secondary panel slides over the primary names.
  const inSettings = pathname.startsWith("/dashboard/settings");
  const currentTab = searchParams.get("tab") ?? "company";
  const showPanel = inSettings && !collapsed;
  // Labels are hidden (faded) when collapsed or behind the settings panel.
  const labelHidden = collapsed || inSettings;
  const labelClass = `flex-1 min-w-0 truncate transition-opacity duration-200 ${
    labelHidden ? "pointer-events-none opacity-0" : ""
  }`;

  return (
    <aside
      className={`sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-border/50 bg-background transition-[width] duration-300 ease-out lg:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand */}
      <div
        className={`flex h-16 items-center overflow-hidden ${
          collapsed ? "px-3" : "px-4"
        }`}
      >
        <Link href="/dashboard" aria-label="Fixa">
          <Image
            src="/fixa-logo.svg"
            alt="Fixa"
            width={120}
            height={48}
            className={collapsed ? "h-8 w-auto max-w-none" : "h-10 w-auto"}
          />
        </Link>
      </div>

      {/* Create */}
      <div className="relative px-3 pt-4">
        <button
          type="button"
          onClick={() => setCreateOpen((v) => !v)}
          aria-expanded={createOpen}
          title={collapsed ? "Nieuw" : undefined}
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
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-1">
        {NAV_SECTIONS.map((section, i) => (
          <div key={section.title ?? `top-${i}`} className="space-y-1">
            {section.title && !collapsed && (
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
                  title={labelHidden ? item.label : undefined}
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
                  {!labelHidden && item.comingSoon && (
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

      {/* Collapse / expand toggle */}
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

      {/* Secondary panel — slides in over the primary names (settings) */}
      {showPanel && (
        <div className="absolute inset-y-0 right-0 left-14 z-20 flex animate-in flex-col bg-background duration-300 fade-in slide-in-from-right-4">
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
      )}
    </aside>
  );
}

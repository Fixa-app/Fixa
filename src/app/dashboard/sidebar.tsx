"use client";

import Image from "next/image";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "./nav";
import { CompanySwitcher } from "./company-switcher";

const ROLE_LABELS: Record<string, string> = {
  owner: "Eigenaar",
  admin: "Beheerder",
  member: "Lid",
};

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

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      {/* Brand / company */}
      <div className="border-b border-border px-4 py-4">
        <Link href="/dashboard">
  <Image
    src="/fixa-logo.svg"
    alt="Fixa"
    width={120}
    height={48}
    className="h-11 w-auto"
  />
</Link>
        <div className="mt-3">
          <CompanySwitcher
            companies={companies}
            activeId={activeCompanyId}
            companyName={companyName}
          />
        </div>
      </div>

      {/* Onboarding */}
      {onboardingCompleted < onboardingTotal && (
        <div className="px-3 py-3">
          <Link
            href="/dashboard/onboarding"
            className={`flex items-center justify-between gap-2 rounded-xl border border-primary/30 px-3 py-2.5 text-primary transition-colors hover:bg-primary/10 ${
              isActive("/dashboard/onboarding") ? "bg-primary/10" : "bg-primary/5"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold">
              <Rocket className="size-4 shrink-0" />
              Aan de slag
            </span>
            <span className="text-sm font-bold">
              {onboardingCompleted}/{onboardingTotal}
            </span>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
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
                      ? "bg-foreground/[0.06] text-foreground"
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
              ? "bg-foreground/[0.06]"
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
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS } from "./nav";

const ROLE_LABELS: Record<string, string> = {
  owner: "Eigenaar",
  admin: "Beheerder",
  member: "Lid",
};

export function DashboardSidebar({
  companyName,
  userName,
  role,
}: {
  companyName: string;
  userName: string;
  role: string;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      {/* Brand / company */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <Image
          src="/fixa-logo.svg"
          alt="Fixa"
          width={64}
          height={64}
          className="h-7 w-auto"
        />
        {companyName && (
          <span className="truncate text-sm font-bold" title={companyName}>
            {companyName}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
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
                    active
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-foreground hover:text-foreground/70"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {(userName[0] ?? "?").toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{userName}</p>
            {role && (
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                {ROLE_LABELS[role] ?? role}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

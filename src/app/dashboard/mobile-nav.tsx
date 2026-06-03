"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "vaul";
import { Menu, Rocket, X } from "lucide-react";
import { NAV_SECTIONS } from "./nav";

const ROLE_LABELS: Record<string, string> = {
  owner: "Eigenaar",
  admin: "Beheerder",
  member: "Lid",
};

export function MobileNav({
  companyName,
  userName,
  role,
  onboardingCompleted,
  onboardingTotal,
}: {
  companyName: string;
  userName: string;
  role: string;
  onboardingCompleted: number;
  onboardingTotal: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstName = userName.split(" ")[0] || userName;

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="size-5" />
        </button>

        <Image
          src="/fixa-logo.svg"
          alt="Fixa"
          width={80}
          height={32}
          className="h-7 w-auto"
        />

        <div className="w-10" />
      </header>

      {/* Mobile nav drawer */}
      <Drawer.Root open={open} onOpenChange={setOpen} direction="left">
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <Drawer.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background shadow-xl outline-none">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Image
                src="/fixa-logo.svg"
                alt="Fixa"
                width={80}
                height={32}
                className="h-7 w-auto"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Sluit menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Company name */}
            {companyName && (
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-foreground">{companyName}</p>
              </div>
            )}

            {/* Onboarding */}
            {onboardingCompleted < onboardingTotal && (
              <div className="px-3 py-3">
                <Link
                  href="/dashboard/onboarding"
                  onClick={() => setOpen(false)}
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
                        onClick={() => setOpen(false)}
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

            {/* Account footer */}
            <div className="border-t border-border p-3">
              <Link
                href="/dashboard/account"
                onClick={() => setOpen(false)}
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
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
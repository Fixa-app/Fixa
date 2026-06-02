"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  CalendarCheck,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  Flame,
  Hammer,
  Home,
  type LucideIcon,
  Menu,
  Paintbrush,
  Sparkles,
  Trees,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { signOut } from "@/lib/auth/actions";

type ProductMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type ProductColumn = {
  title: string;
  items: ProductMenuItem[];
};

const productMenu: ProductColumn[] = [
  {
    title: "Betere aanvragen",
    items: [
      { label: "Online aanvragen", href: "#product", icon: CalendarCheck },
      { label: "Offertes", href: "#product", icon: FileText },
    ],
  },
  {
    title: "Slimmer werken",
    items: [
      { label: "Planning", href: "#product", icon: Calendar },
      { label: "Schedule", href: "#product", icon: Clock },
    ],
  },
  {
    title: "Meer winst",
    items: [
      { label: "Betalingen", href: "#product", icon: CreditCard },
      { label: "Rapporten", href: "#product", icon: BarChart3 },
    ],
  },
];

const industriesMenu: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Loodgieters", href: "#industries", icon: Wrench },
  { label: "Elektriciens", href: "#industries", icon: Zap },
  { label: "CV & klimaat", href: "#industries", icon: Flame },
  { label: "Hoveniers", href: "#industries", icon: Trees },
  { label: "Schoonmaak", href: "#industries", icon: Sparkles },
  { label: "Klusbedrijf", href: "#industries", icon: Hammer },
  { label: "Schilders", href: "#industries", icon: Paintbrush },
  { label: "Dakdekkers", href: "#industries", icon: Home },
];

type OpenMenu = "product" | "industries" | "mobile" | "account" | null;

export function SiteHeaderBar({
  userEmail,
  userIsAdmin,
  hasCompany,
}: {
  userEmail: string | null;
  userIsAdmin: boolean;
  hasCompany: boolean;
}) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [mobileSection, setMobileSection] = useState<
    "industries" | "product" | null
  >(null);
  const [scrolled, setScrolled] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasHero = pathname === "/";
  const isAdminPage =
    pathname.startsWith("/admin") || pathname.startsWith("/plan");
  const adminNav = [
    { label: "Blueprint", href: "/admin/blueprint" },
    { label: "Users", href: "/admin/users" },
    { label: "Design", href: "/admin/design" },
    { label: "Plan", href: "/plan" },
    { label: "Workflow", href: "/plan/workflow" },
  ];
  const overHero = hasHero && !scrolled;
  const isTransparent = overHero && openMenu === null;
  const productOpen = openMenu === "product";
  const industriesOpen = openMenu === "industries";
  const mobileOpen = openMenu === "mobile";
  const accountOpen = openMenu === "account";

  const accountName = userEmail
    ? userEmail
        .split("@")[0]
        .split(/[._-]/)[0]
        .replace(/^./, (c) => c.toUpperCase())
    : "";
  const accountFullName = userEmail
    ? userEmail
        .split("@")[0]
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.replace(/^./, (c) => c.toUpperCase()))
        .join(" ")
    : "";
  const accountInitial = (
    accountName[0] ||
    userEmail?.[0] ||
    "?"
  ).toUpperCase();

  useEffect(() => {
    if (!hasHero) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero]);

  useEffect(() => {
    if (openMenu !== "mobile") setMobileSection(null);
  }, [openMenu]);

  useEffect(() => {
    if (openMenu === null) return;
    const onClick = (e: MouseEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const closeMenu = () => setOpenMenu(null);
  const toggleMenu = (menu: Exclude<OpenMenu, null>) =>
    setOpenMenu((current) => (current === menu ? null : menu));

  const txtBase = "text-white";
  const txtMuted = "text-white/60";
  const txtHover = "hover:text-white/70";
  const itemHover = "hover:bg-white/10";
  const dividerBorder = "border-white/10";

  const surfaceClasses = isTransparent
    ? "bg-transparent"
    : "bg-ink/70 backdrop-blur-md";
  const fullWidthOpen =
    openMenu !== null && openMenu !== "account";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div ref={pillRef} className="relative mx-auto w-full max-w-[1920px]">
        <div
          className={`transition-[background-color,border-radius] duration-300 ${txtBase} ${surfaceClasses} ${
            fullWidthOpen ? "rounded-t-3xl" : "rounded-3xl"
          }`}
        >
          <div className="mx-auto flex w-full max-w-[1536px] items-center justify-between gap-6 py-0 pr-3 pl-5">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              aria-label="Fixa"
              className="flex items-center"
              onClick={closeMenu}
            >
              <Image
                src="/fixa-logo.svg"
                alt="Fixa"
                width={80}
                height={80}
                priority
                className="h-18 w-auto invert"
              />
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {isAdminPage ? (
                adminNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`px-2 text-base font-bold ${txtBase} ${txtHover}`}
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    aria-expanded={industriesOpen}
                    aria-controls="header-dropdown-menu"
                    onClick={() => toggleMenu("industries")}
                    className={`flex items-center gap-1 px-2 text-base font-bold ${txtBase} ${txtHover}`}
                  >
                    Bedrijfstypen
                    <ChevronDown
                      aria-hidden
                      className={`size-3 transition-transform duration-200 ${industriesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    type="button"
                    aria-expanded={productOpen}
                    aria-controls="header-dropdown-menu"
                    onClick={() => toggleMenu("product")}
                    className={`flex items-center gap-1 px-2 text-base font-bold ${txtBase} ${txtHover}`}
                  >
                    Product
                    <ChevronDown
                      aria-hidden
                      className={`size-3 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <Link
                    href="/pricing"
                    onClick={closeMenu}
                    className={`px-2 text-base font-bold ${txtBase} ${txtHover}`}
                  >
                    Prijzen
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <div className="relative flex items-center self-stretch">
                <button
                  type="button"
                  aria-expanded={accountOpen}
                  aria-controls="header-dropdown-menu"
                  onClick={() => toggleMenu("account")}
                  className={`flex items-center gap-2 rounded-xl px-1 py-1 transition-colors ${txtBase} ${txtHover}`}
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                    aria-hidden
                  >
                    {accountInitial}
                  </span>
                  <span className="hidden text-base font-bold sm:inline">
                    {accountName}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={`size-3 transition-transform duration-200 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  aria-hidden={!accountOpen}
                  className={`absolute top-full right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl p-3 shadow-lg transition-all duration-200 ease-out ${txtBase} bg-ink/85 backdrop-blur-md ${
                    accountOpen
                      ? "translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 border-b px-2 pb-3 ${dividerBorder}`}
                  >
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
                      aria-hidden
                    >
                      {accountInitial}
                    </span>
                    <span
                      className="truncate text-base font-bold"
                      title={accountFullName || (userEmail ?? undefined)}
                    >
                      {accountFullName}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 pt-2">
                    <Link
                      href="/account"
                      onClick={closeMenu}
                      className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      Account
                    </Link>
                    <Link
                      href={hasCompany ? "/dashboard" : "/onboarding/company"}
                      onClick={closeMenu}
                      className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      {hasCompany ? "Company Dashboard" : "Create company"}
                    </Link>
                    <Link
                      href="/refer"
                      onClick={closeMenu}
                      className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      Refer a friend
                    </Link>
                    {userIsAdmin && (
                      <>
                        <div className={`my-1 border-t ${dividerBorder}`} />
                        <span
                          className={`px-2 pt-1 text-xs font-bold tracking-widest uppercase ${txtMuted}`}
                        >
                          Admin
                        </span>
                        <Link
                          href="/admin/blueprint"
                          onClick={closeMenu}
                          className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                        >
                          Blueprint
                        </Link>
                        <Link
                          href="/admin/users"
                          onClick={closeMenu}
                          className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                        >
                          Users
                        </Link>
                        <Link
                          href="/admin/design"
                          onClick={closeMenu}
                          className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                        >
                          Design
                        </Link>
                        <Link
                          href="/plan"
                          onClick={closeMenu}
                          className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                        >
                          Plan
                        </Link>
                        <Link
                          href="/plan/workflow"
                          onClick={closeMenu}
                          className={`rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                        >
                          Workflow
                        </Link>
                      </>
                    )}
                    <div className={`my-1 border-t ${dividerBorder}`} />
                    <form action={signOut}>
                      <button
                        type="submit"
                        className={`w-full rounded-lg p-2 text-left text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                      >
                        Uitloggen
                      </button>
                    </form>
                  </div>
                </div>
                </div>
                <button
                  type="button"
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                  aria-controls="header-dropdown-menu"
                  onClick={() => toggleMenu("mobile")}
                  className={`flex size-12 items-center justify-center rounded-xl lg:hidden ${txtBase} ${itemHover}`}
                >
                  <Menu className="size-6" strokeWidth={2} />
                </button>
              </>
            ) : (
              <>
                <AuthDialog>
                  <Button
                    variant="ghost"
                    className={`hidden text-base font-bold hover:bg-transparent sm:inline-flex ${txtBase} ${txtHover}`}
                  >
                    Inloggen
                  </Button>
                </AuthDialog>
                <Button
                  variant="ghost"
                  className={`hidden text-base font-bold hover:bg-transparent lg:inline-flex ${txtBase} ${txtHover}`}
                  nativeButton={false}
                  render={<a href="#contact" />}
                >
                  Boek een demo
                </Button>
                <AuthDialog>
                  <Button className="h-12 rounded-xl px-6 text-base font-bold">
                    Aan de slag
                  </Button>
                </AuthDialog>
                <button
                  type="button"
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                  aria-controls="header-dropdown-menu"
                  onClick={() => toggleMenu("mobile")}
                  className={`flex size-12 items-center justify-center rounded-xl lg:hidden ${txtBase} ${itemHover}`}
                >
                  <Menu className="size-6" strokeWidth={2} />
                </button>
              </>
            )}
          </div>
          </div>
        </div>

        <div
          id="header-dropdown-menu"
          aria-hidden={!fullWidthOpen}
          className={`absolute top-full right-0 left-0 origin-top overflow-hidden rounded-b-3xl transition-all duration-300 ease-out ${txtBase} ${surfaceClasses} ${
            fullWidthOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div
            className={`mx-auto w-full max-w-[1536px] border-t px-6 py-8 ${dividerBorder}`}
          >
            {productOpen && (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {productMenu.map((col) => (
                  <div key={col.title} className="flex flex-col gap-4">
                    <h3
                      className={`text-xs font-bold tracking-widest uppercase ${txtMuted}`}
                    >
                      {col.title}
                    </h3>
                    <ul className="flex flex-col gap-1">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                          >
                            <item.icon className="size-5" strokeWidth={2} />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {industriesOpen && (
              <div className="flex flex-col gap-4">
                <ul className="grid grid-cols-2 gap-1 md:grid-cols-4">
                  {industriesMenu.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                      >
                        <item.icon className="size-5" strokeWidth={2} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {mobileOpen && (
              <div className="flex flex-col gap-1">
                {isAdminPage ? (
                  adminNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`rounded-lg p-2 text-lg font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileSection((c) =>
                          c === "industries" ? null : "industries",
                        )
                      }
                      aria-expanded={mobileSection === "industries"}
                      className={`flex items-center justify-between rounded-lg p-2 text-lg font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      Bedrijfstypen
                      <ChevronDown
                        aria-hidden
                        className={`size-4 transition-transform duration-200 ${
                          mobileSection === "industries" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileSection === "industries" && (
                      <ul className="grid grid-cols-2 gap-1 pl-2">
                        {industriesMenu.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                            >
                              <item.icon className="size-5" strokeWidth={2} />
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setMobileSection((c) =>
                          c === "product" ? null : "product",
                        )
                      }
                      aria-expanded={mobileSection === "product"}
                      className={`flex items-center justify-between rounded-lg p-2 text-lg font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      Product
                      <ChevronDown
                        aria-hidden
                        className={`size-4 transition-transform duration-200 ${
                          mobileSection === "product" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileSection === "product" && (
                      <ul className="grid grid-cols-2 gap-1 pl-2">
                        {productMenu.flatMap((col) =>
                          col.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                onClick={closeMenu}
                                className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${txtHover}`}
                              >
                                <item.icon className="size-5" strokeWidth={2} />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          )),
                        )}
                      </ul>
                    )}

                    <Link
                      href="/pricing"
                      onClick={closeMenu}
                      className={`rounded-lg p-2 text-lg font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      Prijzen
                    </Link>

                    <div className={`my-3 border-t ${dividerBorder}`} />

                    <a
                      href="#contact"
                      onClick={closeMenu}
                      className={`rounded-lg p-2 text-lg font-bold transition-colors ${txtBase} ${txtHover}`}
                    >
                      Boek een demo
                    </a>

                    {!userEmail && (
                      <AuthDialog>
                        <button
                          type="button"
                          className={`rounded-lg p-2 text-left text-lg font-bold transition-colors ${txtBase} ${txtHover}`}
                        >
                          Inloggen
                        </button>
                      </AuthDialog>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

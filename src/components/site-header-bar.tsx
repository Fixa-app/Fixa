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

type OpenMenu = "product" | "industries" | null;

export function SiteHeaderBar({
  userEmail,
  userIsAdmin,
}: {
  userEmail: string | null;
  userIsAdmin: boolean;
}) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [scrolled, setScrolled] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasHero = pathname === "/";
  const overHero = hasHero && !scrolled;
  const isLight = overHero && openMenu !== null;
  const isTransparent = overHero && openMenu === null;
  const productOpen = openMenu === "product";
  const industriesOpen = openMenu === "industries";

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

  const txtBase = isLight ? "text-foreground" : "text-ink-foreground";
  const txtMuted = isLight ? "text-foreground/60" : "text-ink-foreground/60";
  const txtHover = isLight
    ? "hover:text-foreground/70"
    : "hover:text-ink-foreground/70";
  const itemHover = isLight ? "hover:bg-foreground/5" : "hover:bg-white/10";
  const dividerBorder = isLight ? "border-border" : "border-white/10";

  const surfaceClasses = isLight
    ? "bg-[#E4E2DB]"
    : isTransparent
      ? "bg-transparent"
      : "bg-ink/70 backdrop-blur-md";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div ref={pillRef} className="relative mx-auto w-full max-w-[1920px]">
        <div
          className={`transition-[background-color,border-radius] duration-300 ${txtBase} ${surfaceClasses} ${
            openMenu !== null ? "rounded-t-3xl" : "rounded-3xl"
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
                className={`h-18 w-auto transition-[filter] duration-300 ${
                  isLight ? "" : "invert"
                }`}
              />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                aria-expanded={industriesOpen}
                aria-controls="header-dropdown-menu"
                onClick={() => toggleMenu("industries")}
                className={`flex items-center gap-1 px-2 text-base font-bold ${txtBase} ${txtHover}`}
              >
                Voor wie
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
              {userIsAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className={`px-2 text-base font-bold ${txtBase} ${txtHover}`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <span
                  className={`hidden max-w-[220px] truncate text-sm sm:inline ${txtMuted}`}
                  title={userEmail}
                >
                  {userEmail}
                </span>
                <form action={signOut}>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    className={`${txtBase} ${itemHover} ${
                      isLight
                        ? "hover:text-foreground"
                        : "hover:text-ink-foreground"
                    }`}
                  >
                    Uitloggen
                  </Button>
                </form>
              </>
            ) : (
              <>
                <AuthDialog>
                  <Button
                    variant="ghost"
                    className={`text-base font-bold hover:bg-transparent ${txtBase} ${txtHover}`}
                  >
                    Inloggen
                  </Button>
                </AuthDialog>
                <Button
                  variant="ghost"
                  className={`hidden text-base font-bold hover:bg-transparent sm:inline-flex ${txtBase} ${txtHover}`}
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
              </>
            )}
          </div>
          </div>
        </div>

        <div
          id="header-dropdown-menu"
          aria-hidden={openMenu === null}
          className={`absolute top-full right-0 left-0 origin-top overflow-hidden rounded-b-3xl transition-all duration-300 ease-out ${txtBase} ${surfaceClasses} ${
            openMenu !== null
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
                            className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${itemHover}`}
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
                <h3
                  className={`text-xs font-bold tracking-widest uppercase ${txtMuted}`}
                >
                  Bedrijfstypen
                </h3>
                <ul className="grid grid-cols-2 gap-1 md:grid-cols-4">
                  {industriesMenu.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${itemHover}`}
                      >
                        <item.icon className="size-5" strokeWidth={2} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

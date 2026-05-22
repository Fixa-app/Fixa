"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Calendar,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  FileText,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Receipt,
  Repeat,
  Star,
  Truck,
  UserCog,
  Users,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { signOut } from "@/lib/auth/actions";

type ProductMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  ai?: boolean;
};

type ProductColumn = {
  title: string;
  items: ProductMenuItem[];
};

const productMenu: ProductColumn[] = [
  {
    title: "Betere aanvragen",
    items: [
      { label: "Online boekingen", href: "#features", icon: CalendarCheck },
      { label: "Website & reviews", href: "#features", icon: Star },
      { label: "Reserveren via Google", href: "#features", icon: MapPin },
    ],
  },
  {
    title: "Meer werk",
    items: [
      { label: "Offertes", href: "#features", icon: FileText, ai: true },
      { label: "Service plans", href: "#features", icon: Repeat },
      { label: "Communicatie", href: "#features", icon: MessageSquare, ai: true },
    ],
  },
  {
    title: "Slimmer werken",
    items: [
      { label: "Planning", href: "#features", icon: Calendar, ai: true },
      { label: "Dispatching", href: "#features", icon: Truck, ai: true },
      { label: "Klantbeheer", href: "#features", icon: UserCog },
      { label: "Klanthub", href: "#features", icon: Users },
    ],
  },
  {
    title: "Meer winst",
    items: [
      { label: "Facturen", href: "#features", icon: Receipt },
      { label: "Betalingen", href: "#features", icon: CreditCard },
      { label: "Boekhoudkoppelingen", href: "#features", icon: BookOpen },
      { label: "Business dashboard", href: "#features", icon: BarChart3, ai: true },
    ],
  },
];

const productMenuFooter: ProductMenuItem[] = [
  { label: "Fixa Assist AI", href: "#features", icon: Wand2, ai: true },
  { label: "Integraties", href: "#features", icon: Boxes },
];

export function SiteHeaderBar({
  userEmail,
  userIsAdmin,
}: {
  userEmail: string | null;
  userIsAdmin: boolean;
}) {
  const [productOpen, setProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasHero = pathname === "/";
  const overHero = hasHero && !scrolled;
  const isLight = overHero && productOpen;
  const isTransparent = overHero && !productOpen;

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
    if (!productOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) setProductOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProductOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [productOpen]);

  const closeMenu = () => setProductOpen(false);

  const txtBase = isLight ? "text-foreground" : "text-ink-foreground";
  const txtMuted = isLight ? "text-foreground/60" : "text-ink-foreground/60";
  const txtHover = isLight
    ? "hover:text-foreground/70"
    : "hover:text-ink-foreground/70";
  const itemHover = isLight ? "hover:bg-foreground/5" : "hover:bg-white/10";
  const dividerBorder = isLight ? "border-border" : "border-white/10";
  const aiBadge = isLight
    ? "border-violet-400/50 text-violet-600"
    : "border-violet-300/60 text-violet-300";
  const aiIconColor = isLight ? "text-violet-500" : "text-violet-300";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div
        ref={pillRef}
        className={`flex flex-col overflow-hidden rounded-3xl transition-colors duration-300 ${txtBase} ${
          isLight
            ? "bg-background"
            : isTransparent
              ? "bg-transparent"
              : "bg-ink/70 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between gap-6 py-0 pr-3 pl-5">
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
              <a
                href="#industries"
                onClick={closeMenu}
                className={`px-2 text-base font-bold ${txtBase} ${txtHover}`}
              >
                Voor wie
              </a>
              <button
                type="button"
                aria-expanded={productOpen}
                aria-controls="header-product-menu"
                onClick={() => setProductOpen((v) => !v)}
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
                <AuthDialog>
                  <Button className="h-12 rounded-xl px-6 text-base font-bold">
                    Begin nu
                  </Button>
                </AuthDialog>
              </>
            )}
          </div>
        </div>

        <div
          id="header-product-menu"
          aria-hidden={!productOpen}
          className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
            productOpen ? "max-h-[700px]" : "max-h-0"
          }`}
        >
          <div className={`mx-auto max-w-6xl border-t px-6 py-8 ${dividerBorder}`}>
            <div className="grid grid-cols-4 gap-10">
              {productMenu.map((col) => (
                <div key={col.title} className="flex flex-col gap-4">
                  <h3 className={`text-xs font-bold tracking-widest uppercase ${txtMuted}`}>
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
                          {item.ai && (
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase ${aiBadge}`}
                            >
                              Assist AI
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={`mt-6 flex items-center gap-6 border-t pt-4 ${dividerBorder}`}>
              {productMenuFooter.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-2 rounded-lg p-2 text-base font-bold transition-colors ${txtBase} ${itemHover}`}
                >
                  <item.icon
                    className={`size-5 ${item.ai ? aiIconColor : ""}`}
                    strokeWidth={2}
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

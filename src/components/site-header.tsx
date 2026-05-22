import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Calendar,
  CalendarCheck,
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
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

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = await isAdmin(user);

  return (
    <header className="relative z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full bg-ink py-2 pr-3 pl-5 text-ink-foreground">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Fixa" className="flex items-center">
            <Image
              src="/fixa-logo.svg"
              alt="Fixa"
              width={64}
              height={64}
              priority
              className="h-14 w-auto invert"
            />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#industries"
              className="px-2 text-base font-bold text-ink-foreground hover:text-ink-foreground/70"
            >
              Voor wie
            </a>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-2 text-base font-bold text-ink-foreground hover:bg-transparent hover:text-ink-foreground/70 focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-screen bg-background shadow-md">
                    <div className="mx-auto max-w-6xl">
                      <div className="grid grid-cols-4 gap-10 px-6 py-10">
                        {productMenu.map((col) => (
                          <div key={col.title} className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                              {col.title}
                            </h3>
                            <ul className="flex flex-col gap-1">
                              {col.items.map((item) => (
                                <li key={item.label}>
                                  <NavigationMenuLink
                                    href={item.href}
                                    className="gap-3 text-base font-bold"
                                  >
                                    <item.icon
                                      className="size-5 text-foreground"
                                      strokeWidth={2}
                                    />
                                    <span>{item.label}</span>
                                    {item.ai && (
                                      <span className="inline-flex items-center rounded-full border border-violet-300 px-2 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap text-violet-600 uppercase">
                                        Assist AI
                                      </span>
                                    )}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-8 border-t border-border px-6 py-4">
                        {productMenuFooter.map((item) => (
                          <NavigationMenuLink
                            key={item.label}
                            href={item.href}
                            className="w-auto gap-2 text-base font-bold"
                          >
                            <item.icon
                              className={
                                item.ai
                                  ? "size-5 text-violet-500"
                                  : "size-5 text-foreground"
                              }
                              strokeWidth={2}
                            />
                            <span>{item.label}</span>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link
              href="/pricing"
              className="px-2 text-base font-bold text-ink-foreground hover:text-ink-foreground/70"
            >
              Prijzen
            </Link>
            {userIsAdmin && (
              <Link
                href="/admin"
                className="px-2 text-base font-bold text-ink-foreground hover:text-ink-foreground/70"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span
                className="hidden max-w-[220px] truncate text-sm text-ink-foreground/70 sm:inline"
                title={user.email ?? undefined}
              >
                {user.email}
              </span>
              <form action={signOut}>
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
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
                  className="text-base font-bold text-ink-foreground hover:bg-transparent hover:text-ink-foreground/70"
                >
                  Inloggen
                </Button>
              </AuthDialog>
              <AuthDialog>
                <Button className="rounded-full px-5 text-base font-bold">
                  Begin nu
                </Button>
              </AuthDialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

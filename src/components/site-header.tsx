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
  Sparkles,
  Star,
  Truck,
  UserCog,
  Users,
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
    title: "Meer leads",
    items: [
      { label: "Online boekingen", href: "#features", icon: CalendarCheck },
      { label: "Website & reviews", href: "#features", icon: Star },
      { label: "Reserveren via Google", href: "#features", icon: MapPin },
    ],
  },
  {
    title: "Win meer deals",
    items: [
      { label: "Offertes", href: "#features", icon: FileText, ai: true },
      { label: "Service plans", href: "#features", icon: Repeat },
      { label: "Communicatie", href: "#features", icon: MessageSquare, ai: true },
    ],
  },
  {
    title: "Werk slimmer",
    items: [
      { label: "Planning", href: "#features", icon: Calendar, ai: true },
      { label: "Dispatching", href: "#features", icon: Truck, ai: true },
      { label: "Klanthub", href: "#features", icon: Users },
    ],
  },
  {
    title: "Word betaald",
    items: [
      { label: "Facturen", href: "#features", icon: Receipt },
      { label: "Betalingen", href: "#features", icon: CreditCard },
      { label: "Klantbeheer", href: "#features", icon: UserCog },
      { label: "Boekhoudkoppelingen", href: "#features", icon: BookOpen },
      { label: "Business dashboard", href: "#features", icon: BarChart3, ai: true },
    ],
  },
];

const productMenuFooter: ProductMenuItem[] = [
  { label: "Fixa Copilot", href: "#features", icon: Sparkles, ai: true },
  { label: "Integraties", href: "#features", icon: Boxes },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = await isAdmin(user);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Fixa" className="flex items-center">
            <Image
              src="/fixa-logo.svg"
              alt="Fixa"
              width={48}
              height={48}
              priority
              className="h-12 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#industries"
              className="px-2 text-base font-bold text-foreground hover:text-foreground/70"
            >
              Voor wie
            </a>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-2 text-base font-bold hover:bg-transparent focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-screen rounded-none border-t border-border bg-background shadow-none ring-0">
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
                                      strokeWidth={2.5}
                                    />
                                    <span>{item.label}</span>
                                    {item.ai && (
                                      <Sparkles
                                        className="ml-auto size-3.5 text-violet-500"
                                        strokeWidth={2.5}
                                        aria-label="AI"
                                      />
                                    )}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-8 border-t border-border bg-muted/40 px-6 py-4">
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
                              strokeWidth={2.5}
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
              className="px-2 text-base font-bold text-foreground hover:text-foreground/70"
            >
              Prijzen
            </Link>
            {userIsAdmin && (
              <Link
                href="/admin"
                className="px-2 text-base font-bold text-foreground hover:text-foreground/70"
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
                className="hidden max-w-[220px] truncate text-sm text-muted-foreground sm:inline"
                title={user.email ?? undefined}
              >
                {user.email}
              </span>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">
                  Uitloggen
                </Button>
              </form>
            </>
          ) : (
            <>
              <AuthDialog>
                <Button
                  variant="ghost"
                  className="text-base font-bold hover:bg-transparent hover:text-foreground/70"
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

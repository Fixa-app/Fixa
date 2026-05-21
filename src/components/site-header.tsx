import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
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

type ProductColumn = {
  title: string;
  items: { label: string; href: string; icon: LucideIcon }[];
};

const productMenu: ProductColumn[] = [
  {
    title: "Meer leads",
    items: [
      { label: "Online boekingen", href: "#features", icon: CalendarCheck },
      { label: "Website & reviews", href: "#features", icon: Star },
      { label: "Reserveren via Google", href: "#features", icon: MapPin },
      { label: "Service plans", href: "#features", icon: Repeat },
    ],
  },
  {
    title: "Win opdrachten",
    items: [{ label: "Offertes", href: "#features", icon: FileText }],
  },
  {
    title: "Werk slimmer",
    items: [
      { label: "Planning", href: "#features", icon: Calendar },
      { label: "Dispatching", href: "#features", icon: Truck },
      { label: "Klanthub", href: "#features", icon: Users },
      { label: "Communicatie", href: "#features", icon: MessageSquare },
    ],
  },
  {
    title: "Word betaald",
    items: [
      { label: "Facturen", href: "#features", icon: Receipt },
      { label: "Betalingen", href: "#features", icon: CreditCard },
      { label: "Klantbeheer", href: "#features", icon: UserCog },
      { label: "Boekhoudkoppelingen", href: "#features", icon: BookOpen },
    ],
  },
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
                  <NavigationMenuContent>
                    <div className="grid w-[760px] grid-cols-4 gap-6 p-6">
                      {productMenu.map((col) => (
                        <div key={col.title} className="flex flex-col gap-3">
                          <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            {col.title}
                          </h3>
                          <ul className="flex flex-col gap-0.5">
                            {col.items.map((item) => (
                              <li key={item.label}>
                                <NavigationMenuLink
                                  href={item.href}
                                  className="font-medium"
                                >
                                  <item.icon className="size-4 text-foreground/60" />
                                  <span>{item.label}</span>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
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

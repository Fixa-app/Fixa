import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  FileText,
  Home,
  Inbox,
  type LucideIcon,
  Plus,
  Receipt,
  Repeat,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };
export type NavSection = { title?: string; items: NavItem[] };

// Mirrors the Pro dashboard on /admin/blueprint (Leads → Sales → Operations →
// Financial, with Management running parallel).
export const NAV_SECTIONS: NavSection[] = [
  { items: [{ label: "Home", href: "/dashboard", icon: Home }] },
  {
    title: "Aanvragen",
    items: [
      { label: "Nieuwe aanvraag", href: "/dashboard/new-request", icon: Plus },
      { label: "Aanvragen", href: "/dashboard/requests", icon: Inbox },
    ],
  },
  {
    title: "Verkoop",
    items: [
      { label: "Offertes", href: "/dashboard/quotes", icon: FileText },
      {
        label: "Servicecontracten",
        href: "/dashboard/service-plans",
        icon: Repeat,
      },
    ],
  },
  {
    title: "Uitvoering",
    items: [
      { label: "Opdrachten", href: "/dashboard/jobs", icon: Wrench },
      { label: "Planning", href: "/dashboard/schedule", icon: Calendar },
      { label: "Inbox", href: "/dashboard/inbox", icon: Bell },
    ],
  },
  {
    title: "Financieel",
    items: [
      { label: "Facturen", href: "/dashboard/invoices", icon: Receipt },
      { label: "Boekhouding", href: "/dashboard/accounting", icon: BookOpen },
    ],
  },
  {
    title: "Beheer",
    items: [
      { label: "Klanten", href: "/dashboard/customers", icon: Users },
      { label: "Rapporten", href: "/dashboard/reports", icon: BarChart3 },
      { label: "Gebruikers", href: "/dashboard/users", icon: UserCog },
    ],
  },
];

export function labelForSlug(slug: string): string {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.href === `/dashboard/${slug}`) return item.label;
    }
  }
  return slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

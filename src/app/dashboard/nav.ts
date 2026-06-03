import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CalendarCheck,
  FileText,
  Globe,
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
    title: "Leads",
    items: [
      { label: "New request", href: "/dashboard/new-request", icon: Plus },
      { label: "Requests", href: "/dashboard/requests", icon: Inbox },
      { label: "Intakes", href: "/dashboard/intakes", icon: CalendarCheck },
      { label: "Website", href: "/dashboard/website", icon: Globe },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
      { label: "Service plans", href: "/dashboard/service-plans", icon: Repeat },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Jobs", href: "/dashboard/jobs", icon: Wrench },
      { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
      { label: "Inbox", href: "/dashboard/inbox", icon: Bell },
    ],
  },
  {
    title: "Financial",
    items: [
      { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
      { label: "Accounting", href: "/dashboard/accounting", icon: BookOpen },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Customers", href: "/dashboard/customers", icon: Users },
      { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { label: "Users", href: "/dashboard/users", icon: UserCog },
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

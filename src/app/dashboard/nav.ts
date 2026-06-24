import {
  Calendar,
  FileText,
  Home,
  Inbox,
  Receipt,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
      { label: "Aanvragen", href: "/dashboard/requests", icon: Inbox },
      { label: "Offertes", href: "/dashboard/quotes", icon: FileText },
      { label: "Opdrachten", href: "/dashboard/jobs", icon: Wrench, comingSoon: true },
      { label: "Agenda", href: "/dashboard/schedule", icon: Calendar, comingSoon: true },
      { label: "Facturen", href: "/dashboard/invoices", icon: Receipt },
      { label: "Klanten", href: "/dashboard/customers", icon: Users },
      { label: "Instellingen", href: "/dashboard/settings", icon: Settings },
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
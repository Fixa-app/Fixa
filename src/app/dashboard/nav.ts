import {
  FileText,
  Home,
  Receipt,
  Settings,
  Users,
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
  comingSoon?: boolean;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
    ],
  },
  {
    title: "Aanvragen",
    comingSoon: true,
    items: [],
  },
  {
    title: "Verkoop",
    items: [
      { label: "Offertes", href: "/dashboard/quotes", icon: FileText },
    ],
  },
  {
    title: "Uitvoering",
    comingSoon: true,
    items: [],
  },
  {
    title: "Financieel",
    items: [
      { label: "Facturen", href: "/dashboard/invoices", icon: Receipt },
    ],
  },
  {
    title: "Beheer",
    items: [
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
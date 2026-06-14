import {
  FileText,
  Inbox,
  Receipt,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Shared "Nieuw" create menu items. Icons are colored to match the workflow
// stages (Aanvraag red, Offerte orange, Opdracht violet, Factuur teal).
export const CREATE_ITEMS: {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}[] = [
  {
    label: "Klant",
    icon: Users,
    href: "/dashboard/customers",
    color: "text-foreground",
  },
  {
    label: "Aanvraag",
    icon: Inbox,
    href: "#",
    color: "text-burgundy-bright",
  },
  {
    label: "Offerte",
    icon: FileText,
    href: "/dashboard/quotes/new",
    color: "text-primary",
  },
  {
    label: "Opdracht",
    icon: Wrench,
    href: "#",
    color: "text-violet-bright",
  },
  {
    label: "Factuur",
    icon: Receipt,
    href: "/dashboard/invoices",
    color: "text-teal-bright",
  },
];

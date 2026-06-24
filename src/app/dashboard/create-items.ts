import {
  FileText,
  Inbox,
  Receipt,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Shared "Nieuw" create menu items. Icons are colored to match the workflow
// stages (Aanvraag red, Offerte orange, Opdracht violet, Factuur teal).
// Klant is hier bewust niet aanwezig — klanten worden alleen aangemaakt als
// onderdeel van een aanvraag of offerte, geen losse "klant toevoegen"-flow.
export const CREATE_ITEMS: {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}[] = [
  {
    label: "Aanvraag",
    icon: Inbox,
    href: "/dashboard/requests/new",
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
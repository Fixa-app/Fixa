"use client";

import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CalendarCheck,
  FileText,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Receipt,
  Repeat,
  Star,
  Users,
  Wrench,
} from "lucide-react";

type ProductFeature = {
  name: string;
  body: string;
  icon: LucideIcon;
};

type ProductPhase = {
  key: string;
  label: string;
  features: ProductFeature[];
};

const phases: ProductPhase[] = [
  {
    key: "leads",
    label: "Betere aanvragen",
    features: [
      {
        name: "Online boekingen",
        icon: CalendarCheck,
        body: "Klanten boeken zelf via je website of agenda. Direct ingepland, geen heen-en-weer.",
      },
      {
        name: "Website & reviews",
        icon: Star,
        body: "Een professionele bedrijfspagina met reviews die nieuwe klanten over de streep trekken.",
      },
      {
        name: "Reserveren via Google",
        icon: MapPin,
        body: "Verschijn met een 'Reserveer'-knop in Google. Aanvragen landen automatisch in je inbox.",
      },
    ],
  },
  {
    key: "sales",
    label: "Meer werk",
    features: [
      {
        name: "Offertes",
        icon: FileText,
        body: "Stel offertes op met line items, deel ze digitaal, zie wanneer ze gelezen worden.",
      },
      {
        name: "Service plans",
        icon: Repeat,
        body: "Terugkerende contracten voor onderhoud. Voorspelbare omzet, automatische werkbonnen.",
      },
      {
        name: "Communicatie",
        icon: MessageSquare,
        body: "Eén inbox voor klanten, leveranciers en team. Stop met wisselen tussen apps.",
      },
    ],
  },
  {
    key: "operations",
    label: "Slimmer werken",
    features: [
      {
        name: "Jobs",
        icon: Wrench,
        body: "Plan, dispatch en voer werk uit. Van werkbon tot afgeronde klus zonder papier.",
      },
      {
        name: "Schedule",
        icon: Calendar,
        body: "Eén kalender voor intakes en jobs. Drag-and-drop om snel te herplannen.",
      },
      {
        name: "Klanthub",
        icon: Users,
        body: "Klanten zien zelf wat er speelt — minder belletjes, meer vertrouwen.",
      },
    ],
  },
  {
    key: "financial",
    label: "Meer winst",
    features: [
      {
        name: "Facturen",
        icon: Receipt,
        body: "Genereer facturen vanuit afgeronde jobs. Automatische herinneringen tot je betaald bent.",
      },
      {
        name: "Accounting",
        icon: BookOpen,
        body: "Sync naar je boekhouder zonder dubbel werk. Categorieën, btw en betalingen kloppen.",
      },
      {
        name: "Reports",
        icon: BarChart3,
        body: "Omzet, marge en time-to-paid in één dashboard. Zie wat werkt.",
      },
    ],
  },
];

export function ProductTabs() {
  const [active, setActive] = useState(0);
  const activePhase = phases[active];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {phases.map((phase, i) => (
          <button
            key={phase.key}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              active === i
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground/70 hover:text-foreground"
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-cream p-4 sm:p-6">
        <div
          key={activePhase.key}
          className="grid animate-in fade-in slide-in-from-bottom-2 gap-4 duration-300 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activePhase.features.map((feature) => (
            <article
              key={feature.name}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6"
            >
              <feature.icon
                className="size-6 text-foreground/80"
                strokeWidth={2}
              />
              <h3 className="text-lg font-semibold tracking-tight">
                {feature.name}
              </h3>
              <p className="text-sm leading-snug text-muted-foreground">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

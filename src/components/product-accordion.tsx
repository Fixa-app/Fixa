"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CalendarCheck,
  Clock,
  CreditCard,
  FileText,
  type LucideIcon,
  Minus,
  Plus,
} from "lucide-react";
import { mockupByKey } from "@/components/product-mockups";

type Feature = {
  key: string;
  name: string;
  icon: LucideIcon;
  body: string;
  href: string;
};

type Group = {
  key: string;
  label: string;
  features: Feature[];
};

const groups: Group[] = [
  {
    key: "leads",
    label: "Betere leads",
    features: [
      {
        key: "online-intakes",
        name: "Online intakes",
        icon: CalendarCheck,
        body: "Klanten boeken zelf een intake-afspraak via je website. Direct in je agenda, geen heen-en-weer.",
        href: "#",
      },
      {
        key: "quotes",
        name: "Offertes",
        icon: FileText,
        body: "Stel offertes op met line items, deel ze digitaal en zie wanneer ze gelezen worden.",
        href: "#",
      },
    ],
  },
  {
    key: "operations",
    label: "Slimmer werken",
    features: [
      {
        key: "planning",
        name: "Planning",
        icon: Calendar,
        body: "Plan jobs over je hele team. Drag-and-drop in een week- of maandweergave.",
        href: "#",
      },
      {
        key: "schedule",
        name: "Schedule",
        icon: Clock,
        body: "Stuur je crews aan met routes, materialen en klantinfo direct op hun telefoon.",
        href: "#",
      },
    ],
  },
  {
    key: "financial",
    label: "Boost profits",
    features: [
      {
        key: "payments",
        name: "Betalingen",
        icon: CreditCard,
        body: "Verstuur betaallinks bij elke factuur. Klanten betalen in één klik via iDEAL of kaart.",
        href: "#",
      },
      {
        key: "reports",
        name: "Rapporten",
        icon: BarChart3,
        body: "Omzet, marge en openstaande facturen in één overzicht. Zie wat werkt.",
        href: "#",
      },
    ],
  },
];

const allFeatures = groups.flatMap((g) => g.features);

export function ProductAccordion() {
  const [activeKey, setActiveKey] = useState(allFeatures[0].key);
  const activeFeature =
    allFeatures.find((f) => f.key === activeKey) ?? allFeatures[0];

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              {group.label}
            </h3>
            <div className="flex flex-col gap-2">
              {group.features.map((feature) => {
                const open = activeKey === feature.key;
                return (
                  <div
                    key={feature.key}
                    className="rounded-2xl bg-[#E4E2DB] px-5"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveKey(feature.key)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
                    >
                      <span className="flex items-center gap-3 text-base font-semibold tracking-tight">
                        <feature.icon
                          className="size-5 text-foreground/80"
                          strokeWidth={2}
                        />
                        {feature.name}
                      </span>
                      {open ? (
                        <Minus
                          className="size-5 text-foreground/60"
                          strokeWidth={2}
                        />
                      ) : (
                        <Plus
                          className="size-5 text-foreground/60"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                    {open && (
                      <div className="flex animate-in flex-col gap-2 pb-4 pl-8 duration-300 fade-in">
                        <p className="text-sm text-muted-foreground">
                          {feature.body}
                        </p>
                        <Link
                          href={feature.href}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                        >
                          Lees meer
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-3xl md:aspect-auto md:h-full">
        {(() => {
          const Mockup = mockupByKey[activeFeature.key];
          return Mockup ? (
            <div
              key={activeFeature.key}
              className="absolute inset-0 animate-in duration-500 fade-in"
            >
              <Mockup />
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

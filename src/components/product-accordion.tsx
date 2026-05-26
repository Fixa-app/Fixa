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
        name: "Online aanvragen",
        icon: CalendarCheck,
        body: "Klanten dienen aanvragen direct via je website in. Landt automatisch in je inbox, geen heen-en-weer.",
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
      <div className="flex flex-col gap-2">
        {allFeatures.map((feature) => {
          const open = activeKey === feature.key;
          return (
            <div
              key={feature.key}
              className={`rounded-2xl px-5 transition-colors ${
                open ? "bg-[#D8D5C8]" : "hover:bg-foreground/5"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveKey(feature.key)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <feature.icon
                    className="size-6 text-foreground/80"
                    strokeWidth={2}
                  />
                  {feature.name}
                </span>
                {open ? (
                  <Minus
                    className="size-6 text-foreground/60"
                    strokeWidth={2}
                  />
                ) : (
                  <Plus
                    className="size-6 text-foreground/60"
                    strokeWidth={2}
                  />
                )}
              </button>
              {open && (
                <div className="flex animate-in flex-col gap-2 pb-5 duration-300 fade-in lg:pl-9">
                  <p className="text-base text-muted-foreground">
                    {feature.body}
                  </p>
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-base font-semibold underline-offset-4 hover:underline"
                  >
                    Lees meer
                    <ArrowRight className="size-4" />
                  </Link>
                  {(() => {
                    const Mockup = mockupByKey[feature.key];
                    return Mockup ? (
                      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl md:hidden">
                        <div className="absolute inset-0">
                          <Mockup />
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative hidden aspect-square w-full overflow-hidden rounded-3xl bg-[#D8D5C8] md:block md:aspect-auto md:h-full">
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

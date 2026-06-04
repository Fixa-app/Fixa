"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  CalendarCheck,
  Clock,
  CreditCard,
  FileText,
  type LucideIcon,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BetalingenMockup,
  OffertesMockup,
  OnlineIntakesMockup,
  PlanningMockup,
  RapportenMockup,
  ScheduleMockup,
} from "@/components/product-mockups";
import { AIQuoteMockup } from "@/components/ai-mockups";

type Feature = {
  key: string;
  name: string;
  icon: LucideIcon;
  body: string;
  Mockup: () => React.ReactElement;
};

const features: Feature[] = [
  {
    key: "online-intakes",
    name: "Online aanvragen",
    icon: CalendarCheck,
    body: "Klanten dienen aanvragen direct via je website in. Landt automatisch in je inbox, geen heen-en-weer.",
    Mockup: OnlineIntakesMockup,
  },
  {
    key: "quotes",
    name: "Offertes",
    icon: FileText,
    body: "Stel offertes op met line items, deel ze digitaal en zie wanneer ze gelezen worden.",
    Mockup: OffertesMockup,
  },
  {
    key: "planning",
    name: "Planning",
    icon: Calendar,
    body: "Plan jobs over je hele team. Drag-and-drop in een week- of maandweergave.",
    Mockup: PlanningMockup,
  },
  {
    key: "schedule",
    name: "Schedule",
    icon: Clock,
    body: "Stuur je crews aan met routes, materialen en klantinfo direct op hun telefoon.",
    Mockup: ScheduleMockup,
  },
  {
    key: "payments",
    name: "Betalingen",
    icon: CreditCard,
    body: "Verstuur betaallinks bij elke factuur. Klanten betalen in één klik via iDEAL of kaart.",
    Mockup: BetalingenMockup,
  },
  {
    key: "reports",
    name: "Rapporten",
    icon: BarChart3,
    body: "Omzet, marge en openstaande facturen in één overzicht. Zie wat werkt.",
    Mockup: RapportenMockup,
  },
  {
    key: "ai",
    name: "Fixa Assist AI",
    icon: Sparkles,
    body: "AI leest je intake-notities en stelt direct een complete offerte op — line items, prijzen en BTW al ingevuld.",
    Mockup: AIQuoteMockup,
  },
];

export function PricingFeatures() {
  const [active, setActive] = useState<Feature | null>(null);

  return (
    <>
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <button
            key={feature.key}
            type="button"
            onClick={() => setActive(feature)}
            className="-mx-3 flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-card"
          >
            <feature.icon
              className="size-6 shrink-0 text-foreground/80"
              strokeWidth={2}
            />
            <span className="text-2xl font-semibold tracking-tight">
              {feature.name}
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {active && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <DialogTitle className="flex items-center gap-3 font-sans text-2xl font-semibold tracking-tight">
                  <active.icon
                    className="size-6 shrink-0 text-foreground/80"
                    strokeWidth={2}
                  />
                  {active.name}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed">
                  {active.body}
                </DialogDescription>
              </div>
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-card">
                <active.Mockup />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

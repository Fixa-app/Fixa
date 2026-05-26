"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import {
  OnlineIntakesMockup,
  PlanningMockup,
  RapportenMockup,
} from "@/components/product-mockups";

const reasons = [
  {
    title: "Betere aanvragen",
    body: "Klanten dienen aanvragen 24/7 in via je website of agenda. Geen heen-en-weer over beschikbaarheid — alle info direct in je systeem.",
    Visual: OnlineIntakesMockup,
  },
  {
    title: "Slimmer werken",
    body: "Plan, dispatch en stuur je crews aan vanaf één plek. Geen losse spreadsheets of WhatsApp-groepen meer.",
    Visual: PlanningMockup,
  },
  {
    title: "Meer winst",
    body: "Sneller factureren, sneller betaald krijgen, en zien wat je bedrijf oplevert — in één overzicht.",
    Visual: RapportenMockup,
  },
];

const CYCLE_MS = 5000;

export function WhyFixaCards() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % reasons.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  const ActiveVisual = reasons[active].Visual;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
      <div className="flex aspect-square flex-col gap-6 overflow-hidden rounded-3xl bg-[#EAE9E3] p-6 md:aspect-auto md:p-8">
        <style>{`
          @keyframes whyfixa-progress {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
        `}</style>
        <div className="flex gap-2">
          {reasons.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Bekijk ${reasons[i].title}`}
              className="flex-1 py-1"
            >
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/15">
                {i === active && (
                  <div
                    key={active}
                    className="h-full origin-left rounded-full bg-foreground"
                    style={{
                      animation: `whyfixa-progress ${CYCLE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div
            key={active}
            className="absolute inset-0 flex items-center justify-center animate-in fade-in duration-700"
          >
            <ActiveVisual />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-3xl bg-teal p-8 text-teal-foreground md:p-10">
        <div className="flex flex-col gap-6 md:gap-7">
          {reasons.map((reason, i) => (
            <button
              key={reason.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Bekijk ${reason.title}`}
              className={`flex flex-col gap-1.5 rounded-xl p-2 text-left transition-opacity ${
                i === active ? "opacity-100" : "opacity-60 hover:opacity-80"
              }`}
            >
              <h3 className="text-2xl font-semibold tracking-tight">
                {reason.title}
              </h3>
              <p className="text-base leading-relaxed text-teal-foreground/80">
                {reason.body}
              </p>
            </button>
          ))}
        </div>
        <div className="mt-auto flex justify-end">
          <AuthDialog>
            <Button className="h-12 rounded-xl px-6 text-base font-bold">
              Aan de slag
            </Button>
          </AuthDialog>
        </div>
      </div>
    </div>
  );
}

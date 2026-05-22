"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export type ProductFeature = {
  name: string;
  body: string;
  icon: LucideIcon;
};

export type ProductPhase = {
  key: string;
  label: string;
  features: ProductFeature[];
};

export function ProductTabs({ phases }: { phases: ProductPhase[] }) {
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

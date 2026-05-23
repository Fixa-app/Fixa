"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Group = {
  key: string;
  label: string;
  body: string;
  features: { name: string; href: string }[];
};

const groups: Group[] = [
  {
    key: "leads",
    label: "Betere leads",
    body: "Vang elke aanvraag op en zet ze om in werk. Online intakes en offertes die klanten in één klik accepteren.",
    features: [
      { name: "Online intakes", href: "#" },
      { name: "Offertes", href: "#" },
    ],
  },
  {
    key: "operations",
    label: "Slimmer werken",
    body: "Plan crews, dispatch werk en houd grip op je dag. Geen losse spreadsheets meer.",
    features: [
      { name: "Planning", href: "#" },
      { name: "Schedule", href: "#" },
    ],
  },
  {
    key: "financial",
    label: "Meer winst",
    body: "Factureer sneller, krijg sneller betaald en zie wat het bedrijf oplevert — in één overzicht.",
    features: [
      { name: "Betalingen", href: "#" },
      { name: "Rapporten", href: "#" },
    ],
  },
];

const ADVANCE_MS = 7000;

export function ProductCarousel() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let rafId = 0;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / ADVANCE_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActive((i) => (i + 1) % groups.length);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active]);

  const activeGroup = groups[active];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-3">
        {groups.map((g, i) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Bekijk ${g.label}`}
            className="group flex-1 py-2"
          >
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/15">
              <div
                className="h-full bg-foreground transition-[width] duration-100 ease-linear"
                style={{
                  width:
                    i < active
                      ? "100%"
                      : i === active
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div
          key={`text-${activeGroup.key}`}
          className="flex animate-in flex-col gap-6 duration-500 fade-in"
        >
          <h3 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {activeGroup.label}
          </h3>
          <p className="text-muted-foreground sm:text-lg">{activeGroup.body}</p>
          <ul className="flex flex-col gap-3">
            {activeGroup.features.map((f) => (
              <li key={f.name}>
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1.5 text-base font-semibold underline-offset-4 hover:underline"
                >
                  {f.name}
                  <ArrowRight className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div
          key={`visual-${activeGroup.key}`}
          className="flex animate-in items-center justify-center duration-500 fade-in"
        >
          <PhoneMockup label={activeGroup.label} />
        </div>
      </div>
    </div>
  );
}

function PhoneMockup({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="relative aspect-[9/19] w-full max-w-[280px] rounded-[2.75rem] bg-black p-2 shadow-2xl ring-1 ring-black/10"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-[2.25rem] bg-cream text-cream-foreground">
        <span className="text-[10px] font-bold tracking-widest text-cream-foreground/50 uppercase">
          {label}
        </span>
        <span className="text-sm font-medium text-cream-foreground/70">
          App preview
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Group = {
  key: string;
  label: string;
  body: string;
  features: { name: string; href: string }[];
  image: string;
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
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1400&q=80",
  },
  {
    key: "operations",
    label: "Slimmer werken",
    body: "Plan crews, dispatch werk en houd grip op je dag. Geen losse spreadsheets meer.",
    features: [
      { name: "Planning", href: "#" },
      { name: "Schedule", href: "#" },
    ],
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1400&q=80",
  },
  {
    key: "financial",
    label: "Meer winst",
    body: "Factureer sneller, krijg sneller betaald en zie wat het bedrijf oplevert — in één overzicht.",
    features: [
      { name: "Betalingen", href: "#" },
      { name: "Rapporten", href: "#" },
    ],
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1400&q=80",
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

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16 md:items-center">
      <div className="flex flex-col gap-8 md:gap-10">
        {groups.map((g, i) => (
          <div
            key={g.key}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(i);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={i === active}
            className={`flex cursor-pointer flex-col gap-3 transition-opacity duration-300 ${
              i === active ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
              {g.label}
            </h3>
            <p className="text-muted-foreground">{g.body}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {g.features.map((f) => (
                <li key={f.name}>
                  <Link
                    href={f.href}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    {f.name}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream">
        {groups.map((g, i) => (
          <Image
            key={g.key}
            src={g.image}
            alt={g.label}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-x-6 bottom-6 flex gap-3">
          {groups.map((g, i) => (
            <div
              key={g.key}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white transition-[width] duration-100 ease-linear"
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
          ))}
        </div>
      </div>
    </div>
  );
}

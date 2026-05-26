"use client";

import { useState } from "react";
import {
  Calendar,
  FileText,
  Mail,
  MessageCircle,
  NotebookPen,
  Table,
} from "lucide-react";

const FREE_THRESHOLD = 5000;
const TIER_SIZE = 5000;
const PRICE_PER_TIER = 15;
const MAX_REVENUE = 100000;

const replacedApps = [
  { icon: MessageCircle, label: "WhatsApp" },
  { icon: Calendar, label: "Agenda" },
  { icon: Table, label: "Excel" },
  { icon: NotebookPen, label: "Notitieblok" },
  { icon: FileText, label: "Word" },
  { icon: Mail, label: "Email" },
];

function formatRevenue(value: number) {
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
  return `€${value}`;
}

export function PricingCalculator() {
  const [revenue, setRevenue] = useState(20000);

  const tiers = Math.max(
    0,
    Math.ceil((revenue - FREE_THRESHOLD) / TIER_SIZE),
  );
  const price = tiers * PRICE_PER_TIER;
  const thumbPercent = (revenue / MAX_REVENUE) * 100;

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      <div className="flex flex-col gap-8">
        <h3 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
          Eén platform.
          <br />
          Eén abonnement.
          <br />
          Geen contracten.
        </h3>
        <div className="flex flex-col gap-4">
          <p className="text-base text-white/80">
            Vervang je ingewikkelde tech-stack met één systeem.
          </p>
          <div className="flex flex-wrap gap-3">
            {replacedApps.map((app) => (
              <div
                key={app.label}
                aria-label={app.label}
                className="relative flex size-12 items-center justify-center rounded-xl bg-white/10 text-white"
              >
                <app.icon className="size-5" strokeWidth={2} />
                <div className="absolute -top-1 -left-1 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-foreground">
                  ×
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <h3 className="text-xl font-semibold text-white">
          Bereken jouw abonnementskosten
        </h3>
        <div className="flex flex-col gap-3">
          <span className="text-base text-white/80">
            Jouw maandelijkse omzet
          </span>
          <div className="relative pt-10">
            <div
              className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-sm font-bold text-foreground transition-[left] duration-100"
              style={{ left: `${thumbPercent}%` }}
            >
              {formatRevenue(revenue)}
            </div>
            <input
              type="range"
              min={0}
              max={MAX_REVENUE}
              step={1000}
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              aria-label="Maandelijkse omzet"
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 outline-none [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{
                background: `linear-gradient(to right, white 0%, white ${thumbPercent}%, rgba(255,255,255,0.2) ${thumbPercent}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
            <div className="mt-2 flex justify-between text-xs text-white/60">
              <span>€0</span>
              <span>€100K+</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-base text-white/80">
            Jouw abonnementskosten
          </span>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-6xl font-bold tracking-tight text-white">
                €{price}
              </span>
              <span className="text-2xl font-medium text-white/60">/ma</span>
            </div>
            <div className="text-sm text-white/60 sm:pb-2">
              <div>Eerste €5k omzet: €0/maand</div>
              <div>Extra €5k: €15/maand</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

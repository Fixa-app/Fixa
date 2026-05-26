"use client";

import { useState } from "react";

const FREE_THRESHOLD = 5000;
const TIER_SIZE = 5000;
const PRICE_PER_TIER = 15;
const MAX_REVENUE = 100000;

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
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          Bereken jouw abonnementskosten
        </h3>
        <div className="relative pt-12">
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-base font-bold text-foreground transition-[left] duration-100"
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
          <div className="mt-3 flex justify-between text-base font-medium text-white/60">
            <span>€0</span>
            <span>€100K+</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-widest text-white/60 uppercase">
            Jouw abonnementskosten
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-6xl font-bold tracking-tight text-white">
              €{price}
            </span>
            <span className="text-2xl font-medium text-white/60">/ma</span>
          </div>
        </div>
        <div className="text-base leading-relaxed text-white/60 sm:text-right">
          <div>Eerste €5k omzet: gratis</div>
          <div>Daarna €15/maand per €5k</div>
        </div>
      </div>
    </div>
  );
}

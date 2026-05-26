"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Referral = {
  firstName: string;
  company: string;
  quote: string;
  image: string;
  href: string;
};

const referrals: Referral[] = [
  {
    firstName: "Tom",
    company: "Loodgieter Visser",
    quote:
      "Sinds Fixa missen we geen aanvragen meer. Klanten boeken zelf en facturen gaan automatisch de deur uit.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80",
    href: "#",
  },
  {
    firstName: "Mark",
    company: "Elektrotechniek Smit",
    quote:
      "Drie monteurs op de weg, één planning. Fixa houdt overzicht waar mijn whatsapp dat niet meer kon.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
    href: "#",
  },
  {
    firstName: "Sander",
    company: "Klusbedrijf de Jong",
    quote:
      "De Klanthub maakt het verschil. Klanten zien zelf wat er speelt — ik krijg veel minder belletjes.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1600&q=80",
    href: "#",
  },
  {
    firstName: "Lisa",
    company: "CV-specialist Bakker",
    quote:
      "Service plans lopen vanzelf door. Voorspelbare omzet zonder dat ik er administratie aan kwijt ben.",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&q=80",
    href: "#",
  },
];

export function ReferralsCards() {
  const [active, setActive] = useState(0);

  const gridTemplateColumns = referrals
    .map((_, i) => (i === active ? "var(--active-fr)" : "1fr"))
    .join(" ");

  return (
    <div className="px-4">
    <div
      className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-4 transition-[grid-template-columns] duration-500 ease-out [--active-fr:2fr] lg:h-[400px] lg:[grid-template-columns:var(--cols)] xl:h-[480px] xl:[--active-fr:3fr]"
      style={{ ["--cols" as string]: gridTemplateColumns }}
    >
      {referrals.map((r, i) => {
        const isActive = i === active;
        return (
          <a
            key={r.company}
            href={r.href}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="group relative min-w-0 overflow-hidden rounded-2xl max-lg:aspect-[16/10]"
          >
            <Image
              src={r.image}
              alt={r.company}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={`object-cover transition-[filter] duration-500 ${
                isActive ? "" : "max-lg:brightness-100 brightness-75"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            <div
              className={`absolute top-6 right-6 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-opacity duration-500 max-lg:opacity-100 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <ArrowUpRight className="size-5" />
            </div>

            <div
              className={`absolute right-6 left-6 transition-[bottom] duration-500 ease-out max-lg:bottom-28 ${
                isActive ? "bottom-28 sm:bottom-32" : "bottom-6"
              }`}
            >
              <h3 className="text-xl font-semibold tracking-tight whitespace-nowrap text-white sm:text-2xl">
                {r.firstName}
              </h3>
              <p
                className={`text-sm text-white/70 transition-opacity duration-300 max-lg:opacity-100 sm:text-base ${
                  isActive ? "opacity-100 delay-300" : "opacity-0"
                }`}
              >
                {r.company}
              </p>
            </div>

            <div
              className={`absolute right-6 bottom-6 left-6 transition-all duration-300 ease-out max-lg:pointer-events-auto max-lg:translate-y-0 max-lg:opacity-100 ${
                isActive
                  ? "translate-y-0 opacity-100 delay-500"
                  : "pointer-events-none translate-y-6 opacity-0"
              }`}
            >
              <p className="font-display text-xl leading-[1.15] font-medium tracking-tight text-white sm:text-2xl">
                &ldquo;{r.quote}&rdquo;
              </p>
            </div>
          </a>
        );
      })}
    </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Referral = {
  name: string;
  quote: string;
  image: string;
  href: string;
};

const referrals: Referral[] = [
  {
    name: "Loodgieter Visser",
    quote:
      "Sinds Fixa missen we geen aanvragen meer. Klanten boeken zelf en facturen gaan automatisch de deur uit.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80",
    href: "#",
  },
  {
    name: "Elektrotechniek Smit",
    quote:
      "Drie monteurs op de weg, één planning. Fixa houdt overzicht waar mijn whatsapp dat niet meer kon.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
    href: "#",
  },
  {
    name: "Klusbedrijf de Jong",
    quote:
      "De Klanthub maakt het verschil. Klanten zien zelf wat er speelt — ik krijg veel minder belletjes.",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1600&q=80",
    href: "#",
  },
  {
    name: "CV-specialist Bakker",
    quote:
      "Service plans lopen vanzelf door. Voorspelbare omzet zonder dat ik er administratie aan kwijt ben.",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&q=80",
    href: "#",
  },
];

export function ReferralsCards() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[500px] gap-2 px-4 sm:h-[600px]">
      {referrals.map((r, i) => {
        const isActive = i === active;
        return (
          <a
            key={r.name}
            href={r.href}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`group relative overflow-hidden rounded-2xl transition-[flex-grow] duration-500 ease-out ${
              isActive ? "flex-[5]" : "flex-[1]"
            }`}
            style={isActive ? undefined : { flexBasis: "320px" }}
          >
            <Image
              src={r.image}
              alt={r.name}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className={`object-cover transition-[filter] duration-500 ${
                isActive ? "" : "brightness-75"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            <div
              className={`absolute right-6 top-6 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <ArrowUpRight className="size-5" />
            </div>

            <h3
              className={`absolute right-6 left-6 font-display font-semibold tracking-tight text-white transition-all duration-500 ease-out ${
                isActive
                  ? "top-6 text-left text-xl sm:text-2xl"
                  : "top-1/2 -translate-y-1/2 text-center text-lg"
              }`}
            >
              {r.name}
            </h3>

            <div
              className={`absolute right-6 bottom-6 left-6 transition-all duration-500 ease-out ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-10 opacity-0"
              }`}
            >
              <p className="font-display text-2xl leading-[1.15] font-medium tracking-tight text-white sm:text-3xl lg:text-4xl">
                &ldquo;{r.quote}&rdquo;
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}

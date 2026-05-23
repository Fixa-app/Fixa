"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Referral = {
  name: string;
  quote: string;
  tags: string[];
  image: string;
  href: string;
};

const referrals: Referral[] = [
  {
    name: "Loodgieter Visser",
    quote:
      "Sinds Fixa missen we geen aanvragen meer. Klanten boeken zelf en facturen gaan automatisch de deur uit.",
    tags: ["Amsterdam", "Loodgieter"],
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80",
    href: "#",
  },
  {
    name: "Elektrotechniek Smit",
    quote:
      "Drie monteurs op de weg, één planning. Fixa houdt overzicht waar mijn whatsapp dat niet meer kon.",
    tags: ["Utrecht", "Elektrotechniek"],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
    href: "#",
  },
  {
    name: "Klusbedrijf de Jong",
    quote:
      "De Klanthub maakt het verschil. Klanten zien zelf wat er speelt — ik krijg veel minder belletjes.",
    tags: ["Rotterdam", "Klusbedrijf"],
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1600&q=80",
    href: "#",
  },
  {
    name: "CV-specialist Bakker",
    quote:
      "Service plans lopen vanzelf door. Voorspelbare omzet zonder dat ik er administratie aan kwijt ben.",
    tags: ["Eindhoven", "CV & klimaat"],
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

            {isActive ? (
              <>
                <div className="absolute top-6 right-6 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight className="size-5" />
                </div>
                <div className="absolute inset-x-6 bottom-6 flex animate-in flex-col gap-3 text-white duration-500 fade-in">
                  <span className="text-sm font-semibold tracking-tight text-white/80">
                    {r.name}
                  </span>
                  <p className="text-lg leading-snug font-medium sm:text-xl">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-white/40 px-2.5 py-0.5 text-xs text-white/85"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span
                  className="text-lg font-semibold tracking-tight whitespace-nowrap text-white [writing-mode:vertical-rl] rotate-180"
                >
                  {r.name}
                </span>
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}

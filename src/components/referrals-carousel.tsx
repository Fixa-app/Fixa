"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

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
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=80",
    href: "#",
  },
  {
    name: "Elektrotechniek Smit",
    quote:
      "Drie monteurs op de weg, één planning. Fixa houdt overzicht waar mijn whatsapp dat niet meer kon.",
    tags: ["Utrecht", "Elektrotechniek"],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
    href: "#",
  },
  {
    name: "Klusbedrijf de Jong",
    quote:
      "De Klanthub maakt het verschil. Klanten zien zelf wat er speelt — ik krijg veel minder belletjes.",
    tags: ["Rotterdam", "Klusbedrijf"],
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&q=80",
    href: "#",
  },
  {
    name: "CV-specialist Bakker",
    quote:
      "Service plans lopen vanzelf door. Voorspelbare omzet zonder dat ik er administratie aan kwijt ben.",
    tags: ["Eindhoven", "CV & klimaat"],
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&q=80",
    href: "#",
  },
];

export function ReferralsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll("prev")}
          aria-label="Vorige"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          aria-label="Volgende"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {referrals.map((r) => (
          <a
            key={r.name}
            href={r.href}
            className="group relative aspect-[5/4] w-[440px] flex-shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[520px]"
          >
            <Image
              src={r.image}
              alt={r.name}
              fill
              sizes="520px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
            <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
              <span className="text-base font-semibold tracking-tight text-white">
                {r.name}
              </span>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight className="size-5" />
              </div>
            </div>
            <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3 text-white">
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
          </a>
        ))}
      </div>
    </div>
  );
}

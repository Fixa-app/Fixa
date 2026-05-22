"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type IndustryCard = {
  name: string;
  image: string;
};

export function IndustriesCarousel({ cards }: { cards: IndustryCard[] }) {
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
    <div className="flex flex-col gap-6">
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
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <a
            key={card.name}
            href="#features"
            className="group relative aspect-[4/5] w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] sm:w-[320px]"
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between text-lg font-semibold text-white">
              <span>{card.name}</span>
              <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

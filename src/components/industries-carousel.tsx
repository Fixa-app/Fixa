"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type IndustryCard = {
  name: string;
  body: string;
  image: string;
};

export function IndustriesCarousel({
  cards,
  headerContent,
}: {
  cards: IndustryCard[];
  headerContent?: React.ReactNode;
}) {
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
      <div className="mx-auto flex w-full max-w-[1536px] items-end justify-between gap-6 px-4">
        <div className="flex-1">{headerContent}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="Vorige"
            className="flex size-10 items-center justify-center rounded-full bg-[#E4E2DB] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Volgende"
            className="flex size-10 items-center justify-center rounded-full bg-[#E4E2DB] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-pl-4 scroll-pr-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        {cards.map((card) => (
          <a
            key={card.name}
            href="#features"
            className="group relative aspect-[4/5] w-[300px] flex-shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[340px]"
          >
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="340px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
              <ArrowUpRight className="size-5" />
            </div>
            <h3 className="absolute inset-x-5 bottom-5 text-2xl leading-tight font-semibold text-white transition-transform duration-300 ease-out group-hover:-translate-y-[52px]">
              {card.name}
            </h3>
            <p className="absolute inset-x-5 bottom-5 translate-y-8 text-sm leading-snug text-white/85 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              {card.body}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

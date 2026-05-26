"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    q: "Wat kost Fixa?",
    a: "De eerste €5k maandomzet is gratis. Daarna betaal je €15 per maand per extra €5k omzet. Geen vaste kosten, geen contract — je betaalt mee terwijl je groeit.",
  },
  {
    q: "Voor wie is Fixa gemaakt?",
    a: "Voor service- en kluspraktijken in Nederland: loodgieters, elektriciens, CV-monteurs, hoveniers, schoonmaak, klusbedrijven, schilders en dakdekkers. Eén persoon of een team van twintig — de werkstroom blijft hetzelfde.",
  },
  {
    q: "Hoe snel kan ik aan de slag?",
    a: "Minder dan een uur. Upload een bestaande factuur, vul je bedrijfsgegevens aan en je kunt direct je eerste factuur via Fixa versturen.",
  },
  {
    q: "Kan ik mijn bestaande offertes en facturen meenemen?",
    a: "Ja. Upload je huidige PDF's en Fixa zet ze automatisch om naar je nieuwe sjabloon. Klanten en producten worden in één keer geïmporteerd.",
  },
  {
    q: "Werkt Fixa op mijn telefoon?",
    a: "Ja. Fixa werkt in elke browser, op desktop en mobiel. Een eigen app voor onderweg volgt later dit jaar.",
  },
  {
    q: "Zit ik vast aan een contract?",
    a: "Nee. Geen vaste contractduur, geen opzegtermijn. Je data blijft na opzeggen 90 dagen beschikbaar om te exporteren.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.q}
            className={`rounded-2xl px-5 transition-colors ${
              open ? "bg-[#EAE9E3]" : "hover:bg-foreground/5"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-lg font-semibold tracking-tight sm:text-xl">
                {faq.q}
              </span>
              {open ? (
                <Minus
                  className="size-6 shrink-0 text-foreground/60"
                  strokeWidth={2}
                />
              ) : (
                <Plus
                  className="size-6 shrink-0 text-foreground/60"
                  strokeWidth={2}
                />
              )}
            </button>
            {open && (
              <div className="animate-in pb-5 duration-300 fade-in">
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

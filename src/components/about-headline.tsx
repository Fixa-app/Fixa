"use client";

import { useEffect, useState } from "react";

const professions = [
  "loodgieter",
  "elektricien",
  "cv-monteur",
  "hovenier",
  "schoonmaker",
  "klusser",
  "schilder",
  "dakdekker",
];

function RotatingWord({ word, step }: { word: string; step: number }) {
  return (
    <span
      key={step}
      className="inline-block text-primary animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      {word}
    </span>
  );
}

export function AboutHeadline() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((prev) => (prev + 1) % professions.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  const word = professions[step];

  return (
    <h1 className="max-w-4xl font-display text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
      De beste <RotatingWord word={word} step={step} />
      <br />
      is een goede <RotatingWord word={word} step={step} />.
    </h1>
  );
}

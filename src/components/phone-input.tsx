"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Country = { code: string; dial: string; flag: string; name: string };

const COUNTRIES: Country[] = [
  { code: "NL", dial: "+31", flag: "🇳🇱", name: "Nederland" },
  { code: "BE", dial: "+32", flag: "🇧🇪", name: "België" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Duitsland" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "Frankrijk" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "Verenigd Koninkrijk" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spanje" },
  { code: "IT", dial: "+39", flag: "🇮🇹", name: "Italië" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "Verenigde Staten" },
];

export function PhoneInput({
  id,
  dialCode,
  onDialCodeChange,
  value,
  onChange,
  disabled,
}: {
  id?: string;
  dialCode: string;
  onDialCodeChange: (dial: string) => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected =
    COUNTRIES.find((c) => c.dial === dialCode) ?? COUNTRIES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-12 items-stretch overflow-hidden rounded-xl border border-foreground/15 bg-background focus-within:border-foreground/30">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-1.5 border-r border-foreground/15 px-3 text-base font-medium transition-colors hover:bg-foreground/5"
        >
          <span aria-hidden className="text-lg leading-none">
            {selected.flag}
          </span>
          <span className="text-foreground/70">{selected.dial}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="6 12345678"
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onDialCodeChange(c.dial);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <span aria-hidden className="text-lg leading-none">
                {c.flag}
              </span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-muted-foreground">{c.dial}</span>
              {c.dial === dialCode && (
                <Check className="size-4 shrink-0 text-foreground" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

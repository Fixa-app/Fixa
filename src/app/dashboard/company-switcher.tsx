"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { setActiveCompany } from "./actions";

type Company = { id: string; name: string };

export function CompanySwitcher({
  companies,
  activeId,
  companyName,
}: {
  companies: Company[];
  activeId: string;
  companyName: string;
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Single (or no) company: just show the name, no switcher.
  if (companies.length <= 1) {
    return companyName ? (
      <p className="truncate text-base font-bold" title={companyName}>
        {companyName}
      </p>
    ) : null;
  }

  function choose(id: string) {
    setOpen(false);
    if (id === activeId) return;
    startTransition(async () => {
      await setActiveCompany(id);
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left transition-colors hover:bg-hover"
      >
        <span className="truncate text-base font-bold" title={companyName}>
          {companyName}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg">
          {companies.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c.id)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-hover"
            >
              <span className="truncate">{c.name}</span>
              {c.id === activeId && (
                <Check className="size-4 shrink-0 text-foreground" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

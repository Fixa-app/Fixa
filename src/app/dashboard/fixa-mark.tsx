import { cn } from "@/lib/utils";

// Compact rounded-square "F" monogram used as the dashboard app icon. Fixed
// size so it looks identical in the expanded and collapsed menu.
export function FixaMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-dark font-display text-lg font-semibold leading-none text-white",
        className,
      )}
    >
      F
    </span>
  );
}

"use client";

import { useState } from "react";

export function CopyLink({ refCode }: { refCode: string }) {
  const [copied, setCopied] = useState(false);

  const link =
    typeof window === "undefined"
      ? `/?ref=${refCode}`
      : `${window.location.origin}/?ref=${refCode}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — leave the field for manual copy.
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        readOnly
        suppressHydrationWarning
        value={link}
        onFocus={(e) => e.target.select()}
        className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
      />
      <button
        type="button"
        onClick={copy}
        className="rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

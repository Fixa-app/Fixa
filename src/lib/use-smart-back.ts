"use client";

import { useRouter } from "next/navigation";

/**
 * Gaat terug in browser-historie als die bestaat, anders naar een fallback-route.
 * Gebruik dit voor terug-pijltjes zodat ze werken ongeacht waar de gebruiker
 * vandaan kwam (dashboard, lijst, edit-flow), zonder dat elke pagina dat
 * apart moet uitzoeken.
 */
export function useSmartBack(fallbackHref: string) {
  const router = useRouter();

  return function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };
}
/**
 * Relatieve tijdsweergave:
 * - 0-59 minuten: "x minuten geleden" (of "Zojuist" bij <1 min)
 * - 1-23 uur: "x uur geleden"
 * - 24+ uur: datum (bijv. "18 juni")
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return "Zojuist";
  if (diffMinutes < 60) return `${diffMinutes}m geleden`;
  if (diffHours < 24) return `${diffHours}u geleden`;

  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
}
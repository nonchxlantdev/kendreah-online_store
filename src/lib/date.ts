/** Relative ISO timestamps so demo dashboards stay populated. */
export function daysAgo(days: number, hour = 12): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, (days * 7) % 60, 0, 0);
  return d.toISOString();
}

export function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export type DateRangeKey = "today" | "7d" | "30d" | "90d" | "all";

export function rangeStart(range: DateRangeKey): Date | null {
  const now = new Date();
  if (range === "all") return null;
  if (range === "today") return startOfDay(now);
  const d = startOfDay(now);
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  d.setDate(d.getDate() - days);
  return d;
}

export function inRange(iso: string, range: DateRangeKey): boolean {
  const start = rangeStart(range);
  if (!start) return true;
  return new Date(iso) >= start;
}

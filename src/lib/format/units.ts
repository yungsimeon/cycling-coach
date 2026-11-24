const LOCALE = "de-DE";
const TIME_ZONE = "Europe/Berlin";

export function formatDistance(meters: number | null): string {
  if (meters === null) return "–";
  return (
    (meters / 1000).toLocaleString(LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " km"
  );
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, "0")} h`;
}

export function formatSpeed(kmh: number | null): string {
  if (kmh === null) return "–";
  return `${kmh.toLocaleString(LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km/h`;
}

export function formatElevation(meters: number | null): string {
  if (meters === null) return "–";
  return meters.toLocaleString(LOCALE) + " m";
}

export function formatTss(tss: number): string {
  return Math.round(tss).toString();
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, { timeZone: TIME_ZONE });
}

// "+16", "-2", "0" (for form/TSB, where the sign is the point)
export function formatSigned(value: number): string {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : rounded.toString();
}

// For local day strings ("YYYY-MM-DD"). They parse as UTC midnight, so format in UTC
// to keep the same day. short: "4.10.", long: "4.10.2026"
export function formatDay(day: string, style: "short" | "long" = "long"): string {
  return new Date(day).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "numeric",
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

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

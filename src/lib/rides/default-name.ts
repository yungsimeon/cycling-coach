import { MS_PER_MINUTE } from "@/lib/metrics/fitness";

export function defaultRideName(
  start: Date,
  utcOffsetMin: number | null,
): string {
  const utcOffsetMs = (utcOffsetMin ?? 0) * MS_PER_MINUTE;
  const hourString = new Date(utcOffsetMs + start.getTime())
    .toISOString()
    .slice(11, 13);
  const hour = parseInt(hourString);
  if (hour >= 5 && hour < 11) return "Morning ride";
  if (hour >= 11 && hour < 14) return "Lunch ride";
  if (hour >= 14 && hour < 18) return "Afternoon ride";
  if (hour >= 18 && hour < 22) return "Evening ride";
  return "Night ride";
}

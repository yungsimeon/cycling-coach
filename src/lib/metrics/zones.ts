export type Zone = {
  zone: number;
  name: string;
  maxPct: number;
};

export type ZoneTime = {
  zone: number;
  timeS: number;
};

export const POWER_ZONES: Zone[] = [
  { zone: 1, name: "Active Recovery", maxPct: 55 },
  { zone: 2, name: "Endurance", maxPct: 75 },
  { zone: 3, name: "Tempo", maxPct: 90 },
  { zone: 4, name: "Threshold", maxPct: 105 },
  { zone: 5, name: "VO2max", maxPct: 120 },
  { zone: 6, name: "Anaerobic", maxPct: 150 },
  { zone: 7, name: "Neuromuscular", maxPct: Infinity },
];

export const HR_ZONES: Zone[] = [
  { zone: 1, name: "Active Recovery", maxPct: 68 },
  { zone: 2, name: "Endurance", maxPct: 83 },
  { zone: 3, name: "Tempo", maxPct: 94 },
  { zone: 4, name: "Threshold", maxPct: 105 },
  { zone: 5, name: "VO2max", maxPct: Infinity },
];

export function zoneFor(value: number, threshold: number, zones: Zone[]): Zone {
  const percentage = (value / threshold) * 100;
  for (const zone of zones) {
    if (zone.maxPct >= percentage) return zone;
  }
  throw new Error(`No zone found for ${value} at ${threshold}`);
}

export function timePerZone(
  values: number[],
  threshold: number,
  zones: Zone[],
): ZoneTime[] {
  const zoneTimes: ZoneTime[] = zones.map((zone) => {
    return { zone: zone.zone, timeS: 0 };
  });

  for (const value of values) {
    const currentZone = zoneFor(value, threshold, zones);
    const matchingZone = zoneTimes.find(
      (element) => element.zone === currentZone.zone,
    );
    if (!matchingZone) continue;
    matchingZone.timeS += 1;
  }
  return zoneTimes;
}

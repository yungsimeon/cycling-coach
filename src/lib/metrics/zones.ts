import type { RideSample } from "../fit/types";

export type PowerZone = {
  zone: number;
  name: string;
  maxPctFtp: number;
};

export type ZoneTime = {
  zone: number;
  timeS: number;
};

export const POWER_ZONES: PowerZone[] = [
  { zone: 1, name: "Active Recovery", maxPctFtp: 55 },
  { zone: 2, name: "Endurance", maxPctFtp: 75 },
  { zone: 3, name: "Tempo", maxPctFtp: 90 },
  { zone: 4, name: "Threshold", maxPctFtp: 105 },
  { zone: 5, name: "VO2max", maxPctFtp: 120 },
  { zone: 6, name: "Anaerobic", maxPctFtp: 150 },
  { zone: 7, name: "Neuromuscular", maxPctFtp: Infinity },
];

export function powerZoneFor(watts: number, ftp: number): PowerZone {
  const percentage = (watts / ftp) * 100;
  for (const zone of POWER_ZONES) {
    if (zone.maxPctFtp >= percentage) return zone;
  }
  throw new Error(`No power zone found for ${watts}W at FTP ${ftp}`);
}

export function timeInPowerZones(
  samples: RideSample[],
  ftp: number,
): ZoneTime[] {
  const zoneTimes: ZoneTime[] = POWER_ZONES.map((powerZone) => {
    return { zone: powerZone.zone, timeS: 0 };
  });

  for (const sample of samples) {
    if (sample.power === null) continue;
    const powerZone = powerZoneFor(sample.power, ftp);
    const matchingZone = zoneTimes.find(
      (element) => element.zone === powerZone.zone,
    );
    if (!matchingZone) continue;
    matchingZone.timeS = matchingZone.timeS + 1;
  }
  return zoneTimes;
}

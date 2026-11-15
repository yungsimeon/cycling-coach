import type { RideSample } from "../fit/types";

const MAX_VALID_SPEED_MPS = 36; // that's 130km/h, matches the DB constraint on rides.peak_speed_mps

export function averageSpeedKmh(
  distanceM: number | null,
  movingTimeS: number,
): number | null {
  if (distanceM === null || movingTimeS === 0) return null;
  return (distanceM / movingTimeS) * 3.6;
}

export function peakSpeedMps(samples: RideSample[]): number | null {
  const speeds: number[] = [];
  for (const sample of samples) {
    if (sample.speedMps === null || sample.speedMps > MAX_VALID_SPEED_MPS)
      continue;
    speeds.push(sample.speedMps);
  }
  if (speeds.length === 0) return null;
  return speeds.reduce((acc, currVal) => Math.max(acc, currVal));
}

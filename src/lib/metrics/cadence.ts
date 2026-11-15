import type { RideSample } from "../fit/types";

const MAX_VALID_CADENCE = 200; // matches DB constraint on rides.avg_cadence

export function averageCadence(samples: RideSample[]): number | null {
  const cadences: number[] = [];

  for (const sample of samples) {
    if (
      sample.cadence === null ||
      sample.cadence === 0 ||
      sample.cadence > MAX_VALID_CADENCE
    )
      continue;
    cadences.push(sample.cadence);
  }
  if (cadences.length === 0) return null;
  return Math.round(
    cadences.reduce((acc, currVal) => acc + currVal, 0) / cadences.length,
  );
}

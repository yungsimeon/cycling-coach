import type { RideSample } from "../fit/types";

const LTHR_FROM_MAX_HR = 0.9;
const MIN_VALID_HR = 40;
const MAX_VALID_HR = 230;

export type ThresholdHR = {
  bpm: number;
  estimated: boolean;
};

export function thresholdHr(
  lthr: number | null,
  maxHr: number | null,
): ThresholdHR | null {
  if (lthr !== null) return { bpm: lthr, estimated: false };
  if (maxHr !== null)
    return { bpm: Math.round(maxHr * LTHR_FROM_MAX_HR), estimated: true };
  return null;
}

export function averageHr(samples: RideSample[]): number | null {
  const heartRates = heartRateValues(samples);
  if (heartRates.length === 0) return null;

  return Math.round(
    heartRates.reduce((acc, currVal) => acc + currVal, 0) / heartRates.length,
  );
}

export function getPeakHr(samples: RideSample[]): number | null {
  const heartRates = heartRateValues(samples);
  if (heartRates.length === 0) return null;
  return heartRates.reduce((acc, currVal) => Math.max(acc, currVal));
}

export function heartRateTss(
  heartRates: number[],
  lthr: number,
): number | null {
  const values = heartRates.map((hr) => ((hr / lthr) ** 2 * 100) / 3600);
  if (values.length === 0) return null;
  return values.reduce((acc, currVal) => acc + currVal, 0);
}

export function heartRateValues(samples: RideSample[]): number[] {
  const heartRates: number[] = [];
  for (const sample of samples) {
    if (
      sample.heartRate === null ||
      sample.heartRate < MIN_VALID_HR ||
      sample.heartRate > MAX_VALID_HR
    )
      continue;
    heartRates.push(sample.heartRate);
  }
  return heartRates;
}

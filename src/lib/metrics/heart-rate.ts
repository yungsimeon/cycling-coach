const LTHR_FROM_MAX_HR = 0.9;

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

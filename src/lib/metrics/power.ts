import type { RideSample } from "../fit/types";

const NP_WINDOW_S = 30; // rolling window for NP. 30s is roughly how long the body takes to respond to a change in effort

export function averagePower(samples: RideSample[]): number | null {
  const powers = powerValues(samples);

  if (powers.length === 0) return null;
  const average =
    powers.reduce((acc, currentVal) => acc + currentVal, 0) / powers.length;
  return average;
}

export function normalizedPower(samples: RideSample[]): number | null {
  const powers = powerValues(samples);
  if (powers.length < NP_WINDOW_S) return null;
  const rollingAverages: number[] = [];
  for (let i = NP_WINDOW_S - 1; i < powers.length; i++) {
    const windowPowers = powers.slice(i - (NP_WINDOW_S - 1), i + 1);
    rollingAverages.push(
      windowPowers.reduce((acc, currVal) => acc + currVal, 0) / NP_WINDOW_S,
    );
  }
  const raisedAvg: number[] = rollingAverages.map((power) => {
    return power ** 4;
  });

  const avgRaisedAvg =
    raisedAvg.reduce((acc, currVal) => acc + currVal, 0) / raisedAvg.length;

  return avgRaisedAvg ** 0.25;
}

export function intensityFactor(np: number, ftp: number): number {
  return np / ftp;
}

export function trainingStressScore(
  durationS: number,
  np: number,
  ftp: number,
): number {
  return (durationS / 3600) * intensityFactor(np, ftp) ** 2 * 100;
}

function powerValues(samples: RideSample[]): number[] {
  const powers: number[] = [];
  for (const sample of samples) {
    if (sample.power === null) continue;
    powers.push(sample.power);
  }
  return powers;
}

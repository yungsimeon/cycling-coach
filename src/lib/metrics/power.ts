import type { RideSample } from "../fit/types";

export function averagePower(samples: RideSample[]): number | null {
  const powers: number[] = [];
  for (const sample of samples) {
    if (sample.power === null) continue;
    powers.push(sample.power);
  }

  if (powers.length === 0) return null;
  const average =
    powers.reduce((acc, currentVal) => acc + currentVal, 0) / powers.length;
  return average;
}

export function normalizedPower(samples: RideSample[]): number | null {
  const powers: number[] = [];
  for (const sample of samples) {
    if (sample.power === null) continue;
    powers.push(sample.power);
  }
  if (powers.length < 30) return null;
  const rollingAverages: number[] = [];
  for (let i = 29; i < powers.length; i++) {
    const windowPowers = powers.slice(i - 29, i + 1);
    rollingAverages.push(
      windowPowers.reduce((acc, currVal) => acc + currVal, 0) / 30,
    );
  }
  const raisedAvg: number[] = rollingAverages.map((power) => {
    return power ** 4;
  });

  const avgRaisedAvg =
    raisedAvg.reduce((acc, currVal) => acc + currVal, 0) / raisedAvg.length;

  return avgRaisedAvg ** 0.25;
}

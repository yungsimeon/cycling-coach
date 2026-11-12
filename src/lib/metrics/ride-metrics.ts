import { timeInPowerZones, type ZoneTime } from "./zones.ts";
import type { Ride } from "../fit/types";
import {
  averagePower,
  intensityFactor,
  normalizedPower,
  trainingStressScore,
} from "./power.ts";

export type RideMetrics = {
  avgPower: number | null;
  normalizedPower: number | null;
  tss: number | null;
  intensityFactor: number | null;
  timeInZones: ZoneTime[] | null;
};

export function calculateRideMetrics(
  ride: Ride,
  ftp: number | null,
): RideMetrics {
  const avgPower = averagePower(ride.samples);
  const powerNormalized = normalizedPower(ride.samples);
  const ifValue =
    ftp !== null && powerNormalized !== null
      ? intensityFactor(powerNormalized, ftp)
      : null;
  const tss =
    powerNormalized !== null && ftp !== null
      ? trainingStressScore(ride.movingTimeS, powerNormalized, ftp)
      : null;
  const timeInZones =
    ftp !== null && avgPower !== null
      ? timeInPowerZones(ride.samples, ftp)
      : null;

  return {
    avgPower,
    normalizedPower: powerNormalized,
    tss,
    intensityFactor: ifValue,
    timeInZones,
  };
}

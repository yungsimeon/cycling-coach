import { timePerZone, type ZoneTime, POWER_ZONES, HR_ZONES } from "./zones.ts";
import type { Ride } from "../fit/types";
import {
  powerValues,
  averagePower,
  getPeakPower,
  intensityFactor,
  normalizedPower,
  trainingStressScore,
} from "./power.ts";
import { averageHr, getPeakHr, heartRateValues } from "./heart-rate.ts";
import { getPeakSpeedMps } from "./speed.ts";
import { averageCadence } from "./cadence.ts";

const MIN_VALID_AVG_HR = 50; // matching our DB constraints on rides.avg_hr
const MAX_VALID_AVG_HR = 210;

export type RideMetrics = {
  avgPower: number | null;
  normalizedPower: number | null;
  avgHr: number | null;
  peakHr: number | null;
  peakPower: number | null;
  peakSpeedMps: number | null;
  avgCadence: number | null;
  tss: number | null;
  intensityFactor: number | null;
  timeInPowerZones: ZoneTime[] | null;
  timeInHrZones: ZoneTime[] | null;
};

export function calculateRideMetrics(
  ride: Ride,
  ftp: number | null,
  lthr: number | null,
): RideMetrics {
  const powers = powerValues(ride.samples);
  const heartRates = heartRateValues(ride.samples);

  const avgPower = averagePower(ride.samples);
  const powerNormalized = normalizedPower(ride.samples);
  const avgHr = averageHr(ride.samples);
  const peakHr = getPeakHr(ride.samples);
  const peakPower = getPeakPower(ride.samples);
  const peakSpeedMps = getPeakSpeedMps(ride.samples);
  const avgCadence = averageCadence(ride.samples);

  const hrTrustworthy =
    avgHr !== null && avgHr <= MAX_VALID_AVG_HR && avgHr >= MIN_VALID_AVG_HR;

  const ifValue =
    ftp !== null && powerNormalized !== null
      ? intensityFactor(powerNormalized, ftp)
      : null;
  const tss =
    powerNormalized !== null && ftp !== null
      ? trainingStressScore(ride.movingTimeS, powerNormalized, ftp)
      : null;
  const timeInPowerZones =
    ftp !== null && powers.length > 0
      ? timePerZone(powers, ftp, POWER_ZONES)
      : null;

  const timeInHrZones =
    lthr !== null && heartRates.length > 0
      ? timePerZone(heartRates, lthr, HR_ZONES)
      : null;

  return {
    avgPower,
    normalizedPower: powerNormalized,
    peakPower,
    avgHr: hrTrustworthy ? avgHr : null,
    peakHr: hrTrustworthy ? peakHr : null, // if avgHr isn't trustworthy device might be broken, hence we shouldn't trust its peak value either
    peakSpeedMps,
    avgCadence,
    tss,
    intensityFactor: ifValue,
    timeInPowerZones,
    timeInHrZones: hrTrustworthy ? timeInHrZones : null,
  };
}

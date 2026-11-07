export type RideSample = {
  timestamp: Date;
  power: number | null;
  heartRate: number | null;
  cadence: number | null;
  speedMps: number | null;
  distanceM: number | null;
  altitudeM: number | null;
  latitude: number | null; // degrees (WGS84)
  longitude: number | null; // degrees (WGS84)
};

export type RideLap = {
  start: Date;
  movingTimeS: number;
  totalTimeS: number;
  distanceM: number | null;
};

export type Ride = {
  start: Date;
  sport: string;
  movingTimeS: number;
  totalTimeS: number;
  distanceM: number | null;
  elevationGainM: number | null;
  samples: RideSample[];
  laps: RideLap[];
};

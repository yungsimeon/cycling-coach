import type { Ride, RideSample, RideLap } from "./types";
import { Stream, Decoder } from "@garmin/fitsdk";
import type { ActivityMesg } from "@garmin/fitsdk";

const FIT_EPOCH_OFFSET_S = 631065600; // Seconds between the Unix epoch (1 Jan 1970) and
// the FIT epoch (31 Dec 1989)

export function parseFit(bytes: Uint8Array): Ride {
  const stream = Stream.fromByteArray(Array.from(bytes));
  const decoder = new Decoder(stream);

  if (!decoder.isFIT()) throw new Error("Not a FIT file");
  if (!decoder.checkIntegrity()) throw new Error("FIT file corrupted.");
  const { errors, messages } = decoder.read();
  if (errors.length > 0)
    throw new Error("Could not decode FIT file", { cause: errors[0] });
  if (!messages.recordMesgs?.length)
    throw new Error("FIT file contains no ride data");
  if (!messages.sessionMesgs?.length)
    throw new Error("FIT file contains no session summary");
  const session = messages.sessionMesgs[0];
  if (!(session.startTime instanceof Date))
    throw new Error("FIT file has no start time");
  if (session.totalTimerTime === undefined)
    throw new Error("FIT file has no moving time");
  if (session.totalElapsedTime === undefined)
    throw new Error("FIT file has no elapsed time");

  const samples: RideSample[] = [];
  for (const record of messages.recordMesgs) {
    if (!(record.timestamp instanceof Date)) continue;
    samples.push({
      timestamp: record.timestamp,
      power: record.power ?? null,
      heartRate: record.heartRate ?? null,
      cadence: record.cadence ?? null,
      speedMps: record.enhancedSpeed ?? record.speed ?? null,
      distanceM: record.distance ?? null,
      altitudeM: record.enhancedAltitude ?? record.altitude ?? null,
      latitude: semicirclesToDegrees(record.positionLat),
      longitude: semicirclesToDegrees(record.positionLong),
    });
  }

  const laps: RideLap[] = [];
  for (const lap of messages?.lapMesgs ?? []) {
    if (
      !(lap.startTime instanceof Date) ||
      typeof lap.totalTimerTime !== "number" ||
      typeof lap.totalElapsedTime !== "number"
    )
      continue;
    laps.push({
      start: lap.startTime,
      movingTimeS: lap.totalTimerTime,
      totalTimeS: lap.totalElapsedTime,
      distanceM: lap.totalDistance ?? null,
    });
  }

  const ride: Ride = {
    start: session.startTime,
    sport: typeof session.sport === "string" ? session.sport : "unknown",
    movingTimeS: session.totalTimerTime,
    totalTimeS: session.totalElapsedTime,
    distanceM: session.totalDistance ?? null,
    elevationGainM: session.totalAscent ?? null,
    samples: samples,
    laps: laps,
    utcOffsetMin: utcOffsetMinutes(messages.activityMesgs?.[0]),
  };
  return ride;
}

function semicirclesToDegrees(semicircles: number | undefined): number | null {
  if (semicircles === undefined) return null;
  return semicircles * (180 / 2 ** 31);
}

function utcOffsetMinutes(activity: ActivityMesg | undefined): number | null {
  if (
    !(activity?.timestamp instanceof Date) ||
    typeof activity?.localTimestamp !== "number"
  )
    return null;
  const fitTimestamp = activity.localTimestamp; // gives seconds since 31 dec 1989, so we'll need to add our OFFSET to it.
  const localTimestamp = fitTimestamp + FIT_EPOCH_OFFSET_S;
  const utcTimestamp = activity.timestamp.getTime() / 1000;
  return (localTimestamp - utcTimestamp) / 60;
}

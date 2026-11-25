"use server";

import { parseFit } from "@/lib/fit/parse";
import type { Ride } from "@/lib/fit/types";
import { thresholdHr } from "@/lib/metrics/heart-rate";
import { calculateRideMetrics } from "@/lib/metrics/ride-metrics";
import { updateRideSchema } from "@/lib/rides/schema";
import { createClient } from "@/lib/supabase/server";
import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type UploadRideResult =
  | { ok: true; startedAt: string }
  | { ok: false; error: string };

export type UpdateRideResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: { name?: string[]; description?: string[] };
      message?: string;
    }
  | undefined;

const UNIQUE_VIOLATION = "23505"; // Postgres error code: unique constraint violated

export async function uploadRide(
  formData: FormData,
): Promise<UploadRideResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) console.error(userError);
  if (!user || userError) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("ftp, lthr, max_hr")
    .eq("id", user.id)
    .single();
  if (profileError) {
    console.error(profileError);
    return { ok: false, error: "Something went wrong, please try again." };
  }
  const ftp = profile.ftp;
  const lthr = profile.lthr;
  const maxHr = profile.max_hr;

  const threshold = thresholdHr(lthr, maxHr);

  const file = formData.get("file");
  if (!(file instanceof File))
    return { ok: false, error: "Input is not a file." };
  if (file.size === 0) return { ok: false, error: "Please choose a FIT file." };
  const fileContent = new Uint8Array(await file.arrayBuffer());
  let ride: Ride;
  try {
    ride = parseFit(fileContent);
  } catch (error) {
    console.error(error);
    return { ok: false, error: "This doesn't look like a valid FIT file." };
  }

  const rideMetrics = calculateRideMetrics(ride, ftp, threshold?.bpm ?? null);

  const path = `${user.id}/${crypto.randomUUID()}.fit`;
  const { error: uploadError } = await supabase.storage
    .from("fit-files")
    .upload(path, file);
  if (uploadError) {
    console.error(uploadError);
    return { ok: false, error: "Couldn't upload your file. Please try again." };
  }

  const { error: insertError } = await supabase.from("rides").insert({
    user_id: user.id,
    started_at: ride.start.toISOString(),
    sport: ride.sport,
    moving_time_s: Math.round(ride.movingTimeS),
    total_time_s: Math.round(ride.totalTimeS),
    distance_m: roundOrNull(ride.distanceM),
    elevation_gain_m: ride.elevationGainM,
    avg_power: roundOrNull(rideMetrics.avgPower),
    normalized_power: roundOrNull(rideMetrics.normalizedPower),
    ftp: ftp,
    lthr: threshold?.bpm ?? null,
    lthr_estimated: threshold?.estimated ?? null,
    avg_hr: rideMetrics.avgHr,
    peak_hr: rideMetrics.peakHr,
    peak_power: rideMetrics.peakPower,
    peak_speed_mps: rideMetrics.peakSpeedMps,
    avg_cadence: rideMetrics.avgCadence,
    intensity_factor: rideMetrics.intensityFactor,
    tss: rideMetrics.tss,
    hr_tss: rideMetrics.hrTss,
    time_in_zones: rideMetrics.timeInPowerZones,
    time_in_hr_zones: rideMetrics.timeInHrZones,
    fit_file_path: path,
    utc_offset_min: ride.utcOffsetMin,
  });
  if (insertError) {
    console.error(insertError);
    const { error: removeError } = await supabase.storage
      .from("fit-files")
      .remove([path]);
    if (removeError) {
      console.error("Couldn't remove orphaned file", path, removeError);
    }
    if (insertError.code === UNIQUE_VIOLATION)
      return { ok: false, error: "This ride already exists." };
    return { ok: false, error: "Couldn't save your ride. Please try again." };
  }
  revalidatePath("/rides");
  return {
    ok: true,
    startedAt: ride.start.toISOString(),
  };
}

export async function updateRide(
  prevState: UpdateRideResult,
  formData: FormData,
): Promise<UpdateRideResult> {
  const result = updateRideSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    if (fieldErrors.id) return { message: "Ride not found", ok: false };
    return { fieldErrors: fieldErrors, ok: false };
  }
  const { id, name, description } = result.data;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { message: "Please log in again", ok: false };

  const { data, error } = await supabase
    .from("rides")
    .update({ name, description })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error(error);
    return {
      message: "Couldn't update ride. Please try again.",
      ok: false,
    };
  }
  if (data?.length === 0)
    return {
      message: "Ride not found",
      ok: false,
    };
  refresh();
  return { ok: true };
}

function roundOrNull(value: number | null): number | null {
  if (value === null) return null;
  return Math.round(value);
}

"use server";

import { parseFit } from "@/lib/fit/parse";
import type { Ride } from "@/lib/fit/types";
import { calculateRideMetrics } from "@/lib/metrics/ride-metrics";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type UploadRideState = { error: string } | undefined;

export async function uploadRide(
  prevState: UploadRideState,
  formData: FormData,
): Promise<UploadRideState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) console.error(userError);
  if (!user || userError) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("ftp")
    .eq("id", user.id)
    .single();
  if (profileError) {
    console.error(profileError);
    return { error: "Something went wrong, please try again." };
  }
  const ftp = profile.ftp;

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Input is not a file.");
  if (file.size === 0) return { error: "Please choose a FIT file." };
  const fileContent = new Uint8Array(await file.arrayBuffer());
  let ride: Ride;
  try {
    ride = parseFit(fileContent);
  } catch (error) {
    console.error(error);
    return { error: "This doesn't look like a valid FIT file." };
  }

  const rideMetrics = calculateRideMetrics(ride, ftp);

  const path = `${user.id}/${crypto.randomUUID()}.fit`;
  const { error: uploadError } = await supabase.storage
    .from("fit-files")
    .upload(path, file);
  if (uploadError) {
    console.error(uploadError);
    return { error: "Couldn't upload your file. Please try again." };
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
    intensity_factor: rideMetrics.intensityFactor,
    tss: rideMetrics.tss,
    time_in_zones: rideMetrics.timeInZones,
    fit_file_path: path,
  });
  if (insertError) {
    console.error(insertError);
    const { error: removeError } = await supabase.storage
      .from("fit-files")
      .remove([path]);
    if (removeError) {
      console.error("Couldn't remove orphaned file", path, removeError);
    }
    return { error: "Couldn't save your ride. Please try again." };
  }
  revalidatePath("/rides");
  redirect("/rides");
}

function roundOrNull(value: number | null): number | null {
  if (value === null) return null;
  return Math.round(value);
}

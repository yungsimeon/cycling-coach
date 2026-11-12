"use server";

import { parseFit } from "@/lib/fit/parse";
import { calculateRideMetrics } from "@/lib/metrics/ride-metrics";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function uploadRide(formData: FormData): Promise<void> {
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
    throw new Error("Error loading profile", { cause: profileError });
  }
  const ftp = profile.ftp;

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Input is not a file.");
  if (file.size === 0) return;
  const fileContent = new Uint8Array(await file.arrayBuffer());
  const ride = parseFit(fileContent);

  const rideMetrics = calculateRideMetrics(ride, ftp);

  const path = `${user.id}/${crypto.randomUUID()}.fit`;
  const { error: uploadError } = await supabase.storage
    .from("fit-files")
    .upload(path, file);
  if (uploadError)
    throw new Error("Couldn't upload file", { cause: uploadError });

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
    const { error: removeError } = await supabase.storage
      .from("fit-files")
      .remove([path]);
    if (removeError)
      console.error("Couldn't remove orphaned file", path, removeError);

    throw new Error("Couldn't save ride", { cause: insertError });
  }
}

function roundOrNull(value: number | null): number | null {
  if (value === null) return null;
  return Math.round(value);
}

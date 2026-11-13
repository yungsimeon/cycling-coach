import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
  formatSpeed,
  formatTss,
} from "@/lib/format/units";
import { averageSpeedKmh } from "@/lib/metrics/speed";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

export default function RidePage() {
  return (
    <div>
      <h1>Rides</h1>
      <Suspense fallback={"Loading rides..."}>
        <RideList />
      </Suspense>
    </div>
  );
}

async function RideList() {
  await connection();
  const supabase = await createClient();
  const { data: rides, error } = await supabase
    .from("rides")
    .select("id, started_at, distance_m, moving_time_s, elevation_gain_m, tss")
    .order("started_at", { ascending: false });
  if (error) {
    console.error(error);
    return <p>Couldn&apos;t load rides.</p>;
  }
  if (rides.length === 0)
    return (
      <div>
        <p>No rides yet.</p>
        <Link href="/rides/upload">Upload a ride</Link>
      </div>
    );

  return (
    <div>
      {rides.map((ride) => {
        return (
          <div key={ride.id}>
            <p>{formatDate(ride.started_at)}</p>
            <p>{formatDistance(ride.distance_m)}</p>
            <p>{formatDuration(ride.moving_time_s)}</p>
            <p>
              {formatSpeed(
                averageSpeedKmh(ride.distance_m, ride.moving_time_s),
              )}
            </p>
            <p>{formatElevation(ride.elevation_gain_m)}</p>
            {ride.tss !== null && <p>TSS {formatTss(ride.tss)}</p>}
          </div>
        );
      })}
    </div>
  );
}

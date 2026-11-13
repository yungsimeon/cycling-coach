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
import { buttonPrimary, card, page, pageTitle } from "@/components/ui/styles";

// TSS at which the little bar is full. Purely visual: ~300 is a very hard day.
const TSS_BAR_MAX = 300;

export default function RidePage() {
  return (
    <main className={page}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={pageTitle}>Rides</h1>
        <Link href="/rides/upload" className={buttonPrimary}>
          Upload ride
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="rounded-card border border-line bg-surface p-5 text-sm text-muted">
            Loading rides...
          </div>
        }
      >
        <RideList />
      </Suspense>
    </main>
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
    return (
      <div className="rounded-card border border-line bg-surface p-5 text-sm text-danger">
        Couldn&apos;t load rides.
      </div>
    );
  }
  if (rides.length === 0)
    return (
      <div className="rounded-card border border-line bg-surface p-10 text-center">
        <p className="text-base font-semibold">No rides yet.</p>
        <p className="mt-1 text-sm text-muted">
          Upload a .FIT file from your bike computer to get started.
        </p>
        <Link href="/rides/upload" className={`${buttonPrimary} mt-5`}>
          Upload a ride
        </Link>
      </div>
    );

  return (
    <div className={card}>
      <p className="mb-2 px-3 text-2xs font-medium uppercase tracking-wider text-muted">
        Recent rides
      </p>
      <ul>
        {rides.map((ride) => {
          return (
            <li
              key={ride.id}
              className="border-b border-line-subtle last:border-b-0"
            >
              <Link
                href={`/rides/${ride.id}`}
                className="flex items-center gap-4 rounded-row px-3 py-3 hover:bg-surface-hover"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {formatDate(ride.started_at)}
                  </p>
                  <p className="mt-0.5 flex flex-wrap gap-x-1.5 text-xs tabular-nums text-muted">
                    <span className="whitespace-nowrap">
                      {formatDistance(ride.distance_m)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">
                      {formatDuration(ride.moving_time_s)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">
                      {formatSpeed(
                        averageSpeedKmh(ride.distance_m, ride.moving_time_s),
                      )}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">
                      {formatElevation(ride.elevation_gain_m)}
                    </span>
                  </p>
                </div>
                <div className="w-24 shrink-0">
                  {ride.tss !== null ? (
                    <>
                      <p className="text-right text-sm font-bold tabular-nums">
                        {formatTss(ride.tss)}{" "}
                        <span className="text-2xs font-medium text-muted">
                          TSS
                        </span>
                      </p>
                      <div className="mt-1.5 h-1 rounded-full bg-line">
                        <div
                          className="h-1 rounded-full bg-accent"
                          style={{
                            width: `${Math.min(100, (ride.tss / TSS_BAR_MAX) * 100)}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-right text-xs text-muted">no power</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

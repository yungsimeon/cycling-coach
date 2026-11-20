import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
  formatSpeed,
  formatTss,
} from "@/lib/format/units";
import { averageSpeedKmh, mpsToKmh } from "@/lib/metrics/speed";
import {
  HR_ZONES,
  POWER_ZONES,
  type Zone,
  type ZoneTime,
} from "@/lib/metrics/zones";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  card,
  errorText,
  label,
  page,
  pageTitle,
} from "@/components/ui/styles";

export default function RideDetailPage({ params }: PageProps<"/rides/[id]">) {
  return (
    <main className={page}>
      <Link href="/rides" className="text-sm text-muted hover:text-fg">
        ← Rides
      </Link>
      <Suspense
        fallback={
          <div className={`${card} mt-6 text-sm text-muted`}>
            Loading ride...
          </div>
        }
      >
        <RideDetails params={params} />
      </Suspense>
    </main>
  );
}

async function RideDetails({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();
  const { data: ride, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error(error);
    return (
      <div className={`${card} mt-6 ${errorText}`}>
        Couldn&apos;t load ride.
      </div>
    );
  }
  if (ride === null) notFound();
  const powerZones = ride.time_in_zones as ZoneTime[] | null;
  const hrZones = ride.time_in_hr_zones as ZoneTime[] | null;

  return (
    <div className="mt-2 flex flex-col gap-6">
      <div>
        <h1 className={pageTitle}>{formatDate(ride.started_at)}</h1>
        <p className="mt-1 text-sm capitalize text-muted">{ride.sport}</p>
      </div>

      <Section title="Overview">
        <Stat label="Distance" value={formatDistance(ride.distance_m)} />
        <Stat label="Moving time" value={formatDuration(ride.moving_time_s)} />
        <Stat label="Elapsed time" value={formatDuration(ride.total_time_s)} />
        <Stat
          label="Avg speed"
          value={formatSpeed(
            averageSpeedKmh(ride.distance_m, ride.moving_time_s),
          )}
        />
        {ride.peak_speed_mps !== null && (
          <Stat
            label="Max speed"
            value={formatSpeed(mpsToKmh(ride.peak_speed_mps))}
          />
        )}
        <Stat
          label="Elevation"
          value={formatElevation(ride.elevation_gain_m)}
        />
      </Section>

      {ride.avg_power !== null && (
        <Section title="Power">
          <Stat label="Avg power" value={`${ride.avg_power} W`} />
          {ride.normalized_power !== null && (
            <Stat
              label="Normalized power"
              value={`${ride.normalized_power} W`}
            />
          )}
          {ride.peak_power !== null && (
            <Stat label="Max power" value={`${ride.peak_power} W`} />
          )}
          {ride.intensity_factor !== null && (
            <Stat
              label="Intensity factor"
              value={ride.intensity_factor.toFixed(2)}
            />
          )}
          {ride.tss !== null && (
            <Stat
              label="Training stress"
              value={`${formatTss(ride.tss)} TSS`}
            />
          )}
        </Section>
      )}

      {(ride.avg_hr !== null || ride.avg_cadence !== null) && (
        <Section title="Heart rate & cadence">
          {ride.avg_hr !== null && (
            <Stat label="Avg heart rate" value={`${ride.avg_hr} bpm`} />
          )}
          {ride.peak_hr !== null && (
            <Stat label="Max heart rate" value={`${ride.peak_hr} bpm`} />
          )}
          {ride.hr_tss !== null && (
            <Stat
              label="Training stress (HR)"
              value={`${formatTss(ride.hr_tss)} hrTSS`}
            />
          )}
          {ride.avg_cadence !== null && (
            <Stat label="Avg cadence" value={`${ride.avg_cadence} rpm`} />
          )}
        </Section>
      )}

      {powerZones && (
        <ZoneCard
          title="Time in power zones"
          note={ride.ftp !== null ? `at FTP ${ride.ftp} W` : null}
          zoneTimes={powerZones}
          zoneTable={POWER_ZONES}
          barClass="bg-accent"
        />
      )}

      {hrZones && (
        <ZoneCard
          title="Time in heart rate zones"
          note={
            ride.lthr !== null
              ? `at LTHR ${ride.lthr} bpm${ride.lthr_estimated ? " (estimated)" : ""}`
              : null
          }
          zoneTimes={hrZones}
          zoneTable={HR_ZONES}
          barClass="bg-heart"
        />
      )}
    </div>
  );
}

// One card for both power and HR zones: the zone table supplies the names.
function ZoneCard({
  title,
  note,
  zoneTimes,
  zoneTable,
  barClass,
}: {
  title: string;
  note: string | null;
  zoneTimes: ZoneTime[];
  zoneTable: Zone[];
  barClass: string;
}) {
  return (
    <div className={card}>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className={label}>{title}</p>
        {note && <p className="text-xs text-muted">{note}</p>}
      </div>
      <ul className="flex flex-col gap-3">
        {zoneTimes.map((zoneTime) => {
          const matchingZone = zoneTable.find(
            (element) => element.zone === zoneTime.zone,
          );
          return (
            <li key={zoneTime.zone} className="flex items-center gap-3">
              <span className="w-8 shrink-0 text-xs font-semibold tabular-nums text-muted">
                Z{zoneTime.zone}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm">
                    {matchingZone && matchingZone.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {formatDuration(zoneTime.timeS)}
                  </span>
                </div>
                <ZoneBar
                  timeS={zoneTime.timeS}
                  zones={zoneTimes}
                  barClass={barClass}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className={`${label} mb-2`}>{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
    </section>
  );
}

function Stat({ label: statLabel, value }: { label: string; value: string }) {
  return (
    <div className={card}>
      <p className={label}>{statLabel}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

// Visual only: bar width relative to the longest zone, so the biggest zone fills the row.
function ZoneBar({
  timeS,
  zones,
  barClass,
}: {
  timeS: number;
  zones: ZoneTime[];
  barClass: string;
}) {
  const longest = Math.max(...zones.map((z) => z.timeS));
  const width = longest > 0 ? (timeS / longest) * 100 : 0;
  return (
    <div className="mt-1.5 h-1.5 rounded-full bg-line">
      <div
        className={`h-1.5 rounded-full ${barClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

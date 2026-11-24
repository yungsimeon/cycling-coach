import { createClient } from "@/lib/supabase/server";
import {
  fitnessTimeline,
  localDay,
  type RideTrainingLoad,
} from "@/lib/metrics/fitness";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import {
  buttonPrimary,
  card,
  label,
  page,
  pageTitle,
} from "@/components/ui/styles";
import FitnessChart from "@/components/fitness-chart";
import { formatDay, formatSigned } from "@/lib/format/units";

const CHART_DAYS = 90;

export default function Dashboard() {
  return (
    <main className={page}>
      <h1 className={`${pageTitle} mb-6`}>Dashboard</h1>
      <section className="mb-6">
        <h2 className={`${label} mb-2`}>Your fitness</h2>
        <Suspense fallback={<FitnessSkeleton />}>
          <Fitness />
        </Suspense>
      </section>
      <div className={`${card} flex flex-col gap-1`}>
        <p className="text-2xs font-medium uppercase tracking-wider text-muted">
          Signed in as
        </p>
        <Suspense fallback={<p className="text-sm text-muted">Loading...</p>}>
          <UserEmail />
        </Suspense>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link href="/rides" className={`${card} hover:bg-surface-hover`}>
          <p className="text-sm font-semibold">Rides</p>
          <p className="mt-0.5 text-xs text-muted">Your uploaded rides</p>
        </Link>
        <Link href="/profile" className={`${card} hover:bg-surface-hover`}>
          <p className="text-sm font-semibold">Profile</p>
          <p className="mt-0.5 text-xs text-muted">FTP and heart rate</p>
        </Link>
      </div>
    </main>
  );
}

async function UserEmail() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");
  return <p className="text-sm font-semibold">{user.email}</p>;
}

async function Fitness() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rides")
    .select("started_at, utc_offset_min, tss, hr_tss");
  if (error) {
    console.error(error);
    return <p>Couldn&apos;t load fitness.</p>;
  }
  const rides: RideTrainingLoad[] = data.map((ride) => ({
    start: new Date(ride.started_at),
    utcOffsetMin: ride.utc_offset_min,
    tss: ride.tss,
    hrTss: ride.hr_tss,
  }));
  const endDay = localDay(new Date(), null);
  const fitness = fitnessTimeline(rides, endDay);

  if (fitness.length === 0) {
    return (
      <div className={`${card} flex flex-col items-start gap-3`}>
        <div>
          <p className="text-sm font-semibold">No fitness data yet</p>
          <p className="mt-1 text-sm text-muted">
            Upload your first ride to see your fitness, fatigue and form.
          </p>
        </div>
        <Link href="/rides/upload" className={buttonPrimary}>
          Upload a ride
        </Link>
      </div>
    );
  }

  // The curve is calculated from all rides; the chart shows the recent part.
  const recent = fitness.slice(-CHART_DAYS);
  const today = fitness[fitness.length - 1];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <FitnessStat
          title="Fitness"
          value={Math.round(today.ctl).toString()}
          hint="Long-term load (CTL, 42 days)"
          color="bg-fitness"
        />
        <FitnessStat
          title="Fatigue"
          value={Math.round(today.atl).toString()}
          hint="Short-term load (ATL, 7 days)"
          color="bg-fatigue"
        />
        <FitnessStat
          title="Form"
          value={formatSigned(today.tsb)}
          hint="Fitness − fatigue (TSB). Positive = fresh"
          color="bg-form"
        />
      </div>

      <div className={card}>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <p className={label}>Fitness over time</p>
          <p className="text-xs text-muted">
            {recent.length < CHART_DAYS
              ? `Since ${formatDay(recent[0].date)}`
              : `Last ${CHART_DAYS} days`}
          </p>
        </div>
        <FitnessChart days={recent} />

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-xs text-muted hover:text-fg">
            Show as table
          </summary>
          <div className="mt-3 max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="sticky top-0 bg-surface text-muted">
                <tr>
                  <th className="py-1.5 font-medium">Day</th>
                  <th className="py-1.5 text-right font-medium">Fitness</th>
                  <th className="py-1.5 text-right font-medium">Fatigue</th>
                  <th className="py-1.5 text-right font-medium">Form</th>
                </tr>
              </thead>
              <tbody>
                {[...recent].reverse().map((day) => (
                  <tr key={day.date} className="border-t border-line-subtle">
                    <td className="py-1.5">{formatDay(day.date)}</td>
                    <td className="py-1.5 text-right">{Math.round(day.ctl)}</td>
                    <td className="py-1.5 text-right">{Math.round(day.atl)}</td>
                    <td className="py-1.5 text-right">
                      {formatSigned(day.tsb)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}

function FitnessStat({
  title,
  value,
  hint,
  color,
}: {
  title: string;
  value: string;
  hint: string;
  color: string;
}) {
  return (
    <div className={card}>
      <p className={`${label} flex items-center gap-1.5`}>
        <span className={`h-0.5 w-3 rounded-full ${color}`} />
        {title}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 hidden text-xs text-muted sm:block">{hint}</p>
    </div>
  );
}

function FitnessSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${card} h-24 animate-pulse`} />
        ))}
      </div>
      <div className={`${card} h-80 animate-pulse`} />
    </div>
  );
}

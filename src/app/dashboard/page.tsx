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
import { card, page, pageTitle } from "@/components/ui/styles";

export default function Dashboard() {
  return (
    <main className={page}>
      <h1 className={`${pageTitle} mb-6`}>Dashboard</h1>
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
      <Suspense fallback={"Loading ..."}>
        <Fitness />
      </Suspense>
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

  return (
    <div>
      {fitness.length !== 0 ? (
        fitness.map((fitnessDay) => {
          return (
            <div key={fitnessDay.date}>
              <p>{fitnessDay.date}</p>
              <p>{fitnessDay.atl}</p>
              <p>{fitnessDay.ctl}</p>
              <p>{fitnessDay.tsb}</p>
            </div>
          );
        })
      ) : (
        <p>No fitness data found.</p>
      )}
    </div>
  );
}

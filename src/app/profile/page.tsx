import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import ProfileForm from "./profile-form";
import { card, errorText, page, pageTitle } from "@/components/ui/styles";

export default function ProfilePage() {
  return (
    <main className={page}>
      <h1 className={`${pageTitle} mb-6`}>Profile</h1>
      <Suspense
        fallback={
          <div className={`${card} text-sm text-muted`}>
            Loading profile...
          </div>
        }
      >
        <ProfileDetails />
      </Suspense>
    </main>
  );
}

async function ProfileDetails() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").single();
  if (error) console.error(error);
  if (!data)
    return <div className={`${card} ${errorText}`}>Couldn&apos;t load profile</div>;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="FTP" value={data.ftp !== null ? `${data.ftp} W` : "Not set"} />
        <Stat
          label="Max Heart Rate"
          value={data.max_hr !== null ? `${data.max_hr} bpm` : "Not set"}
        />
      </div>
      <ProfileForm ftp={data.ftp} maxHr={data.max_hr} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={card}>
      <p className="text-2xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

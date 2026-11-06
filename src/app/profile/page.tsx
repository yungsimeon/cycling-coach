import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import ProfileForm from "./profile-form";

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <Suspense fallback={<p>Loading profile...</p>}>
        <ProfileDetails />
      </Suspense>
    </div>
  );
}

async function ProfileDetails() {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").single();
  if (error) console.error(error);
  if (!data) return <p>Couldn&apos;t load profile</p>;
  return (
    <div>
      <ProfileForm ftp={data.ftp} maxHr={data.max_hr} />
      <p>FTP: {data.ftp ?? "Not set"}</p>
      <p>Max Heart Rate: {data.max_hr ?? "Not set"}</p>
    </div>
  );
}

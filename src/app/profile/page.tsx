import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";

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
      <p>FTP: {data.ftp ?? "Not set"}</p>
      <p>Max Heart Rate: {data.max_hr ?? "Not set"}</p>
    </div>
  );
}

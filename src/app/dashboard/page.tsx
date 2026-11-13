import { createClient } from "@/lib/supabase/server";
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

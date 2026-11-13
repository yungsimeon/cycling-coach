import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import NavLink from "./nav-link";

// Top bar shown on every page (rendered in the root layout).
// Sticky, translucent, hairline border at the bottom.
export default function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line-subtle bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Suspense fallback={<Logo href="/" />}>
          <NavContent />
        </Suspense>
      </div>
    </header>
  );
}

// Reads the session, so it shows different links for logged-in and logged-out visitors.
async function NavContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Logo href="/" />
        <nav className="flex items-center gap-0.5 sm:gap-1">
          <NavLink href="/login">Log in</NavLink>
          <Link
            href="/signup"
            className="ml-2 rounded-full bg-fg px-2 py-1.5 text-sm font-medium text-canvas hover:opacity-90"
          >
            Sign up
          </Link>
        </nav>
      </>
    );
  }

  return (
    <>
      <Logo href="/dashboard" />
      <nav className="flex items-center gap-0.5 sm:gap-1">
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/rides">Rides</NavLink>
        <NavLink href="/profile">Profile</NavLink>
        <span className="mx-1 h-4 w-px bg-line sm:mx-2" aria-hidden="true" />
        <form action={signOut}>
          <button
            type="submit"
            className="whitespace-nowrap rounded-full px-2 py-1.5 text-sm text-muted hover:text-fg sm:px-3"
          >
            Sign out
          </button>
        </form>
      </nav>
    </>
  );
}

function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-accent"
        />
        <circle cx="12" cy="12" r="3" className="fill-accent" />
      </svg>
      <span className="hidden text-base font-semibold tracking-tight sm:inline">
        Cycling Coach
      </span>
    </Link>
  );
}

import Link from "next/link";
import { buttonPrimary, buttonSecondary } from "@/components/ui/styles";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-20 sm:px-6">
      <p className="text-2xs font-medium uppercase tracking-wider text-muted">
        Cycling Coach
      </p>
      <h1 className="mt-3 max-w-xl text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
        Train smarter, <span className="text-accent">ride stronger</span>.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted">
        Upload your rides, see what they did for your fitness, and get workouts
        that fit your goals.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/signup" className={buttonPrimary}>
          Create account
        </Link>
        <Link href="/login" className={buttonSecondary}>
          Log in
        </Link>
      </div>
    </main>
  );
}

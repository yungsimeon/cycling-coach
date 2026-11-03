"use client";

import { useActionState } from "react";
import { signIn } from "@/app/auth/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          placeholder="********"
          required
        />
        <button type="submit" disabled={pending}>
          {pending ? "Logging In..." : "Log In"}
        </button>
      </form>

      {state?.error && (
        <p className="text-red-500" role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}

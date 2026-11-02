"use client";

import { useActionState } from "react";
import { signUp } from "@/app/auth/actions";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          id="email"
          autoComplete="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          id="password"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <button type="submit" disabled={pending}>
          {pending ? "Signing Up..." : "Sign Up"}
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

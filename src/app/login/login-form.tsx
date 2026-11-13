"use client";

import { useActionState } from "react";
import { signIn } from "@/app/auth/actions";
import { buttonPrimary, errorText, input, label } from "@/components/ui/styles";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className={input}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={label}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            placeholder="********"
            required
            className={input}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimary} py-2.5`}
        >
          {pending ? "Logging In..." : "Log In"}
        </button>
      </form>

      {state?.error && (
        <p className={`${errorText} mt-3`} role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}

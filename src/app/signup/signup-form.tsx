"use client";

import { useActionState } from "react";
import { signUp } from "@/app/auth/actions";
import { buttonPrimary, errorText, input, label } from "@/components/ui/styles";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

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
            placeholder="you@example.com"
            id="email"
            autoComplete="email"
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
            placeholder="********"
            id="password"
            autoComplete="new-password"
            minLength={6}
            required
            className={input}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimary} py-2.5`}
        >
          {pending ? "Signing Up..." : "Sign Up"}
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

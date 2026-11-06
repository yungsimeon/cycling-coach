"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";

type ProfileFormProps = {
  ftp: number | null;
  maxHr: number | null;
};

export default function ProfileForm({ ftp, maxHr }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="ftp">FTP</label>
        <input
          type="number"
          name="ftp"
          id="ftp"
          placeholder="300"
          min={50}
          max={600}
          defaultValue={ftp ?? ""}
        />
        {state?.fieldErrors?.ftp && (
          <div>
            {state?.fieldErrors?.ftp?.map((msg) => (
              <p key={msg} className="text-red-500">
                {msg}
              </p>
            ))}
          </div>
        )}
        <label htmlFor="max_hr">Max Heart Rate</label>
        <input
          type="number"
          name="max_hr"
          id="max_hr"
          placeholder="190"
          min={120}
          max={230}
          defaultValue={maxHr ?? ""}
        />
        {state?.fieldErrors?.max_hr && (
          <div>
            {state?.fieldErrors?.max_hr?.map((msg) => (
              <p key={msg} className="text-red-500">
                {msg}
              </p>
            ))}
          </div>
        )}
        <button type="submit" disabled={pending}>
          {pending ? "saving..." : "save"}
        </button>
      </form>
      {state?.message && (
        <p
          className={state?.success ? "text-green-500" : "text-red-500"}
          role={state?.success ? "status" : "alert"}
        >
          {state?.message}
        </p>
      )}
    </div>
  );
}

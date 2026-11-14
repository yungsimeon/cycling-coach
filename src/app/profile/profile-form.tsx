"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import {
  buttonPrimary,
  card,
  errorText,
  input,
  label,
  successText,
} from "@/components/ui/styles";

type ProfileFormProps = {
  ftp: number | null;
  maxHr: number | null;
  lthr: number | null;
};

export default function ProfileForm({ ftp, maxHr, lthr }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);

  return (
    <div className={card}>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5 sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:gap-y-1.5">
            <label htmlFor="ftp" className={`${label} self-end`}>
              FTP (W)
            </label>
            <input
              type="number"
              name="ftp"
              id="ftp"
              placeholder="300"
              min={50}
              max={600}
              defaultValue={ftp ?? ""}
              className={input}
            />
            {state?.fieldErrors?.ftp && (
              <div>
                {state?.fieldErrors?.ftp?.map((msg) => (
                  <p key={msg} className={errorText}>
                    {msg}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:gap-y-1.5">
            <label htmlFor="max_hr" className={`${label} self-end`}>
              Max Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="max_hr"
              id="max_hr"
              placeholder="190"
              min={130}
              max={230}
              defaultValue={maxHr ?? ""}
              className={input}
            />
            {state?.fieldErrors?.max_hr && (
              <div>
                {state?.fieldErrors?.max_hr?.map((msg) => (
                  <p key={msg} className={errorText}>
                    {msg}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:gap-y-1.5">
            <label htmlFor="lthr" className={`${label} self-end`}>
              Threshold Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="lthr"
              id="lthr"
              placeholder="170"
              min={120}
              max={210}
              defaultValue={lthr ?? ""}
              aria-describedby="lthr-hint"
              className={input}
            />
            <p id="lthr-hint" className="text-xs text-muted">
              Optional. If empty, we estimate it from your max heart rate.
            </p>
            {state?.fieldErrors?.lthr && (
              <div>
                {state?.fieldErrors?.lthr?.map((msg) => (
                  <p key={msg} className={errorText}>
                    {msg}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimary} self-start`}
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
      {state?.message && (
        <p
          className={`${state?.success ? successText : errorText} mt-3`}
          role={state?.success ? "status" : "alert"}
        >
          {state?.message}
        </p>
      )}
    </div>
  );
}

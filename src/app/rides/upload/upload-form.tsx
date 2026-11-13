"use client";

import { useActionState } from "react";
import { uploadRide } from "../actions";
import { buttonPrimary, card, errorText, label } from "@/components/ui/styles";

export default function UploadRideForm() {
  const [state, formAction, pending] = useActionState(uploadRide, undefined);

  return (
    <div className={card}>
      <form action={formAction} className="flex flex-col gap-4">
        <label
          htmlFor="file"
          className={label}
        >
          FIT file
        </label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".fit"
          className="rounded-row border border-line-strong bg-canvas p-3 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-fg"
        />
        <button
          type="submit"
          disabled={pending}
          className={`${buttonPrimary} self-start`}
        >
          {pending ? "Uploading..." : "Upload FIT file"}
        </button>
      </form>
      {state?.error && (
        <p className={`${errorText} mt-4`}>{state.error}</p>
      )}
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { uploadRide } from "../actions";

export default function UploadRideForm() {
  const [state, formAction, pending] = useActionState(uploadRide, undefined);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="file">FIT file</label>
        <input type="file" name="file" id="file" accept=".fit" />
        <button type="submit" disabled={pending}>
          {pending ? "Uploading..." : "Upload FIT file"}
        </button>
      </form>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </div>
  );
}

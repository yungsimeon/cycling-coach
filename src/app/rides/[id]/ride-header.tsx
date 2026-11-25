"use client";

import { useActionState, useState } from "react";
import { updateRide, type UpdateRideResult } from "../actions";
import {
  buttonPrimary,
  buttonSecondary,
  errorText,
  input,
  label,
  pageTitle,
} from "@/components/ui/styles";

const NAME_MAX = 100;
const DESCRIPTION_MAX = 2000;

// Title + description of a ride, with an inline form to edit them.
// Without a name, the title falls back to `fallbackTitle` (the date).
export default function RideHeader({
  id,
  name,
  description,
  fallbackTitle,
  subtitle,
}: {
  id: string;
  name: string | null;
  description: string | null;
  fallbackTitle: string;
  subtitle: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: UpdateRideResult, formData: FormData) => {
      const result = await updateRide(prev, formData);
      // Saved: close the form. refresh() in the action re-renders the page,
      // so the new name/description arrive as props.
      if (result?.ok) setEditing(false);
      return result;
    },
    undefined,
  );

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;
  const message = state?.ok === false ? state.message : undefined;

  if (!editing) {
    return (
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className={`${pageTitle} min-w-0 break-words`}>
            {name ?? fallbackTitle}
          </h1>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`${buttonSecondary} shrink-0`}
          >
            Edit
          </button>
        </div>
        <p className="mt-1 text-sm capitalize text-muted">{subtitle}</p>
        {description && (
          <p className="mt-3 whitespace-pre-line break-words text-sm text-fg/90">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={label}>
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={name ?? ""}
          placeholder={fallbackTitle}
          maxLength={NAME_MAX}
          autoFocus
          className={input}
          aria-invalid={fieldErrors?.name ? true : undefined}
          aria-describedby={fieldErrors?.name ? "name-error" : undefined}
        />
        {fieldErrors?.name && (
          <p id="name-error" className={errorText}>
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={description ?? ""}
          placeholder="How did it go?"
          maxLength={DESCRIPTION_MAX}
          rows={4}
          className={`${input} resize-y`}
          aria-invalid={fieldErrors?.description ? true : undefined}
          aria-describedby={
            fieldErrors?.description ? "description-error" : undefined
          }
        />
        {fieldErrors?.description && (
          <p id="description-error" className={errorText}>
            {fieldErrors.description[0]}
          </p>
        )}
      </div>

      {message && <p className={errorText}>{message}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={pending}
          className={buttonSecondary}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

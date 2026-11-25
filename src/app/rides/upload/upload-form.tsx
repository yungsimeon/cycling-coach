"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { uploadRide } from "../actions";
import {
  buttonPrimary,
  buttonSecondary,
  card,
  label,
} from "@/components/ui/styles";
import { formatDate } from "@/lib/format/units";

// One row per chosen file. The browser sends the files one at a time
// (each request stays under the 1 MB server action limit), so every file
// gets its own result.
// Matches serverActions.bodySizeLimit in next.config.ts (minus room for form overhead).
const MAX_FILE_BYTES = 5 * 1024 * 1024 - 100 * 1024;

type Item = {
  file: File;
  status: "waiting" | "uploading" | "done" | "error";
  message: string | null;
};

export default function UploadRideForm() {
  const [items, setItems] = useState<Item[]>([]);
  const [pending, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  const finished = items.filter(
    (item) => item.status === "done" || item.status === "error",
  ).length;
  const succeeded = items.filter((item) => item.status === "done").length;
  const allFinished = items.length > 0 && finished === items.length;

  function chooseFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setItems(
      files.map((file) => ({ file, status: "waiting", message: null })),
    );
  }

  function updateItem(index: number, change: Partial<Item>) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...change } : item)),
    );
  }

  function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = items.map((item) => item.file);
    startTransition(async () => {
      for (const [index, file] of files.entries()) {
        if (file.size > MAX_FILE_BYTES) {
          updateItem(index, {
            status: "error",
            message: "File is too large (max 5 MB).",
          });
          continue;
        }
        updateItem(index, { status: "uploading" });
        const formData = new FormData();
        formData.append("file", file);
        try {
          const result = await uploadRide(formData);
          updateItem(
            index,
            result.ok
              ? { status: "done", message: `Ride from ${formatDate(result.startedAt)}` }
              : { status: "error", message: result.error },
          );
        } catch (error) {
          // Network problems or a server crash: mark this file, keep going.
          console.error(error);
          updateItem(index, {
            status: "error",
            message: "Upload failed. Please try again.",
          });
        }
      }
    });
  }

  function reset() {
    setItems([]);
    if (input.current) input.current.value = "";
  }

  return (
    <div className={card}>
      <form onSubmit={upload} className="flex flex-col gap-4">
        <label htmlFor="file" className={label}>
          FIT files
        </label>
        <input
          ref={input}
          type="file"
          name="file"
          id="file"
          accept=".fit"
          multiple
          disabled={pending}
          onChange={chooseFiles}
          className="rounded-row border border-line-strong bg-canvas p-3 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-fg disabled:opacity-50"
        />

        {items.length > 0 && (
          <ul className="flex flex-col divide-y divide-line-subtle rounded-row border border-line-subtle">
            {items.map((item, index) => (
              <li
                key={`${item.file.name}-${index}`}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <StatusIcon status={item.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.file.name}</p>
                  {item.message && (
                    <p
                      className={`mt-0.5 text-xs ${
                        item.status === "error" ? "text-danger" : "text-muted"
                      }`}
                    >
                      {item.message}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  {formatSize(item.file.size)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {allFinished ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="mr-auto text-sm text-muted">
              {succeeded} of {items.length} uploaded
            </p>
            <button type="button" onClick={reset} className={buttonSecondary}>
              Upload more
            </button>
            <Link href="/rides" className={buttonPrimary}>
              View rides
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending || items.length === 0}
              className={buttonPrimary}
            >
              {pending
                ? "Uploading..."
                : items.length > 1
                  ? `Upload ${items.length} files`
                  : "Upload FIT file"}
            </button>
            {pending && (
              <p className="text-sm tabular-nums text-muted">
                {finished} of {items.length}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

function StatusIcon({ status }: { status: Item["status"] }) {
  const base =
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-2xs font-bold";
  switch (status) {
    case "waiting":
      return <span className={`${base} border border-line-strong`} aria-label="Waiting" />;
    case "uploading":
      return (
        <span
          className={`${base} animate-spin border-2 border-line-strong border-t-accent`}
          aria-label="Uploading"
        />
      );
    case "done":
      return (
        <span className={`${base} bg-accent text-on-accent`} aria-label="Uploaded">
          ✓
        </span>
      );
    case "error":
      return (
        <span className={`${base} bg-danger text-canvas`} aria-label="Failed">
          !
        </span>
      );
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

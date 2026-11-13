// Shared Tailwind class strings, so every page uses the same building blocks.
// Colors and radii come from the tokens in src/app/globals.css.

export const page = "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6";
export const authPage = "mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10";

export const pageTitle = "text-2xl sm:text-3xl font-bold tracking-tight";

export const card = "rounded-card border border-line bg-surface p-5";

export const label = "text-2xs font-medium uppercase tracking-wider text-muted";

export const input =
  "w-full rounded-row border border-line-strong bg-canvas px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 outline-none focus:border-accent";

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:opacity-90 disabled:opacity-50";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover disabled:opacity-50";

export const link = "font-medium text-fg underline-offset-4 hover:underline";

export const errorText = "text-sm text-danger";
export const successText = "text-sm text-accent";

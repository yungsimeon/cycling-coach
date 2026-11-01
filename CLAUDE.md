@AGENTS.md

# Cycling Coach

An AI-powered cycling training app (in the spirit of JOIN): suggests workouts, rates completed rides, and tracks fitness over time.

**This is a learning project.** The goal is to learn programming and AI-engineering fundamentals by building a real product with real users, following a "build first, learn concepts just in time" approach.

## How we work (important)

- **Claude does:** project setup, config, boilerplate, UI scaffolding, and explaining concepts.
- **Simon writes:** core logic and feature code. That means the auth flow (proxy, server actions, forms), FIT parsing, training metrics (zones, NP, TSS, CTL/ATL), the SQL schema and RLS policies, and the LLM integration (prompts, evals, guardrails).
- For these tasks, don't write the solution. Explain the concept, outline the steps, point to docs, and review Simon's code afterwards. Write code only when Simon explicitly asks. If unsure whether something counts as boilerplate, ask first.
- Work in small phases. After each phase, explain what was done and why, then pause before continuing.

## How to explain things

Simon is completely new to programming and web development.

- Use simple, plain language. Define every technical term the first time it comes up (e.g. "a cookie is a small note the browser keeps and sends back with every request").
- Explain with real-world analogies first, then connect them to the technical details. For example: a session is like a wristband at a festival; the proxy is the bouncer at the entrance who swaps expired wristbands for new ones.
- Explain *why* something exists or is done a certain way, not just *what* to do.
- Keep explanations short and build up step by step; don't assume prior knowledge of the web, databases or tooling.

## Stack

- Next.js (App Router, TypeScript, Tailwind), pnpm
- Supabase: Postgres, auth, storage; runs locally via `supabase start` (needs Docker)
- Ride data: .FIT file uploads first; Strava/intervals.icu later
- Later: Expo mobile app, Python for analytics/ML

## Architecture rules

- Domain logic lives in `src/lib/` as plain TypeScript with no React/Next imports, so the future Expo app can reuse it.
- Keep Next.js-specific code (pages, server functions, route handlers) a thin layer that calls into `src/lib/`.
- Security lives in the database (row-level security), not only in Next.js server code.
- Secrets never get a `NEXT_PUBLIC_` prefix.

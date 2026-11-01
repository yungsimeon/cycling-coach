# Cycling Coach

AI-powered cycling training: upload your rides, get them rated, get workout suggestions, and see your fitness develop.

## Getting started

Requires Node, pnpm, Docker and the Supabase CLI.

```bash
pnpm install
supabase start              # starts local Postgres, auth and storage in Docker
cp .env.example .env.local  # then paste the URL and key from `supabase status`
pnpm dev                    # http://localhost:3000
```

The local Supabase dashboard runs at http://localhost:54323.

## Roadmap

1. **Foundation:** auth (sign up / sign in), user profile with FTP and max heart rate
2. **Ride upload:** upload .FIT files, parse them, store rides and data streams
3. **Ride analysis:** power and heart-rate zones, normalized power, TSS, charts
4. **Fitness tracking:** fitness/fatigue/form (CTL/ATL/TSB) over time
5. **AI ride rating:** LLM feedback on each ride, with prompt tuning, evals and guardrails
6. **AI workout suggestions:** next workouts based on goals and current form
7. **Real users:** deploy, get feedback from other cyclists, iterate
8. **Later:** Strava sync, Expo mobile app, Python analytics/ML

## Project structure

```
src/app/         Next.js pages and routes (thin layer)
src/lib/         domain logic in plain TypeScript, reusable by a future mobile app
supabase/        local Supabase config and database migrations
```

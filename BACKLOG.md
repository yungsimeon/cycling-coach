# Backlog

Ideas and planned features, grouped by theme. The README roadmap shows the big phases;
this file holds the details. Order within a section is rough priority.

**Legend:** 🔜 next up · ⏳ needs something else first (see "needs") · 💡 idea, not decided yet

## Ride metrics (in progress)

- 🔜 Save `avg_hr`, `peak_hr`, `peak_power` on upload (functions exist, wire into `calculateRideMetrics` + upload action; null out implausible HR instead of failing the upload)
- 🔜 `peak_speed_mps` (GPS spike filter, ~120 km/h limit) and `avg_cadence`
- 🔜 HR zones (Coggan, % of LTHR) + `time_in_hr_zones`
- 🔜 hrTSS for rides without power; CTL uses power TSS, falls back to hrTSS
- **Best efforts (power curve):** best average power for 15s, 30s, 1, 2, 3, 5, 8, 10, 15, 20, 30, 45 min, 1h per ride (probably its own table, one row per ride and duration)
  - All-time and last-90-days bests, "new personal best!" on the ride page
  - Power curve chart (your best efforts vs. a chosen period)
- Efficiency Factor (NP ÷ avg HR) and aerobic decoupling (does HR drift up while power stays the same?). Good measure of base fitness
- 💡 Best efforts for HR and speed too
- Recalculate old rides from stored FIT files when formulas change

## Profile & athlete data

- **Weight** → W/kg (FTP and best efforts), the standard way to compare climbing ability
- **History instead of one value:** FTP, LTHR, max HR and weight change over time. A `profile_history` table (value + date) lets charts show progress and old rides keep their numbers
- Auto-detect from rides (only ever raise, never lower without asking):
  - Max HR from `peak_hr`
  - eFTP from best efforts (e.g. 95 % of best 20 min)
  - LTHR from long threshold efforts
- **Suggest a new FTP test** when eFTP from recent rides is clearly above the profile FTP, or when the last test is more than ~6–8 weeks old
- 💡 Age and sex (only if a feature really needs it; don't collect data "just in case")
- Unit preference (km / miles)

## Fitness tracking

- CTL / ATL / TSB (fitness, fatigue, form) per day, chart over time
- Ramp-rate warning when fitness climbs too fast (injury/overtraining risk)
- Weekly summary: hours, TSS, distance, compared with previous weeks
- Calendar view of past rides and planned workouts

## Workouts

- **Structured workouts:** a workout is a list of steps (warm-up, intervals with target % FTP and duration, recovery, cool-down)
- Workout library (endurance, sweet spot, threshold, VO2max, sprints, recovery)
- **Export to bike computers / trainers** (.fit workout file, .zwo for Zwift); otherwise riders can't actually follow the workout
- ⏳ **Execution score** after doing a planned workout (needs: structured workouts, matching a ride to a planned workout)
  - Interval matching: was each interval at the right power for the right time?
  - Time in target zones for unstructured rides (e.g. endurance)
  - Score + short explanation ("intervals 3 and 4 faded, start a bit easier")
- Post-ride RPE: "how hard did it feel?" (1–10). Cheap to collect, very useful for the AI coach

## Training plans

- ⏳ Plans to choose from (needs: workout library): **FTP Builder**, **Base Building**, **Race Sharpening**
- Plan setup: goal, event date (optional), **available days and hours per week**
- Periodization: build weeks + recovery weeks, taper before an event
- ⏳ **Adapting the plan:**
  - "I'm sick / injured / traveling": pause, then ease back in (not just continue where you left off)
  - Missed workouts: reshuffle the week instead of piling them up
  - Too hard / too easy (execution scores, RPE, TSB): adjust upcoming intensity
- 💡 Daily check-in (sleep, soreness, mood) feeding into adaptation

## AI coach

- AI ride rating (roadmap phase 5): prompts, evals, guardrails, cost limits
- AI workout suggestions / plan adaptation (phase 6)
- Explain the "why" in plain language ("easy day today because your fatigue is high")
- 💡 Chat with the coach about your training

## Rides & maps

- Map of each ride (simplified route stored at upload, dark map tiles)
- **Privacy zones:** hide the start/end around home
- Delete a ride from the UI (DB policy exists already)
- Duplicate upload protection (same start time → "already uploaded")
- Bulk upload (several FIT files at once)
- Charts on the ride page: power, HR, speed, elevation over time
- Laps / auto-detected intervals on the ride page

## Integrations

- Strava import (OAuth + webhooks for new rides)
- intervals.icu / Garmin Connect
- 💡 Push planned workouts to Garmin/Wahoo directly

## Real users & operations

- Deploy (hosted Supabase + Vercel or similar)
- **Account deletion and data export** (GDPR: users in the EU have a right to both)
- Privacy policy (GPS and health data are sensitive)
- Email notifications (weekly summary, plan reminders), opt-in
- Error monitoring

## Tech debt & small things

- Automated tests (Vitest) for `src/lib/` — turn the ad-hoc test scripts into real tests
- `FitParseError` custom error class
- Raise `serverActions.bodySizeLimit` for long rides
- Zone percentage helper in `zones.ts`
- Min password length 8, nicer `?error=google` message on login
- Update Supabase CLI (v2 → v3)

## Later platforms

- Expo mobile app (reuses `src/lib/`)
- Python for analytics/ML (better eFTP, fatigue models)

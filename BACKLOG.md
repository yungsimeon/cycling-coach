# Backlog

Ideas and planned features, grouped by theme. The README roadmap shows the big phases;
this file holds the details. Order within a section is rough priority.

**Legend:** 🔜 next up · ⏳ needs something else first (see "needs") · 💡 idea, not decided yet

## Ride metrics

- ✅ `avg_hr`, `peak_hr`, `peak_power`, `peak_speed_mps`, `avg_cadence` saved on upload
- ✅ HR zones + `time_in_hr_zones`, hrTSS for rides without power (CTL falls back to hrTSS)
- 💡 hrTSS vs. power TSS differ by ~30 % on rides with both: check thresholds / consider per-user calibration
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

- ✅ CTL / ATL / TSB (fitness, fatigue, form) per day, chart on the dashboard
- 🔜 **Explain the curves in plain language (rules, no AI):** form ranges (fresh / productive / overreaching), fitness trend over the last 4 weeks, ramp rate. Plain TS in `src/lib/`; later the input for the AI coach
- **Health log:** sick / injured / travel periods (start, optional end, type, note). Shaded on the fitness chart; context for the AI coach and plan adaptation
- 💡 Dedicated /fitness page with time ranges (6 weeks, 1 year, all)
- 💡 "Today" in the user's time zone instead of UTC
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
- Explain the "why" in plain language ("easy day today because your fatigue is high"); builds on the rule-based fitness explanation, ride names/notes and the health log
- 💡 Chat with the coach about your training

## Rides & maps

- ✅ Map of each ride (Douglas–Peucker route, 5 m tolerance, stored at upload + backfill script; Leaflet with Esri dark tiles)
- ✅ Map styles: dark with terrain shading (default), Topo, Satellite; choice remembered per browser
- **Elevation profile:** chart under the map (distance → altitude) to see climbs at a glance. Needs altitude per point from the FIT samples, a simplified profile stored at upload (new column + backfill, same pattern as `route`), then the chart. Later: hover on the chart highlights the spot on the map; gradient colours on steep parts
- **Map tiles before deploying:** Esri's keyless tiles are fine for dev; check their terms or switch to a keyed provider (CARTO, Stadia, MapTiler) once the app is public
- **Privacy zones:** hide the start/end around home
- Delete a ride from the UI (DB policy exists already)
- ✅ **Ride name and description:** editable on the ride page (first update action + RLS update policy); default name from time of day ("Morning ride")
- ✅ Duplicate upload protection (unique `user_id, started_at`)
- ✅ Bulk upload (several FIT files at once, one request per file)
- Reject non-cycling activities (runs) until running is supported
- **Running support (for fatigue first):** runs count towards ATL/CTL via hrTSS with a separate running LTHR (usually a few bpm above cycling). Later: threshold pace, pace display, running zones
- Charts on the ride page: power, HR, speed, elevation over time
- **Laps (Strava-style, see `fixtures/inspo/IMG_0286.PNG`):** bars with width = lap duration and height = avg power, elevation profile shaded behind, selected lap highlighted; table below (lap, distance, time, avg power, avg HR), chart and table linked. Needs: a `laps` jsonb column with per-lap stats computed from samples at upload + backfill (laps are already parsed in `parseFit`). Build next to the elevation profile (both use `altitudeM`)
- 💡 Auto-detected intervals (for rides without manual laps)

## Integrations

- Strava import (OAuth + webhooks for new rides)
- Wahoo Cloud API (OAuth + `workout_summary` webhook with FIT file; needs deploy + app approval)
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
- ✅ Raise `serverActions.bodySizeLimit` for long rides (5 MB)
- Zone percentage helper in `zones.ts`
- Min password length 8, nicer `?error=google` message on login
- Update Supabase CLI (v2 → v3)

## Later platforms

- Expo mobile app (reuses `src/lib/`)
- Python for analytics/ML (better eFTP, fatigue models)

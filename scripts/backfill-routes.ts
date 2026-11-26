import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/supabase/database.types.ts";
import { parseFit } from "../src/lib/fit/parse.ts";
import { rideRoute } from "../src/lib/rides/route.ts";
import type { Ride } from "../src/lib/fit/types.ts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey)
  throw new Error("Supabase credentials missing");

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const { data: rides, error } = await supabase
  .from("rides")
  .select("id, fit_file_path")
  .is("route", null)
  .not("fit_file_path", "is", null);

if (error) {
  console.error(error);
  process.exit(1);
}
if (rides.length === 0) {
  console.log("No rides matching the query found");
  process.exit(0);
}

let updated = 0;
let failed = 0;
// console.log(`${rides.length} rides to backfill`);
for (const ride of rides) {
  if (!ride.fit_file_path) continue;
  const { data: file, error } = await supabase.storage
    .from("fit-files")
    .download(ride.fit_file_path);
  if (error) {
    console.error(error);
    failed++;

    continue;
  }
  const fileContent = new Uint8Array(await file.arrayBuffer());
  let parsed: Ride;
  try {
    parsed = parseFit(fileContent);
  } catch (error) {
    console.error(error);
    failed++;

    continue;
  }

  const route = rideRoute(parsed.samples);

  const { error: updateError } = await supabase
    .from("rides")
    .update({ route })
    .eq("id", ride.id);
  if (updateError) {
    console.error(updateError);
    failed++;
    continue;
  }
  updated++;
}

console.log(`Updated: ${updated} Rides and failed to update ${failed} rides`);

import { readFileSync } from "node:fs";
import { Decoder, Stream } from "@garmin/fitsdk";
import { parseFit } from "../src/lib/fit/parse.ts";
import { averagePower, normalizedPower } from "../src/lib/metrics/power.ts";

const path = "fixtures/fit/power_and_hr.fit";
const buffer = readFileSync(path);
const stream = Stream.fromBuffer(buffer);
const decoder = new Decoder(stream);

const { messages, errors } = decoder.read();
if (errors) console.log("number of errors: ", errors.length);

// console.log("message types: ", Object.keys(messages));
// console.log("number of records: ", messages.recordMesgs?.length);
// console.log(messages.recordMesgs?.[5000]);
const session = messages?.sessionMesgs?.[0];
// console.log(session);

const ride = parseFit(buffer);
console.log(normalizedPower(ride.samples));

//console.log(averagePower())

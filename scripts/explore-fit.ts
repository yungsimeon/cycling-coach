import { readFileSync } from "node:fs";
import { Decoder, Stream } from "@garmin/fitsdk";

const path = "fixtures/fit/laps.fit";
const buffer = readFileSync(path);
const stream = Stream.fromBuffer(buffer);
const decoder = new Decoder(stream);

const { messages, errors } = decoder.read();
if (errors) console.log("number of errors: ", errors.length);

console.log("message types: ", Object.keys(messages));
console.log("number of records: ", messages.recordMesgs?.length);
console.log(messages.recordMesgs?.[5000]);

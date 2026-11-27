export type FormZoneId =
  | "transition"
  | "fresh"
  | "neutral"
  | "optimal"
  | "highRisk";

export type FormZone = {
  id: FormZoneId;
  label: string;
  meaning: string;
  minTSB: number;
};

export const FORM_ZONES: FormZone[] = [
  {
    id: "transition",
    label: "Transition",
    meaning: "Very rested, but fitness is fading. Typical after a long break.",
    minTSB: 25,
  },
  {
    id: "fresh",
    label: "Fresh",
    meaning: "Rested and ready: good for races or hard sessions",
    minTSB: 5,
  },
  {
    id: "neutral",
    label: "Neutral",
    meaning: "Balanced, normal training",
    minTSB: -10,
  },
  {
    id: "optimal",
    label: "Optimal",
    meaning: "Productive training load: this is where fitness gets built",
    minTSB: -30,
  },
  {
    id: "highRisk",
    label: "High risk",
    meaning: "Too much fatigue: risk of overtraining, illness or injury",
    minTSB: -Infinity,
  },
];

export function formZone(tsb: number): FormZone {
  for (const zone of FORM_ZONES) {
    if (zone.minTSB <= tsb) return zone;
  }
  throw new Error(`No form zone found for TSB: ${tsb}`);
}

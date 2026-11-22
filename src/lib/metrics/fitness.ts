export type RideTrainingLoad = {
  start: Date;
  utcOffsetMin: number | null;
  tss: number | null;
  hrTss: number | null;
};

export type DailyLoad = {
  date: string; // string format (YYYY-MM-DD), local day
  tss: number;
};

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function sumDailyLoad(activities: RideTrainingLoad[]): DailyLoad[] {
  const load = new Map<string, number>();
  for (const ride of activities) {
    const tss = ride.tss ?? ride.hrTss ?? 0;
    const day = localDay(ride.start, ride.utcOffsetMin);
    const currentLoad = load.get(day) ?? 0;
    const totalLoad = currentLoad + tss;

    load.set(day, totalLoad);
  }
  const entries = Array.from(load.entries());
  return entries.map(([date, tss]) => {
    return {
      date: date,
      tss: tss,
    };
  });
}

export function fillMissingDays(
  loads: DailyLoad[],
  endDate: string,
): DailyLoad[] {
  if (loads.length === 0) return [];

  const dailyLoads: DailyLoad[] = [];
  const tssByDay = new Map(loads.map((load) => [load.date, load.tss]));

  const earliestDay = loads.reduce((acc, currVal) =>
    currVal.date < acc.date ? currVal : acc,
  ).date;
  let currentDay = earliestDay;
  while (currentDay <= endDate) {
    dailyLoads.push({ date: currentDay, tss: tssByDay.get(currentDay) ?? 0 });
    currentDay = nextDay(currentDay);
  }
  return dailyLoads;
}

function localDay(start: Date, utcOffsetMin: number | null): string {
  const utcOffsetMs = (utcOffsetMin ?? 0) * MS_PER_MINUTE;
  return new Date(utcOffsetMs + start.getTime()).toISOString().slice(0, 10);
}

function nextDay(day: string): string {
  const dayMs = new Date(day).getTime();
  const nextDayMs = dayMs + MS_PER_DAY;
  return new Date(nextDayMs).toISOString().slice(0, 10);
}

export function averageSpeedKmh(
  distanceM: number | null,
  movingTimeS: number,
): number | null {
  if (distanceM === null || movingTimeS === 0) return null;
  return (distanceM / movingTimeS) * 3.6;
}

import type { RideSample } from "../fit/types";

export type LatLng = [lat: number, lng: number];
export type Meters = [x: number, y: number];

const METERS_PER_LAT = 111320;
const ROUTE_TOLERANCE_M = 5;

function latlngValues(samples: RideSample[]): LatLng[] {
  const points: LatLng[] = [];

  for (const sample of samples) {
    if (sample.latitude === null || sample.longitude === null) continue;
    points.push([sample.latitude, sample.longitude]);
  }
  return points;
}

function perpendicularDistance(
  point: LatLng,
  lineStart: LatLng,
  lineEnd: LatLng,
): number {
  const avgLat = (lineStart[0] + lineEnd[0]) / 2;
  const radians = (avgLat * Math.PI) / 180;
  const factor = Math.cos(radians);

  const pointMeters = toMeters(point, factor);
  const lineStartMeters = toMeters(lineStart, factor);
  const lineEndMeters = toMeters(lineEnd, factor);

  const [ax, ay] = lineStartMeters;
  const [bx, by] = lineEndMeters;
  const [px, py] = pointMeters;

  const dx = bx - ax;
  const dy = by - ay;

  const baseLength = Math.sqrt(dx ** 2 + dy ** 2);
  if (baseLength === 0) return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
  const area = Math.abs(dx * (py - ay) - dy * (px - ax));
  return area / baseLength;
}

function simplify(points: LatLng[], tolerance: number): LatLng[] {
  if (points.length <= 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  let maxDistance = 0;
  let maxIndex = 0;

  for (let i = 1; i <= points.length - 2; i++) {
    const currentDistance = perpendicularDistance(points[i], first, last);
    if (currentDistance > maxDistance) {
      maxDistance = currentDistance;
      maxIndex = i;
    }
  }
  if (maxDistance <= tolerance) return [first, last];
  const leftHalf = points.slice(0, maxIndex + 1);
  const rightHalf = points.slice(maxIndex);

  const simplifiedLeft = simplify(leftHalf, tolerance);
  const simplifiedRight = simplify(rightHalf, tolerance);

  const bothHalves = [...simplifiedLeft, ...simplifiedRight.slice(1)];
  return bothHalves;
}

export function rideRoute(samples: RideSample[]): LatLng[] | null {
  const points = latlngValues(samples);
  if (points.length < 2) return null;
  return simplify(points, ROUTE_TOLERANCE_M);
}

function toMeters(point: LatLng, factor: number): Meters {
  return [point[1] * METERS_PER_LAT * factor, point[0] * METERS_PER_LAT];
}

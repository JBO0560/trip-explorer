/**
 * Calculates intermediate points for a quadratic bezier curve between two lat/lng coordinates.
 * Generates an arc that bends northwards across bodies of water / transfers.
 */
export function getCurvedFlightPath(
  start: [number, number],
  end: [number, number],
  numPoints: number = 25,
  curveFactor: number = 0.25
): [number, number][] {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  // Midpoint
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  // Perpendicular offset vector
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  // For predominantly east-west paths (like Korea to Japan where dLng > 0),
  // adding to latitude curves it northwards.
  // Standard normal rotated 90 degrees counter-clockwise: (-dLng, dLat).
  // When dLng > 0, -dLng < 0 (south). So we use (+dLng, -dLat) for north arc:
  const controlLat = midLat + Math.abs(dLng) * curveFactor;
  const controlLng = midLng - dLat * curveFactor;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
}

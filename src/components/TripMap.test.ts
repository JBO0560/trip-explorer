import { describe, it, expect } from 'vitest';
import { getCurvedFlightPath } from './geoUtils';
import { initialTripData } from '../data/initialTrip';

describe('TripMap Route & Flight Utilities', () => {
  it('generates smooth flight curve points between Busan and Osaka', () => {
    const busanLeg = initialTripData.legs.find((l) => l.id === 'busan')!;
    const osakaLeg = initialTripData.legs.find((l) => l.id === 'osaka-kyoto')!;

    expect(busanLeg).toBeDefined();
    expect(osakaLeg).toBeDefined();

    const points = getCurvedFlightPath(busanLeg.coordinates, osakaLeg.coordinates, 20);

    expect(points.length).toBe(21);
    expect(points[0][0]).toBeCloseTo(busanLeg.coordinates[0], 4);
    expect(points[0][1]).toBeCloseTo(busanLeg.coordinates[1], 4);
    expect(points[20][0]).toBeCloseTo(osakaLeg.coordinates[0], 4);
    expect(points[20][1]).toBeCloseTo(osakaLeg.coordinates[1], 4);

    // Verify midpoint arcs northwards (greater latitude than the linear average)
    const midPoint = points[10];
    const linearAvgLat = (busanLeg.coordinates[0] + osakaLeg.coordinates[0]) / 2;
    expect(midPoint[0]).toBeGreaterThan(linearAvgLat);
  });

  it('handles straight or identical start/end gracefully', () => {
    const p: [number, number] = [35.0, 130.0];
    const points = getCurvedFlightPath(p, p, 5);
    expect(points.length).toBe(6);
    expect(points[0]).toEqual(p);
    expect(points[5]).toEqual(p);
  });
});

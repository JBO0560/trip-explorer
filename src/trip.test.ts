import { describe, it, expect } from 'vitest';
import { initialTripData } from './data/initialTrip';

describe('Trip Data Model', () => {
  it('loads initial trip with legs and transfers', () => {
    expect(initialTripData.legs.length).toBeGreaterThan(0);
    expect(initialTripData.transfers.length).toBeGreaterThan(0);
  });

  it('connects legs with valid references', () => {
    const legIds = new Set(initialTripData.legs.map((l) => l.id));
    for (const transfer of initialTripData.transfers) {
      expect(legIds.has(transfer.fromLegId)).toBe(true);
      expect(legIds.has(transfer.toLegId)).toBe(true);
    }
  });
});

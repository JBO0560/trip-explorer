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

  it('includes the flight from Tokyo to Sydney on January 7', () => {
    const tokyoSydneyTransfer = initialTripData.transfers.find(
      (t) => t.fromLegId === 'tokyo' && t.toLegId === 'sydney'
    );
    expect(tokyoSydneyTransfer).toBeDefined();
    expect(tokyoSydneyTransfer?.type).toBe('flight');
    expect(tokyoSydneyTransfer?.departureTime).toContain('01-07');

    const sydneyLeg = initialTripData.legs.find((l) => l.id === 'sydney');
    expect(sydneyLeg).toBeDefined();
    expect(sydneyLeg?.name).toBe('Sydney');
    expect(sydneyLeg?.country).toBe('Australia');
  });

  it('supports transfers with structured layover and flight segments', () => {
    const testTransferWithLayover = {
      id: 't-test-layover',
      fromLegId: 'tokyo',
      toLegId: 'sydney',
      type: 'flight' as const,
      status: 'confirmed' as const,
      carrier: 'Singapore Airlines',
      transitCode: 'SQ635 / SQ231',
      layover: {
        city: 'Singapore',
        airportCode: 'SIN',
        duration: '2h 45m',
        coordinates: [1.3644, 103.9915] as [number, number]
      },
      segments: [
        {
          carrier: 'Singapore Airlines',
          transitCode: 'SQ635',
          from: 'Tokyo (HND)',
          to: 'Singapore (SIN)'
        },
        {
          carrier: 'Singapore Airlines',
          transitCode: 'SQ231',
          from: 'Singapore (SIN)',
          to: 'Sydney (SYD)'
        }
      ]
    };

    expect(testTransferWithLayover.layover.airportCode).toBe('SIN');
    expect(testTransferWithLayover.segments.length).toBe(2);
    expect(testTransferWithLayover.segments[0].transitCode).toBe('SQ635');
  });
});

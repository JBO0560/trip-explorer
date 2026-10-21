import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTripData, TRIP_STORAGE_KEY } from './useTripData';
import { initialTripData } from '../data/initialTrip';
import { TripLeg, TransferConnection, ActivityPOI } from '../types/trip';

class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('useTripData hook', () => {
  let mockStorage: MockLocalStorage;
  const originalLocalStorage = (globalThis as unknown as { localStorage?: unknown }).localStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true
    });
  });

  it('initializes with default trip data when localStorage is empty', () => {
    const { result } = renderHook(() => useTripData());
    expect(result.current.trip.title).toBe(initialTripData.title);
    expect(result.current.trip.legs.length).toBe(initialTripData.legs.length);
    expect(result.current.trip.transfers.length).toBe(initialTripData.transfers.length);
  });

  it('initializes from localStorage if valid trip data exists', () => {
    const customTrip = {
      ...initialTripData,
      title: 'Custom Tokyo & Seoul Adventure',
      status: 'confirmed' as const
    };
    mockStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(customTrip));

    const { result } = renderHook(() => useTripData());
    expect(result.current.trip.title).toBe('Custom Tokyo & Seoul Adventure');
    expect(result.current.trip.status).toBe('confirmed');
  });

  it('updates trip metadata and persists to localStorage', () => {
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.updateTripMetadata({
        title: 'Updated 2027 Journey',
        overallDateRange: 'Autumn 2027',
        notes: 'Pack light jackets'
      });
    });

    expect(result.current.trip.title).toBe('Updated 2027 Journey');
    expect(result.current.trip.overallDateRange).toBe('Autumn 2027');
    expect(result.current.trip.notes).toBe('Pack light jackets');

    const stored = JSON.parse(mockStorage.getItem(TRIP_STORAGE_KEY) || '{}');
    expect(stored.title).toBe('Updated 2027 Journey');
  });

  it('updates trip status via setTripStatus', () => {
    const { result } = renderHook(() => useTripData());

    expect(result.current.trip.status).toBe('tentative');

    act(() => {
      result.current.setTripStatus('confirmed');
    });

    expect(result.current.trip.status).toBe('confirmed');
  });

  describe('Legs operations', () => {
    it('adds a new leg to the end and at specific index', () => {
      const { result } = renderHook(() => useTripData());
      const initialLegCount = result.current.trip.legs.length;

      const newLeg: TripLeg = {
        id: 'jeju',
        name: 'Jeju Island',
        country: 'Korea',
        approxDays: 3,
        coordinates: [33.4996, 126.5312],
        highlights: ['Hallasan Hike', 'Black Pork BBQ'],
        activities: []
      };

      act(() => {
        result.current.addLeg(newLeg);
      });

      expect(result.current.trip.legs.length).toBe(initialLegCount + 1);
      expect(result.current.trip.legs[result.current.trip.legs.length - 1].id).toBe('jeju');

      // Insert at index 1
      const hiroshimaLeg: TripLeg = {
        id: 'hiroshima',
        name: 'Hiroshima',
        country: 'Japan',
        approxDays: 2,
        coordinates: [34.3853, 132.4553],
        highlights: ['Peace Memorial Park', 'Miyajima'],
        activities: []
      };

      act(() => {
        result.current.addLeg(hiroshimaLeg, 1);
      });

      expect(result.current.trip.legs.length).toBe(initialLegCount + 2);
      expect(result.current.trip.legs[1].id).toBe('hiroshima');
    });

    it('updates an existing leg', () => {
      const { result } = renderHook(() => useTripData());

      act(() => {
        result.current.updateLeg('seoul', {
          approxDays: 7,
          startDate: '2027-04-01',
          endDate: '2027-04-08',
          accommodation: {
            name: 'Four Seasons Hotel Seoul',
            bookingRef: 'FS-9821'
          }
        });
      });

      const updatedSeoul = result.current.trip.legs.find((l) => l.id === 'seoul');
      expect(updatedSeoul?.approxDays).toBe(7);
      expect(updatedSeoul?.startDate).toBe('2027-04-01');
      expect(updatedSeoul?.accommodation?.name).toBe('Four Seasons Hotel Seoul');
      expect(updatedSeoul?.accommodation?.bookingRef).toBe('FS-9821');
    });

    it('deletes a leg and cleans up associated transfers', () => {
      const { result } = renderHook(() => useTripData());

      // Busan is connected by 't-ktx' (from seoul to busan) and 't-cross' (from busan to osaka-kyoto)
      expect(result.current.trip.transfers.some((t) => t.fromLegId === 'busan' || t.toLegId === 'busan')).toBe(true);

      act(() => {
        result.current.deleteLeg('busan');
      });

      expect(result.current.trip.legs.some((l) => l.id === 'busan')).toBe(false);
      expect(result.current.trip.transfers.some((t) => t.fromLegId === 'busan' || t.toLegId === 'busan')).toBe(false);
    });

    it('reorders legs properly', () => {
      const { result } = renderHook(() => useTripData());
      const firstLegId = result.current.trip.legs[0].id;
      const secondLegId = result.current.trip.legs[1].id;

      act(() => {
        result.current.reorderLegs(0, 1);
      });

      expect(result.current.trip.legs[0].id).toBe(secondLegId);
      expect(result.current.trip.legs[1].id).toBe(firstLegId);
    });
  });

  describe('Transfers operations', () => {
    it('adds, updates, and deletes transfers', () => {
      const { result } = renderHook(() => useTripData());

      const newTransfer: TransferConnection = {
        id: 't-tokyo-return',
        fromLegId: 'tokyo',
        toLegId: 'seoul',
        type: 'flight',
        status: 'tentative',
        notes: 'Return flight to Incheon'
      };

      act(() => {
        result.current.addTransfer(newTransfer);
      });

      expect(result.current.trip.transfers.some((t) => t.id === 't-tokyo-return')).toBe(true);

      // Update transfer with confirmed details
      act(() => {
        result.current.updateTransfer('t-tokyo-return', {
          carrier: 'Asiana Airlines',
          transitCode: 'OZ105',
          departureTime: '2027-04-18 19:00',
          arrivalTime: '2027-04-18 21:30',
          status: 'confirmed',
          seatNotes: '14A, 14B'
        });
      });

      const updated = result.current.trip.transfers.find((t) => t.id === 't-tokyo-return');
      expect(updated?.status).toBe('confirmed');
      expect(updated?.transitCode).toBe('OZ105');
      expect(updated?.seatNotes).toBe('14A, 14B');

      // Delete transfer
      act(() => {
        result.current.deleteTransfer('t-tokyo-return');
      });

      expect(result.current.trip.transfers.some((t) => t.id === 't-tokyo-return')).toBe(false);
    });

    it('toggles transfer status between tentative and confirmed', () => {
      const { result } = renderHook(() => useTripData());

      const transferId = result.current.trip.transfers[0].id;
      expect(result.current.trip.transfers[0].status).toBe('tentative');

      act(() => {
        result.current.toggleTransferStatus(transferId);
      });

      expect(result.current.trip.transfers.find((t) => t.id === transferId)?.status).toBe('confirmed');

      act(() => {
        result.current.toggleTransferStatus(transferId);
      });

      expect(result.current.trip.transfers.find((t) => t.id === transferId)?.status).toBe('tentative');
    });
  });

  describe('POIs (Activities) operations', () => {
    it('adds, updates, and deletes POIs on a leg', () => {
      const { result } = renderHook(() => useTripData());

      const newPOI: ActivityPOI = {
        id: 'poi-custom-1',
        name: 'Han River Park Sunset Picnic',
        category: 'nature',
        notes: 'Chimaek (chicken and beer) by the river',
        coordinate: [37.5283, 126.9328]
      };

      act(() => {
        result.current.addPOI('seoul', newPOI);
      });

      const seoulLeg = result.current.trip.legs.find((l) => l.id === 'seoul');
      expect(seoulLeg?.activities.some((p) => p.id === 'poi-custom-1')).toBe(true);

      // Update POI
      act(() => {
        result.current.updatePOI('seoul', 'poi-custom-1', {
          name: 'Yeouido Han River Park Picnic',
          notes: 'Rent bicycles and buy ramen from convenience store'
        });
      });

      const updatedSeoul = result.current.trip.legs.find((l) => l.id === 'seoul');
      const updatedPOI = updatedSeoul?.activities.find((p) => p.id === 'poi-custom-1');
      expect(updatedPOI?.name).toBe('Yeouido Han River Park Picnic');

      // Delete POI
      act(() => {
        result.current.deletePOI('seoul', 'poi-custom-1');
      });

      const finalSeoul = result.current.trip.legs.find((l) => l.id === 'seoul');
      expect(finalSeoul?.activities.some((p) => p.id === 'poi-custom-1')).toBe(false);
    });
  });

  describe('Import / Export & Reset operations', () => {
    it('exports current trip as formatted JSON', () => {
      const { result } = renderHook(() => useTripData());
      const json = result.current.exportJSON();
      const parsed = JSON.parse(json);

      expect(parsed.title).toBe(result.current.trip.title);
      expect(parsed.legs.length).toBe(result.current.trip.legs.length);
    });

    it('imports valid JSON and updates state', () => {
      const { result } = renderHook(() => useTripData());

      const importedData = {
        title: 'Imported Hokkaido Tour',
        status: 'confirmed',
        overallDateRange: 'Winter 2027',
        travelers: ['Jasper'],
        legs: [
          {
            id: 'sapporo',
            name: 'Sapporo',
            country: 'Japan',
            approxDays: 4,
            coordinates: [43.0618, 141.3545],
            highlights: ['Snow Festival', 'Ramen Alley'],
            activities: []
          }
        ],
        transfers: []
      };

      let importResult: { success: boolean; error?: string };
      act(() => {
        importResult = result.current.importJSON(JSON.stringify(importedData));
      });

      expect(importResult!.success).toBe(true);
      expect(result.current.trip.title).toBe('Imported Hokkaido Tour');
      expect(result.current.trip.legs.length).toBe(1);
    });

    it('rejects invalid JSON string or schema', () => {
      const { result } = renderHook(() => useTripData());

      act(() => {
        const res = result.current.importJSON('not-json');
        expect(res.success).toBe(false);
        expect(res.error).toContain('JSON Parse error');
      });

      act(() => {
        const res = result.current.importJSON(JSON.stringify({ notTrip: true }));
        expect(res.success).toBe(false);
        expect(res.error).toContain('Invalid trip schema');
      });
    });

    it('resets trip to default data', () => {
      const { result } = renderHook(() => useTripData());

      act(() => {
        result.current.updateTripMetadata({ title: 'Temporary Title' });
        result.current.deleteLeg('seoul');
      });

      expect(result.current.trip.title).toBe('Temporary Title');
      expect(result.current.trip.legs.some((l) => l.id === 'seoul')).toBe(false);

      act(() => {
        result.current.resetToDefault();
      });

      expect(result.current.trip.title).toBe(initialTripData.title);
      expect(result.current.trip.legs.some((l) => l.id === 'seoul')).toBe(true);
    });
  });
});

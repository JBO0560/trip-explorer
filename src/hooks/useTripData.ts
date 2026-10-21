import { useState, useEffect, useCallback } from 'react';
import { TripData, TripLeg, TransferConnection, ActivityPOI, TripStatus } from '../types/trip';
import { initialTripData } from '../data/initialTrip';

export const TRIP_STORAGE_KEY = 'trip_explorer_data';

export interface UseTripDataReturn {
  trip: TripData;
  // Trip metadata
  updateTripMetadata: (updates: Partial<Pick<TripData, 'title' | 'status' | 'overallDateRange' | 'travelers' | 'notes'>>) => void;
  setTripStatus: (status: TripStatus) => void;

  // Legs management
  addLeg: (leg: TripLeg, insertAtIndex?: number) => void;
  updateLeg: (legId: string, updates: Partial<TripLeg>) => void;
  deleteLeg: (legId: string) => void;
  reorderLegs: (sourceIndex: number, destinationIndex: number) => void;

  // Transfers management
  addTransfer: (transfer: TransferConnection) => void;
  updateTransfer: (transferId: string, updates: Partial<TransferConnection>) => void;
  deleteTransfer: (transferId: string) => void;
  toggleTransferStatus: (transferId: string) => void;

  // POIs (Activities) management for a specific leg
  addPOI: (legId: string, poi: ActivityPOI) => void;
  updatePOI: (legId: string, poiId: string, updates: Partial<ActivityPOI>) => void;
  deletePOI: (legId: string, poiId: string) => void;

  // Lifecycle & Persistence
  resetToDefault: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => { success: boolean; error?: string };
}

function loadInitialTrip(): TripData {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialTripData;
  }
  try {
    const saved = localStorage.getItem(TRIP_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.legs) && Array.isArray(parsed.transfers)) {
        // If the saved trip does not include the Hamburg departure or the Sydney leg, load the updated initial trip
        const hasHamburg = parsed.legs.some((l: TripLeg) => l.id === 'hamburg');
        const hasSydney = parsed.legs.some((l: TripLeg) => l.id === 'sydney');
        const hasDurationOnTransfers = parsed.transfers.some((t: TransferConnection) => t.duration);
        if (!hasHamburg || !hasSydney || !hasDurationOnTransfers) {
          return initialTripData;
        }
        return parsed as TripData;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved trip from localStorage:', e);
  }
  return initialTripData;
}

export function useTripData(): UseTripDataReturn {
  const [trip, setTrip] = useState<TripData>(loadInitialTrip);

  // Sync state changes into localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip));
    } catch (e) {
      console.error('Failed to persist trip data to localStorage:', e);
    }
  }, [trip]);

  // Update trip metadata
  const updateTripMetadata = useCallback(
    (updates: Partial<Pick<TripData, 'title' | 'status' | 'overallDateRange' | 'travelers' | 'notes'>>) => {
      setTrip((prev) => ({
        ...prev,
        ...updates
      }));
    },
    []
  );

  const setTripStatus = useCallback((status: TripStatus) => {
    setTrip((prev) => ({
      ...prev,
      status
    }));
  }, []);

  // Legs management
  const addLeg = useCallback((newLeg: TripLeg, insertAtIndex?: number) => {
    setTrip((prev) => {
      const updatedLegs = [...prev.legs];
      if (typeof insertAtIndex === 'number' && insertAtIndex >= 0 && insertAtIndex <= updatedLegs.length) {
        updatedLegs.splice(insertAtIndex, 0, newLeg);
      } else {
        updatedLegs.push(newLeg);
      }
      return {
        ...prev,
        legs: updatedLegs
      };
    });
  }, []);

  const updateLeg = useCallback((legId: string, updates: Partial<TripLeg>) => {
    setTrip((prev) => ({
      ...prev,
      legs: prev.legs.map((leg) => (leg.id === legId ? { ...leg, ...updates } : leg))
    }));
  }, []);

  const deleteLeg = useCallback((legId: string) => {
    setTrip((prev) => ({
      ...prev,
      legs: prev.legs.filter((leg) => leg.id !== legId),
      // Automatically clean up transfers connected to this deleted leg
      transfers: prev.transfers.filter((t) => t.fromLegId !== legId && t.toLegId !== legId)
    }));
  }, []);

  const reorderLegs = useCallback((sourceIndex: number, destinationIndex: number) => {
    setTrip((prev) => {
      if (
        sourceIndex < 0 ||
        sourceIndex >= prev.legs.length ||
        destinationIndex < 0 ||
        destinationIndex >= prev.legs.length
      ) {
        return prev;
      }
      const updatedLegs = [...prev.legs];
      const [moved] = updatedLegs.splice(sourceIndex, 1);
      updatedLegs.splice(destinationIndex, 0, moved);
      return {
        ...prev,
        legs: updatedLegs
      };
    });
  }, []);

  // Transfers management
  const addTransfer = useCallback((transfer: TransferConnection) => {
    setTrip((prev) => ({
      ...prev,
      transfers: [...prev.transfers, transfer]
    }));
  }, []);

  const updateTransfer = useCallback((transferId: string, updates: Partial<TransferConnection>) => {
    setTrip((prev) => ({
      ...prev,
      transfers: prev.transfers.map((t) => (t.id === transferId ? { ...t, ...updates } : t))
    }));
  }, []);

  const deleteTransfer = useCallback((transferId: string) => {
    setTrip((prev) => ({
      ...prev,
      transfers: prev.transfers.filter((t) => t.id !== transferId)
    }));
  }, []);

  const toggleTransferStatus = useCallback((transferId: string) => {
    setTrip((prev) => ({
      ...prev,
      transfers: prev.transfers.map((t) => {
        if (t.id === transferId) {
          const nextStatus = t.status === 'confirmed' ? 'tentative' : 'confirmed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    }));
  }, []);

  // POIs (Activities) management
  const addPOI = useCallback((legId: string, poi: ActivityPOI) => {
    setTrip((prev) => ({
      ...prev,
      legs: prev.legs.map((leg) => {
        if (leg.id === legId) {
          return {
            ...leg,
            activities: [...(leg.activities || []), poi]
          };
        }
        return leg;
      })
    }));
  }, []);

  const updatePOI = useCallback((legId: string, poiId: string, updates: Partial<ActivityPOI>) => {
    setTrip((prev) => ({
      ...prev,
      legs: prev.legs.map((leg) => {
        if (leg.id === legId) {
          return {
            ...leg,
            activities: (leg.activities || []).map((poi) =>
              poi.id === poiId ? { ...poi, ...updates } : poi
            )
          };
        }
        return leg;
      })
    }));
  }, []);

  const deletePOI = useCallback((legId: string, poiId: string) => {
    setTrip((prev) => ({
      ...prev,
      legs: prev.legs.map((leg) => {
        if (leg.id === legId) {
          return {
            ...leg,
            activities: (leg.activities || []).filter((poi) => poi.id !== poiId)
          };
        }
        return leg;
      })
    }));
  }, []);

  // Lifecycle
  const resetToDefault = useCallback(() => {
    setTrip(initialTripData);
    try {
      localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(initialTripData));
    } catch (e) {
      console.error('Failed to reset trip data in localStorage:', e);
    }
  }, []);

  const exportJSON = useCallback((): string => {
    return JSON.stringify(trip, null, 2);
  }, [trip]);

  const importJSON = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON payload: expected an object' };
      }
      if (!Array.isArray(parsed.legs)) {
        return { success: false, error: 'Invalid trip schema: missing or non-array "legs"' };
      }
      if (!Array.isArray(parsed.transfers)) {
        return { success: false, error: 'Invalid trip schema: missing or non-array "transfers"' };
      }

      // Basic sanity validation of legs
      for (const leg of parsed.legs) {
        if (!leg.id || !leg.name) {
          return { success: false, error: `Invalid leg entry: missing id or name (${JSON.stringify(leg)})` };
        }
      }

      setTrip(parsed as TripData);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `JSON Parse error: ${message}` };
    }
  }, []);

  return {
    trip,
    updateTripMetadata,
    setTripStatus,
    addLeg,
    updateLeg,
    deleteLeg,
    reorderLegs,
    addTransfer,
    updateTransfer,
    deleteTransfer,
    toggleTransferStatus,
    addPOI,
    updatePOI,
    deletePOI,
    resetToDefault,
    exportJSON,
    importJSON
  };
}

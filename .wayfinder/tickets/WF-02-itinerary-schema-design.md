---
id: WF-02
title: "Trip & Itinerary Schema Design"
type: "grilling"
status: "closed"
assigned_to: "jasperboyn"
blocked_by: []
labels: ["wayfinder:schema", "wayfinder:lifecycle"]
---

## Question

How should the data schema be structured to handle the lifecycle of the trip: transitioning seamlessly from rough tentative date ranges (e.g. "Spring ~2 weeks", "Seoul ~4 days") to exact dates and confirmed flight/train numbers, and how should it persist locally?

## Resolution Summary

1. **Schema Enhancements (`src/types/trip.ts`)**:
   - `TripData`: Supports overall trip status (`tentative` | `confirmed`), title, `overallDateRange` string, traveler list, legs, transfers, and general notes.
   - `TripLeg`: Supports both approximate days (`approxDays`) and optional exact dates (`startDate`, `endDate`), geo coordinates `[lat, lng]`, highlights list, accommodation details (`AccommodationInfo` with name, address, notes, booking reference), and custom points of interest (`ActivityPOI[]`).
   - `TransferConnection`: Supports transit types (`flight`, `train`, `ferry`, `bus`, `other`) and status toggling (`tentative` | `confirmed`). Includes rich booking metadata for confirmed transfers: `carrier`, `transitCode` (flight/train number), `departureTime`, `arrivalTime`, `departureTerminal`, `arrivalTerminal`, `seatNotes`, and `bookingReference`.
   - `ActivityPOI`: Categorized places with notes, coordinates, addresses, and optional URLs.

2. **State Management & Lifecycle (`src/hooks/useTripData.ts`)**:
   - React hook `useTripData()` managing complete itinerary lifecycle.
   - Functions provided:
     - `updateTripMetadata` / `setTripStatus`
     - `addLeg` / `updateLeg` / `deleteLeg` (with automatic cleanup of connected transfers) / `reorderLegs`
     - `addTransfer` / `updateTransfer` / `deleteTransfer` / `toggleTransferStatus`
     - `addPOI` / `updatePOI` / `deletePOI`
     - `resetToDefault` / `exportJSON` / `importJSON` (with schema validation)
     - Automatic persistence and hydration to/from `localStorage` under key `trip_explorer_data`.

3. **Verification & Tests**:
   - Comprehensive test suite in `src/hooks/useTripData.test.ts` covering all lifecycle events, leg additions/reordering/deletions, transfer toggling, POI CRUD, export/import validation, and default resets.
   - 100% passing tests via `vitest` / `bun run test`.
   - Zero TypeScript errors on `bun run build`.

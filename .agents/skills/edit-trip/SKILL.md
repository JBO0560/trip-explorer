---
name: edit-trip
description: Add, update, reorder, or remove trip stops (legs), activities (POIs), accommodations, and transit transfers (flights, trains, ferries) in the Trip Explorer itinerary.
---

# Edit Trip Skill

Use this workflow to add a new stop (leg), edit existing stops, or update transit connections (flights, trains, ferries) in the Trip Explorer codebase.

Consult [`references/schema-cheatsheet.md`](references/schema-cheatsheet.md) for data schemas, templates, and coordinates.

---

## Workflow Steps

### 1. Survey Current Itinerary
Run the validation helper to view the current list of legs, transfers, and IDs:
```bash
bun .agents/skills/edit-trip/scripts/validate-trip.ts
```

### 2. Update Itinerary Data
Open [`src/data/initialTrip.ts`](../../../src/data/initialTrip.ts).

#### A. When Adding a New Stop (Leg)
- Add a new `TripLeg` object to the `legs` array.
- **Required fields**:
  - `id`: Unique kebab-case slug (e.g. `'sydney'`, `'fukuoka'`).
  - `name`: Display name (e.g. `'Sydney'`).
  - `country`: Country name (e.g. `'Australia'`, `'Japan'`).
  - `approxDays`: Approximate length of stay in days.
  - `coordinates`: `[latitude, longitude]` in decimal degrees (e.g. `[-33.8688, 151.2093]`).
  - `highlights`: Array of 2–4 prominent highlights.
  - `activities`: Array of `ActivityPOI` objects with categories (`culture`, `food`, `nature`, `nightlife`, `shopping`, `stay`, `other`).
  - `accommodation`: Object with `name` and optional `notes`/`bookingRef`.

#### B. When Adding or Updating a Transit Connection (Transfer)
- Add or modify a `TransferConnection` in `initialTripData.transfers`.
- **Integrity requirement**: Both `fromLegId` and `toLegId` must match an existing `leg.id`.
- **Fields**:
  - `id`: Unique identifier (e.g. `'t-tokyo-sydney'`).
  - `type`: `'flight' | 'train' | 'ferry' | 'bus' | 'other'`.
  - `status`: `'tentative' | 'confirmed'`.
  - `carrier`: Airline or train operator (e.g. `'Qantas Airways'`, `'JR Central'`).
  - `transitCode`: **Flight or train number** (e.g. `'QF60'`, `'BX124'`, `'Nozomi 24'`).
  - `departureTime`: Departure date/time string (e.g. `'2027-01-07 22:00'`).
  - `arrivalTime`: Arrival date/time string (e.g. `'2027-01-08 09:55'`).
  - `departureTerminal` / `arrivalTerminal`: Terminals (e.g. `'HND Terminal 3'`, `'SYD Terminal 1'`).
  - `duration`: Travel time (e.g. `'15h 50m (total incl. layover)'`, `'9h 55m (non-stop)'`). Rendered prominently in the sidebar timeline card and export snapshots.
  - `seatNotes`: Cabin class, seating notes, or aircraft type.
  - `bookingReference`: Airline PNR / confirmation code (e.g. `'ABC123'`).
  - `notes`: Summary description shown in route lists.
  - `layover`: Optional layover details `{ city, airportCode, duration, coordinates: [lat, lng], notes }`. When `coordinates` are provided, the interactive flight arc automatically routes via the layover waypoint!
  - `segments`: Optional array of individual legs `{ carrier, transitCode, from, to, departureTime, arrivalTime }` for multi-flight connections.

---

### 3. Country Flags & Badges (If Adding a New Country)
If the new stop introduces a country not yet configured:
1. Open [`src/components/TripMap.tsx`](../../../src/components/TripMap.tsx) and add the country flag in `createLegIcon`:
   ```typescript
   else if (leg.country.toLowerCase().includes('taiwan')) {
     flag = '🇹🇼';
     badgeColor = 'bg-teal-600';
   }
   ```
2. Open [`src/components/WhatsAppSnapshotModal.tsx`](../../../src/components/WhatsAppSnapshotModal.tsx):
   - Add the country to `countryBadges` (around line 56).
   - Add the flag in the City Deep-Dive badge (around line 360).

---

### 4. Client Cache Compatibility
If editing default starter stops in `initialTripData`, ensure [`src/hooks/useTripData.ts`](../../../src/hooks/useTripData.ts) handles local storage updates gracefully in `loadInitialTrip()` so previously cached browser sessions load the new stops.

---

### 5. Verification & Tests
Always run the validation script and tests to verify data integrity:

```bash
bun .agents/skills/edit-trip/scripts/validate-trip.ts
bun run test
bun run build
```

**Completion Criteria**:
- `validate-trip.ts` passes with 0 errors.
- Vitest suite passes all tests.
- TypeScript build succeeds with no type errors.

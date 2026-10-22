# Glossary

## Trip
A single continuous journey consisting of metadata (title, dates, travelers, notes), an ordered sequence of Legs and Transfers, and overall packing / itinerary configuration.

## Leg
A multi-day or single-day stay anchored at a primary geographical base (e.g. "Seoul", "Busan", "Tokyo", "Kyoto"). Contains a date range (tentative or fixed), accommodation status, and a list of Points of Interest (POIs) or daily agenda notes.

## Transfer
A transit connection linking two consecutive Legs or entering/exiting the trip (e.g., International flight into Incheon, KTX bullet train, Korea-to-Japan flight or ferry, Shinkansen, return flight).
- **Status**: Can be either `tentative` (estimated travel window, rough target dates) or `confirmed` (with exact carrier, flight/train number, departure/arrival timestamps, terminal).

## Point of Interest (POI)
A specific place, activity, restaurant, or sightseeing spot pinned to a geographical coordinate `[lat, lng]` within or around a Leg, optionally tagged with categories (e.g. Food, Culture, Shopping, Nature) and visit priority.

## Country Meta & Global Flags (`getCountryMeta`)
The centralized geographic resolver in [`src/utils/countryFlags.ts`](file:///Users/jasperboyn/git/trip-explorer/src/utils/countryFlags.ts) that maps country names, 2-letter ISO codes (e.g. `FR`, `JP`), 3-letter codes (e.g. `DEU`, `AUS`), and common aliases (`USA`, `UK`, `Korea`) to:
- **`flag`**: Unicode regional indicator emoji (e.g. 🇩🇪, 🇯🇵, 🇰🇷, 🇦🇺, 🇫🇷). Covers all 250+ ISO 3166-1 nations and territories with a fallback to `🌏`.
- **`badgeColor`**: Deterministic Tailwind background color accent (e.g. `bg-rose-500`, `bg-emerald-600`) for map pin badges and route chips.
- **`isoCode`**: Canonical 2-letter ISO code if resolved.

**How to use:**
Call `getCountryMeta(leg.country)` across map pins ([`TripMap.tsx`](file:///Users/jasperboyn/git/trip-explorer/src/components/TripMap.tsx)), snapshot cards ([`WhatsAppSnapshotModal.tsx`](file:///Users/jasperboyn/git/trip-explorer/src/components/WhatsAppSnapshotModal.tsx)), or any new itinerary views instead of manual `if/else` checks.

## Snapshot Card
A dedicated presentation view of the map and itinerary styled specifically for export or screenshotting to mobile chat apps (such as WhatsApp). Includes high-contrast labels, legible typography at mobile scale, and a clean summary of key stops and dates.

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

## Snapshot Card
A dedicated presentation view of the map and itinerary styled specifically for export or screenshotting to mobile chat apps (such as WhatsApp). Includes high-contrast labels, legible typography at mobile scale, and a clean summary of key stops and dates.

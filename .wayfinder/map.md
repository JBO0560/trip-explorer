---
title: "Korea & Japan Trip Visualizer & WhatsApp Sharer"
labels: ["wayfinder:map"]
---

## Destination

An interactive local web application to visualize the Korea & Japan trip itinerary across an interactive map (OpenStreetMap/Leaflet, no API keys), supporting tentative dates and transfers (which can later be enriched with confirmed flights/trains), with clean snapshot card views easily screenshotable or exportable to WhatsApp chats.

## Notes

- **Domain**: Travel itinerary visualization, geospatial mapping, mobile-friendly sharing cards.
- **Skills to consult**: `wayfinder`, `domain-modeling`, `frontend-design`, `generative_ui`.
- **Standing preferences**: Zero external API keys (free OpenStreetMap tiles), purely local web app, high mobile legibility for screenshots/WhatsApp sharing, lightweight setup (Vite + React + Tailwind or vanilla web).

## Decisions so far

<!-- the index: one line per closed ticket, enough to judge relevance, then zoom the link for the detail the ticket holds -->
- [WF-01: Tech Stack & Frontend Architecture Selection](file:///Users/jasperboyn/git/poe2-profits/korea&japan%20trip/.wayfinder/tickets/WF-01-tech-stack-and-architecture.md): Settle on Vite + React 19 + TypeScript + Tailwind v4 + Leaflet + Vitest; initialized repo and pushed to `JBO0560/trip-explorer`.
- [WF-02: Trip & Itinerary Schema Design](file:///Users/jasperboyn/git/poe2-profits/korea&japan%20trip/.wayfinder/tickets/WF-02-itinerary-schema-design.md): Implemented full trip lifecycle state hook `useTripData` with tentative vs confirmed flight/train schemas and 15 passing tests.
- [WF-03: Interactive Map Visualization & Route Styling](file:///Users/jasperboyn/git/poe2-profits/korea&japan%20trip/.wayfinder/tickets/WF-03-interactive-map-visualization.md): Built interactive React Leaflet map with CartoDB Voyager tiles, bezier curved Korea Strait flight arcs, and KTX/Shinkansen railway styling.
- [WF-04: WhatsApp Share Mode & Snapshot Card Layout](file:///Users/jasperboyn/git/poe2-profits/korea&japan%20trip/.wayfinder/tickets/WF-04-whatsapp-snapshot-card-layout.md): Built mobile chat export cards (Full Overview, City Deep-Dive, Transit Schedule) with 1-click clipboard copy and PNG download.

## Not yet specified

<!-- Fog of war: in-scope fog you can't ticket yet; graduates as the frontier advances -->
- Transit line rendering aesthetics (great-circle arcs for flights vs railway polyline approximations between cities)
- Pre-populated starter itinerary (suggested route: Seoul -> Busan -> Fukuoka/Osaka -> Kyoto -> Tokyo)
- Image clipboard copy API vs manual screenshot guide overlay for WhatsApp
- Offline tile caching or static fallback map for zero-connectivity situations

## Out of scope

<!-- Out of scope: work ruled beyond the destination; closed, never graduates -->
- Live flight tracking APIs or automated airline booking scrapers (user inputs tentative or confirmed details manually)
- Multi-user real-time database sync / cloud user authentication accounts

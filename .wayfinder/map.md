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

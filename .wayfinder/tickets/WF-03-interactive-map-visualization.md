---
id: WF-03
title: "Interactive Map Visualization & Route Styling"
type: "prototype"
status: "closed"
assigned_to: "Map-Visualization-Implementer"
blocked_by: ["WF-01", "WF-02"]
labels: ["wayfinder:prototype"]
---

## Question

How should Korea & Japan legs, stops, and transfers be rendered on the Leaflet map (colors, curved flight arcs across the Korea Strait, train links, numbered stop markers) to look gorgeous and instantly readable at a glance?

## Resolution & Implementation

1. **Map Engine & Tile Layer**:
   - Integrated `react-leaflet` with CartoDB Voyager tiles (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`) providing high contrast labels and geographic features for South Korea, the Sea of Japan / East Sea, and Japan.
   - Initial center bounds and auto-panning via `MapController` (`useMap`) that smoothly flies to active legs on selection or fits entire route bounds.

2. **Custom Stop Markers**:
   - Numbered circular badges (`1, 2, 3, 4`) indicating route sequence.
   - Country flag badges (`🇰🇷 Korea`, `🇯🇵 Japan`) with distinct accent rings.
   - Interactive popups with leg duration, highlights, and focus action.

3. **Route & Transfer Styling**:
   - **High-Speed Rail**: Styled dashed polylines connecting Seoul-Busan (Amber `#f59e0b` for KTX) and Osaka-Tokyo (Indigo `#6366f1` for Tokaido Shinkansen) with tooltips and click-to-select interaction.
   - **Korea Strait Flight Arc**: Quadratic Bezier calculation (`getCurvedFlightPath` in `src/components/geoUtils.ts`) creating a smooth arched flight route from Busan (PUS) to Osaka/Kyoto (KIX) across the Korea Strait, complete with an interactive mid-point flight badge (`✈️ Korea Strait`).

4. **POI Support**:
   - Sub-activity / POI markers rendered as glowing circle markers when the selected leg contains coordinates.

5. **Testing & Integration**:
   - Unit tests added in `src/components/TripMap.test.ts` verifying bezier arc generation and midpoint northward curvature.
   - Cleanly integrated into `src/App.tsx` with a floating leg summary overlay and zero build/typecheck errors.

---
id: WF-01
title: "Tech Stack & Frontend Architecture Selection"
type: "prototype"
status: "closed"
assigned_to: "jasperboyn"
blocked_by: []
labels: ["wayfinder:prototype"]
---

## Question

Which minimal frontend setup (e.g. Vite + React + Tailwind + Leaflet/React-Leaflet vs single-file SPA) provides the fastest zero-config dev environment, smooth map rendering without API keys, and cleanest DOM export styling for screenshots?

## Resolution

Selected **Vite + React 19 + TypeScript + Tailwind CSS v4 + Leaflet & React-Leaflet + Lucide Icons + Vitest**.
- Zero external API keys needed (using OpenStreetMap).
- Fast local development with instant HMR and quick tests.
- Repository set up and pushed to `https://github.com/JBO0560/trip-explorer.git`.


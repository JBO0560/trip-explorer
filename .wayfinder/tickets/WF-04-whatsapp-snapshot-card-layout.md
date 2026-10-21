---
id: WF-04
title: "WhatsApp Share Mode & Snapshot Card Layout"
type: "prototype"
status: "closed"
assigned_to: "jasperboyn"
blocked_by: ["WF-01", "WF-03"]
labels: ["wayfinder:prototype"]
---

## Question

How should the dedicated "Share / Screenshot View" be framed and formatted (dimensions, typography, contrast, map aspect ratio, summary legend) so that taking a quick screenshot produces a clean, high-impact card ready for WhatsApp chat viewing on mobile?

## Resolution Summary

Implemented a dedicated WhatsApp Snapshot Card modal component (`src/components/WhatsAppSnapshotModal.tsx`) engineered specifically for crisp, high-impact chat sharing with both 1-click clipboard copy and PNG download.

### 1. Preset Snapshot Card Views
- **Full Route Overview**: Shows Korea & Japan flag badges (`🇰🇷 🇯🇵`), overall date window, high-level duration metrics (`Total Days`, `Destinations`, `Travelers`), and a chronological stop-by-stop route timeline with days per leg, key highlights, and transit connectors (KTX, flights, Shinkansen).
- **Single Leg / City Deep-Dive**: Focused card for any individual leg (with city dropdown selector), displaying country badge, stay duration, accommodation details & booking reference, highlighted spots, and planned POI activities.
- **Transit & Flights Schedule**: Dedicated logistics card outlining intercity transfers in chronological sequence, carrier name, flight/train code badges (e.g. `KTX 021`, `BX124`, `Nozomi 24`), notes, seat reservations, and status badges (`confirmed` vs `tentative`).

### 2. High Mobile Readability & Contrast
- Compact mobile chat bubble aspect ratio (~420px max width) with deep midnight navy background gradient (`#0e1626` to `#090d16`), vibrant top gradient border accent (`rose -> indigo -> emerald`), and high-contrast typography designed for instant clarity on small mobile screens.
- Clean pill tags and monospace transit codes for instant scanning in WhatsApp media viewers.

### 3. 1-Click Export Pipeline
- **Copy Image to Clipboard**: Uses `html-to-image` `toBlob` at 2.5x pixel ratio (high-DPI retina rendering) and writes directly to `navigator.clipboard` using `ClipboardItem('image/png')` with animated feedback state ("Copied Image!").
- **Download Image (PNG)**: Fallback direct download link triggering a named PNG export (`whatsapp-trip-<mode>-card.png`).

### 4. Verification & Testing
- Unit tests written in `src/components/WhatsAppSnapshotModal.test.tsx` verifying:
  - Default modal rendering in Full Route Overview mode.
  - Interactive mode switching between Overview, City Deep-Dive, and Transit views.
  - Leg selector updating deep-dive card content.
  - 1-click clipboard copy invocation and feedback banner.
  - 1-click PNG download fallback.
  - Modal close triggering.
- Ran test suite: `vitest run` passed (26/26 tests passing across all suites).
- Built project: `tsc -b && vite build` completed cleanly without errors.

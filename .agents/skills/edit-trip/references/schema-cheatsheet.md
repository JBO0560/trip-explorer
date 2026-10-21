# Trip Explorer Schema & Cheatsheet

Use this reference when editing [src/data/initialTrip.ts](../../../src/data/initialTrip.ts) or related components.

---

## 1. Stop / Leg Template (`TripLeg`)

```typescript
{
  id: 'unique-city-slug',        // e.g. 'sydney', 'fukuoka', 'taipei'
  name: 'City Name',             // Display title (e.g. 'Sydney', 'Kyoto & Osaka')
  country: 'Country',            // e.g. 'Japan', 'Korea', 'Australia', 'Taiwan'
  approxDays: 4,                 // Integer approximate days
  coordinates: [lat, lng],       // [Latitude, Longitude] in decimal degrees
  highlights: [
    'Primary Highlight 1',
    'Primary Highlight 2'
  ],
  activities: [
    {
      id: 'poi-city-1',
      name: 'Activity / Spot Name',
      category: 'culture',       // 'food' | 'culture' | 'shopping' | 'nature' | 'nightlife' | 'stay' | 'other'
      notes: 'Helpful context or tip',
      coordinate: [lat, lng]     // Optional precise pin
    }
  ],
  accommodation: {
    name: 'Hotel Name / District Base',
    notes: 'Booking details or location rationale'
  }
}
```

---

## 2. Transfer Template (`TransferConnection`)

### Flight Transfer (Direct)
```typescript
{
  id: 't-tokyo-sydney',
  fromLegId: 'tokyo',
  toLegId: 'sydney',
  type: 'flight',                // 'flight' | 'train' | 'ferry' | 'bus' | 'other'
  status: 'confirmed',           // 'tentative' | 'confirmed'
  notes: 'Direct overnight flight (~9.5h) • Departs Jan 7',
  carrier: 'Qantas Airways',
  transitCode: 'QF60',           // Flight number
  departureTime: '2027-01-07 22:00', // YYYY-MM-DD HH:mm or Jan 7
  arrivalTime: '2027-01-08 09:55',
  departureTerminal: 'HND Terminal 3',
  arrivalTerminal: 'SYD Terminal 1',
  duration: '9h 55m (non-stop)', // Displayed prominently in sidebar timeline and snapshot cards
  seatNotes: 'Overnight long-haul (Boeing 787-9)',
  bookingReference: '6-letter PNR (e.g. ABC123)'
}
```

### Flight Transfer with Layover & Segments
```typescript
{
  id: 't-tokyo-sydney-layover',
  fromLegId: 'tokyo',
  toLegId: 'sydney',
  type: 'flight',
  status: 'confirmed',
  notes: '1 stop via Singapore (2h 45m layover)',
  carrier: 'Singapore Airlines',
  transitCode: 'SQ635 / SQ231',
  departureTime: '2027-01-07 22:55',
  arrivalTime: '2027-01-08 14:10',
  duration: '15h 15m (total incl. layover)', // Displayed prominently in timeline header
  bookingReference: 'XYZ789',
  layover: {
    city: 'Singapore',
    airportCode: 'SIN',
    duration: '2h 45m',
    coordinates: [1.3644, 103.9915], // Automatically routes flight arc via waypoint on map!
    notes: 'Terminal 3 transit / Jewel visit'
  },
  segments: [
    {
      carrier: 'Singapore Airlines',
      transitCode: 'SQ635',
      from: 'Tokyo (HND)',
      to: 'Singapore (SIN)',
      departureTime: '22:55',
      arrivalTime: '05:15 (+1)'
    },
    {
      carrier: 'Singapore Airlines',
      transitCode: 'SQ231',
      from: 'Singapore (SIN)',
      to: 'Sydney (SYD)',
      departureTime: '08:00',
      arrivalTime: '14:10'
    }
  ]
}
```

### High-Speed Rail Transfer
```typescript
{
  id: 't-shinkansen',
  fromLegId: 'osaka-kyoto',
  toLegId: 'tokyo',
  type: 'train',
  status: 'tentative',
  notes: 'Tokaido Shinkansen bullet train (~2h 15m)',
  carrier: 'JR Central',
  transitCode: 'Nozomi 24',
  seatNotes: 'Mount Fuji side (Seat E on right heading Tokyo)'
}
```

---

## 3. Country Flag & Badge Support

When introducing a new country, verify flag mappings in:
1. `src/components/TripMap.tsx` -> `createLegIcon`:
   ```typescript
   if (country.includes('korea')) flag = '🇰🇷';
   else if (country.includes('japan')) flag = '🇯🇵';
   else if (country.includes('australia')) flag = '🇦🇺';
   ```
2. `src/components/WhatsAppSnapshotModal.tsx` -> `countryBadges` and Deep-Dive badge.

---

## 4. Popular Coordinates Quick Reference

| City / Hub | Country | Coordinates `[lat, lng]` |
| :--- | :--- | :--- |
| **Seoul** | Korea | `[37.5665, 126.9780]` |
| **Busan** | Korea | `[35.1796, 129.0756]` |
| **Jeju Island** | Korea | `[33.4996, 126.5312]` |
| **Kyoto** | Japan | `[35.0116, 135.7681]` |
| **Osaka** | Japan | `[34.6937, 135.5023]` |
| **Tokyo** | Japan | `[35.6762, 139.6503]` |
| **Fukuoka** | Japan | `[33.5902, 130.4017]` |
| **Sapporo / Hokkaido** | Japan | `[43.0618, 141.3545]` |
| **Sydney** | Australia | `[-33.8688, 151.2093]` |
| **Melbourne** | Australia | `[-37.8136, 144.9631]` |
| **Taipei** | Taiwan | `[25.0330, 121.5654]` |
| **Singapore** | Singapore | `[1.3521, 103.8198]` |
| **Bangkok** | Thailand | `[13.7563, 100.5018]` |

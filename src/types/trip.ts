export type TripStatus = 'tentative' | 'confirmed';
export type TransferType = 'flight' | 'train' | 'ferry' | 'bus' | 'other';
export type TransferStatus = 'tentative' | 'confirmed';
export type POICategory = 'food' | 'culture' | 'shopping' | 'nature' | 'nightlife' | 'stay' | 'other';

export interface LocationCoordinate {
  lat: number;
  lng: number;
  name?: string;
}

export interface ActivityPOI {
  id: string;
  name: string;
  category?: POICategory;
  notes?: string;
  coordinate?: [number, number];
  address?: string;
  url?: string;
}

export interface AccommodationInfo {
  name?: string;
  address?: string;
  bookingRef?: string;
  checkInDate?: string;
  checkOutDate?: string;
  notes?: string;
  coordinate?: [number, number];
}

export interface TripLeg {
  id: string;
  name: string;
  country: 'Korea' | 'Japan' | string;
  approxDays: number;
  startDate?: string;
  endDate?: string;
  coordinates: [number, number];
  highlights: string[];
  activities: ActivityPOI[];
  accommodation?: AccommodationInfo;
  notes?: string;
}

export interface TransitSegment {
  carrier?: string;
  transitCode?: string; // e.g. "SQ635", "JL723"
  from: string; // e.g. "Tokyo (HND)" or "HND"
  to: string; // e.g. "Singapore (SIN)" or "SIN"
  departureTime?: string;
  arrivalTime?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  duration?: string; // e.g. "15h 50m total", "2h 30m"
  seatNotes?: string;
}

export interface LayoverInfo {
  city?: string; // e.g. "Singapore", "Cairns", "Bangkok"
  airportCode?: string; // e.g. "SIN", "CNS", "BKK"
  duration?: string; // e.g. "2h 30m"
  coordinates?: [number, number]; // [lat, lng] for routing the flight arc through the layover waypoint
  notes?: string;
}

export interface TransferConnection {
  id: string;
  fromLegId: string;
  toLegId: string;
  type: TransferType;
  status: TransferStatus;
  notes?: string;
  // Confirmed booking details
  carrier?: string;
  transitCode?: string; // e.g. "OZ1045", "KE703", or "Shinkansen Nozomi 23"
  departureTime?: string; // ISO date-time or time string "YYYY-MM-DD HH:mm" or "14:30"
  arrivalTime?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  duration?: string; // e.g. "15h 50m total", "2h 30m"
  seatNotes?: string;
  bookingReference?: string;
  // Layover & multi-segment transit details
  layover?: LayoverInfo;
  segments?: TransitSegment[];
}

export interface TripData {
  title: string;
  status: TripStatus;
  overallDateRange: string;
  travelers: string[];
  legs: TripLeg[];
  transfers: TransferConnection[];
  notes?: string;
}

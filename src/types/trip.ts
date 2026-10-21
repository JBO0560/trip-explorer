export interface LocationCoordinate {
  lat: number;
  lng: number;
  name: string;
}

export interface ActivityPOI {
  id: string;
  name: string;
  category?: 'food' | 'culture' | 'shopping' | 'nature' | 'nightlife';
  notes?: string;
  coordinate?: [number, number];
}

export interface TripLeg {
  id: string;
  name: string;
  country: 'Korea' | 'Japan';
  approxDays: number;
  startDate?: string;
  endDate?: string;
  coordinates: [number, number];
  highlights: string[];
  activities: ActivityPOI[];
}

export interface TransferConnection {
  id: string;
  fromLegId: string;
  toLegId: string;
  type: 'flight' | 'train' | 'ferry';
  status: 'tentative' | 'confirmed';
  notes?: string;
  carrier?: string;
  transitCode?: string; // e.g. "OZ1045" or "Shinkansen Nozomi"
  departureTime?: string;
  arrivalTime?: string;
}

export interface TripData {
  title: string;
  status: 'tentative' | 'confirmed';
  overallDateRange: string;
  travelers: string[];
  legs: TripLeg[];
  transfers: TransferConnection[];
}

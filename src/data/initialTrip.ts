import { TripData } from '../types/trip';

export const initialTripData: TripData = {
  title: 'Korea & Japan Discovery',
  status: 'tentative',
  overallDateRange: 'Spring 2027 (Approx. 20-22 Days)',
  travelers: ['Jasper & Friends'],
  legs: [
    {
      id: 'hamburg',
      name: 'Hamburg',
      country: 'Germany',
      approxDays: 1,
      coordinates: [53.5511, 9.9937],
      highlights: ['Elbphilharmonie', 'Speicherstadt', 'Departure Base'],
      activities: [],
      notes: 'Trip starting point / departure from Hamburg Airport (HAM).'
    },
    {
      id: 'seoul',
      name: 'Seoul',
      country: 'Korea',
      approxDays: 5,
      coordinates: [37.5665, 126.978],
      highlights: ['Bukchon Hanok Village', 'Hongdae Nightlife', 'Gyeongbokgung Palace', 'Myeongdong Street Food'],
      activities: [
        {
          id: 'poi-seoul-1',
          name: 'Gyeongbokgung Palace',
          category: 'culture',
          notes: 'Traditional royal guard changing ceremony at 10am and 2pm.',
          coordinate: [37.5796, 126.977]
        },
        {
          id: 'poi-seoul-2',
          name: 'Hongdae Street Market & Busking',
          category: 'nightlife',
          notes: 'Vibrant evening energy, youth fashion, and street food.',
          coordinate: [37.5563, 126.922]
        }
      ],
      accommodation: {
        name: 'Ryse Hotel Hongdae',
        notes: 'Stylish modern base in the center of Hongdae arts district.'
      }
    },
    {
      id: 'busan',
      name: 'Busan',
      country: 'Korea',
      approxDays: 3,
      coordinates: [35.1796, 129.0756],
      highlights: ['Haeundae Beach', 'Gamcheon Culture Village', 'Jagalchi Seafood Market'],
      activities: [
        {
          id: 'poi-busan-1',
          name: 'Gamcheon Culture Village',
          category: 'culture',
          notes: 'Colorful coastal hillside village with alleys, cafes and art.',
          coordinate: [35.0975, 129.0106]
        },
        {
          id: 'poi-busan-2',
          name: 'Jagalchi Fish Market',
          category: 'food',
          notes: 'Fresh sashimi and seafood stalls on the harbor.',
          coordinate: [35.0968, 129.0306]
        }
      ],
      accommodation: {
        name: 'Signiel Busan (Haeundae)',
        notes: 'Ocean view luxury stay overlooking Haeundae Beach.'
      }
    },
    {
      id: 'osaka-kyoto',
      name: 'Kyoto & Osaka',
      country: 'Japan',
      approxDays: 5,
      coordinates: [35.0116, 135.7681],
      highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Dotonbori Street Food', 'Gion District'],
      activities: [
        {
          id: 'poi-kyoto-1',
          name: 'Fushimi Inari Taisha',
          category: 'culture',
          notes: 'Early morning hike through the thousands of vermilion torii gates.',
          coordinate: [34.9671, 135.7727]
        },
        {
          id: 'poi-osaka-1',
          name: 'Dotonbori Canal & Glico Man',
          category: 'food',
          notes: 'Takoyaki, okonomiyaki, and neon nightlife.',
          coordinate: [34.6687, 135.5013]
        }
      ],
      accommodation: {
        name: 'Traditional Machiya Townhouse (Kyoto)',
        notes: 'Historic wooden townhouse near Gion with private courtyard garden.'
      }
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      approxDays: 6,
      coordinates: [35.6762, 139.6503],
      highlights: ['Shinjuku & Shibuya Crossing', 'Akihabara', 'Senso-ji Temple', 'TeamLab Planets'],
      activities: [
        {
          id: 'poi-tokyo-1',
          name: 'Shibuya Sky & Scramble Crossing',
          category: 'culture',
          notes: 'Observation deck for panoramic sunset views across Tokyo skyline.',
          coordinate: [35.6585, 139.7013]
        },
        {
          id: 'poi-tokyo-2',
          name: 'TeamLab Planets Toyosu',
          category: 'culture',
          notes: 'Immersive digital art museum walk-through.',
          coordinate: [35.6491, 139.7898]
        }
      ],
      accommodation: {
        name: 'Park Hotel Tokyo / Shinjuku Base',
        notes: 'Convenient transport hub near Yamanote line.'
      }
    },
    {
      id: 'sydney',
      name: 'Sydney',
      country: 'Australia',
      approxDays: 5,
      coordinates: [-33.8688, 151.2093],
      highlights: ['Sydney Opera House', 'Bondi Coastal Walk', 'Sydney Harbour Bridge', 'The Rocks Historic Precinct'],
      activities: [
        {
          id: 'poi-sydney-1',
          name: 'Sydney Opera House & Circular Quay',
          category: 'culture',
          notes: 'Architectural icon tour and harbour promenade.',
          coordinate: [-33.8568, 151.2153]
        },
        {
          id: 'poi-sydney-2',
          name: 'Bondi to Coogee Coastal Walk',
          category: 'nature',
          notes: 'Clifftop ocean walk passing stunning beaches and rockpools.',
          coordinate: [-33.8915, 151.2767]
        }
      ],
      accommodation: {
        name: 'Park Hyatt Sydney / Circular Quay Base',
        notes: 'Harbour-front stay with views of the Opera House and Harbour Bridge.'
      }
    }
  ],
  transfers: [
    {
      id: 't-ham-seoul',
      fromLegId: 'hamburg',
      toLegId: 'seoul',
      type: 'flight',
      status: 'tentative',
      notes: 'Finnair connection via Helsinki (AY1424 & AY041)',
      carrier: 'Finnair',
      transitCode: 'AY1424 / AY041',
      departureTime: '12:30',
      arrivalTime: '11:20 (+1)',
      departureTerminal: 'HAM Terminal 1',
      arrivalTerminal: 'ICN Terminal 1',
      duration: '15h 50m (total incl. layover)',
      seatNotes: 'Overnight connection via Helsinki (HEL)',
      layover: {
        city: 'Helsinki',
        airportCode: 'HEL',
        duration: '2h 10m',
        coordinates: [60.3172, 24.9633],
        notes: 'Layover at Helsinki Vantaa Airport'
      },
      segments: [
        {
          carrier: 'Finnair',
          transitCode: 'AY1424',
          from: 'Hamburg (HAM)',
          to: 'Helsinki (HEL)',
          departureTime: '12:30',
          arrivalTime: '15:20',
          departureTerminal: 'Terminal 1',
          seatNotes: 'Airbus A321 / ~1h 40m'
        },
        {
          carrier: 'Finnair',
          transitCode: 'AY041',
          from: 'Helsinki (HEL)',
          to: 'Seoul Incheon (ICN)',
          departureTime: '17:30',
          arrivalTime: '11:20 (+1)',
          arrivalTerminal: 'Terminal 1',
          seatNotes: 'Airbus A350-900 / ~11h 50m'
        }
      ]
    },
    {
      id: 't-ktx',
      fromLegId: 'seoul',
      toLegId: 'busan',
      type: 'train',
      status: 'tentative',
      notes: 'KTX High Speed Rail (~2.5h)',
      carrier: 'Korail KTX',
      transitCode: 'KTX 021',
      duration: '2h 35m',
      seatNotes: 'First class or reserved standard window'
    },
    {
      id: 't-cross',
      fromLegId: 'busan',
      toLegId: 'osaka-kyoto',
      type: 'flight',
      status: 'tentative',
      notes: 'Short international hop (Busan PUS -> Osaka KIX ~1.5h)',
      carrier: 'Air Busan / Korean Air',
      transitCode: 'BX124',
      departureTerminal: 'PUS Int Terminal',
      arrivalTerminal: 'KIX Terminal 1',
      duration: '1h 30m',
    },
    {
      id: 't-shinkansen',
      fromLegId: 'osaka-kyoto',
      toLegId: 'tokyo',
      type: 'train',
      status: 'tentative',
      notes: 'Tokaido Shinkansen bullet train (~2h 15m)',
      carrier: 'JR Central',
      transitCode: 'Nozomi 24',
      duration: '2h 15m',
      seatNotes: 'Mount Fuji side (Seat E on right heading Tokyo)'
    },
    {
      id: 't-tokyo-sydney',
      fromLegId: 'tokyo',
      toLegId: 'sydney',
      type: 'flight',
      status: 'confirmed',
      notes: 'Direct overnight flight (~9.5h) • Departs Jan 7',
      carrier: 'Qantas Airways',
      transitCode: 'QF60',
      departureTime: '2027-01-07 22:00',
      arrivalTime: '2027-01-08 09:55',
      departureTerminal: 'HND Terminal 3',
      arrivalTerminal: 'SYD Terminal 1',
      duration: '9h 55m (non-stop)',
      seatNotes: 'Overnight long-haul (Boeing 787-9)'
    }
  ]
};

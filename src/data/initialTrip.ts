import { TripData } from '../types/trip';

export const initialTripData: TripData = {
  title: 'Korea & Japan Discovery',
  status: 'tentative',
  overallDateRange: 'Spring 2027 (Approx. 18-20 Days)',
  travelers: ['Jasper & Friends'],
  legs: [
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
    }
  ],
  transfers: [
    {
      id: 't-ktx',
      fromLegId: 'seoul',
      toLegId: 'busan',
      type: 'train',
      status: 'tentative',
      notes: 'KTX High Speed Rail (~2.5h)',
      carrier: 'Korail KTX',
      transitCode: 'KTX 021',
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
      arrivalTerminal: 'KIX Terminal 1'
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
      seatNotes: 'Mount Fuji side (Seat E on right heading Tokyo)'
    }
  ]
};

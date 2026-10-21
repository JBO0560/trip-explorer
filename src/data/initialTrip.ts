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
      activities: []
    },
    {
      id: 'busan',
      name: 'Busan',
      country: 'Korea',
      approxDays: 3,
      coordinates: [35.1796, 129.0756],
      highlights: ['Haeundae Beach', 'Gamcheon Culture Village', 'Jagalchi Seafood Market'],
      activities: []
    },
    {
      id: 'osaka-kyoto',
      name: 'Kyoto & Osaka',
      country: 'Japan',
      approxDays: 5,
      coordinates: [35.0116, 135.7681],
      highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Dotonbori Street Food', 'Gion District'],
      activities: []
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      approxDays: 6,
      coordinates: [35.6762, 139.6503],
      highlights: ['Shinjuku & Shibuya Crossing', 'Akihabara', 'Senso-ji Temple', 'TeamLab Planets'],
      activities: []
    }
  ],
  transfers: [
    {
      id: 't-ktx',
      fromLegId: 'seoul',
      toLegId: 'busan',
      type: 'train',
      status: 'tentative',
      notes: 'KTX High Speed Rail (~2.5h)'
    },
    {
      id: 't-cross',
      fromLegId: 'busan',
      toLegId: 'osaka-kyoto',
      type: 'flight',
      status: 'tentative',
      notes: 'Short international hop (Busan PUS -> Osaka KIX ~1.5h)'
    },
    {
      id: 't-shinkansen',
      fromLegId: 'osaka-kyoto',
      toLegId: 'tokyo',
      type: 'train',
      status: 'tentative',
      notes: 'Tokaido Shinkansen bullet train (~2h 15m)'
    }
  ]
};

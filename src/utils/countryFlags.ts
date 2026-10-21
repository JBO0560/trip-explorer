/**
 * Utility to map country names to flags and badge accent colors.
 * Supports general vacations worldwide with sensible fallbacks.
 */
export interface CountryMeta {
  name: string;
  flag: string;
  badgeColor: string;
}

const COUNTRY_MAP: Record<string, { flag: string; badgeColor: string }> = {
  korea: { flag: '🇰🇷', badgeColor: 'bg-rose-500' },
  'south korea': { flag: '🇰🇷', badgeColor: 'bg-rose-500' },
  japan: { flag: '🇯🇵', badgeColor: 'bg-red-500' },
  australia: { flag: '🇦🇺', badgeColor: 'bg-emerald-600' },
  germany: { flag: '🇩🇪', badgeColor: 'bg-amber-600' },
  france: { flag: '🇫🇷', badgeColor: 'bg-blue-600' },
  italy: { flag: '🇮🇹', badgeColor: 'bg-green-600' },
  spain: { flag: '🇪🇸', badgeColor: 'bg-yellow-600' },
  uk: { flag: '🇬🇧', badgeColor: 'bg-indigo-600' },
  'united kingdom': { flag: '🇬🇧', badgeColor: 'bg-indigo-600' },
  usa: { flag: '🇺🇸', badgeColor: 'bg-blue-700' },
  'united states': { flag: '🇺🇸', badgeColor: 'bg-blue-700' },
  singapore: { flag: '🇸🇬', badgeColor: 'bg-red-600' },
  thailand: { flag: '🇹🇭', badgeColor: 'bg-blue-500' },
  vietnam: { flag: '🇻🇳', badgeColor: 'bg-red-600' },
  indonesia: { flag: '🇮🇩', badgeColor: 'bg-rose-600' },
  taiwan: { flag: '🇹🇼', badgeColor: 'bg-cyan-600' },
  portugal: { flag: '🇵🇹', badgeColor: 'bg-emerald-500' },
  netherlands: { flag: '🇳🇱', badgeColor: 'bg-orange-500' },
  switzerland: { flag: '🇨🇭', badgeColor: 'bg-red-500' },
  austria: { flag: '🇦🇹', badgeColor: 'bg-red-600' },
  greece: { flag: '🇬🇷', badgeColor: 'bg-sky-600' },
  turkey: { flag: '🇹🇷', badgeColor: 'bg-red-600' },
  norway: { flag: '🇳🇴', badgeColor: 'bg-indigo-500' },
  sweden: { flag: '🇸🇪', badgeColor: 'bg-blue-500' },
  finland: { flag: '🇫🇮', badgeColor: 'bg-sky-500' },
  denmark: { flag: '🇩🇰', badgeColor: 'bg-red-500' },
  canada: { flag: '🇨🇦', badgeColor: 'bg-red-600' },
  mexico: { flag: '🇲🇽', badgeColor: 'bg-emerald-600' },
  'new zealand': { flag: '🇳🇿', badgeColor: 'bg-teal-600' },
};

export function getCountryMeta(countryName: string): CountryMeta {
  if (!countryName) {
    return { name: 'Unknown', flag: '🌏', badgeColor: 'bg-sky-500' };
  }
  const clean = countryName.trim();
  const lower = clean.toLowerCase();

  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(key)) {
      return { name: clean, flag: val.flag, badgeColor: val.badgeColor };
    }
  }

  return { name: clean, flag: '🌏', badgeColor: 'bg-sky-500' };
}

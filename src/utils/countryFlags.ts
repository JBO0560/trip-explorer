/**
 * Global Country and Flag Utility
 * Dynamically resolves all ISO 3166-1 alpha-2 country codes and names (250+ countries and territories),
 * with support for common aliases, ISO-2 codes, ISO-3 codes, and regional emojis.
 */

export interface CountryMeta {
  name: string;
  flag: string;
  badgeColor: string;
  isoCode?: string;
}

// Convert 2-letter ISO country code (e.g. "FR", "JP") to unicode regional indicator flag emoji
export function isoCodeToFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌏';
  const upper = countryCode.toUpperCase();
  const codePoints = [
    127397 + upper.charCodeAt(0),
    127397 + upper.charCodeAt(1)
  ];
  return String.fromCodePoint(...codePoints);
}

// Palette of Tailwind badge colors distributed deterministically based on country code
const BADGE_COLORS = [
  'bg-rose-500',
  'bg-red-500',
  'bg-amber-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-600',
  'bg-sky-500',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-purple-600',
  'bg-fuchsia-600',
  'bg-pink-600'
];

function getBadgeColorForCode(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) % BADGE_COLORS.length;
  }
  return BADGE_COLORS[Math.abs(hash)];
}

// Pre-populate ISO-3 to ISO-2 and common colloquial aliases
const COMMON_ALIASES: Record<string, string> = {
  // Common names / colloquialisms
  korea: 'KR',
  'south korea': 'KR',
  'north korea': 'KP',
  uk: 'GB',
  'united kingdom': 'GB',
  england: 'GB',
  scotland: 'GB',
  wales: 'GB',
  'great britain': 'GB',
  usa: 'US',
  'united states': 'US',
  'united states of america': 'US',
  america: 'US',
  uae: 'AE',
  'united arab emirates': 'AE',
  russia: 'RU',
  'russian federation': 'RU',
  vietnam: 'VN',
  'viet nam': 'VN',
  laos: 'LA',
  taiwan: 'TW',
  czechia: 'CZ',
  'czech republic': 'CZ',
  vatican: 'VA',
  'vatican city': 'VA',
  bolivia: 'BO',
  venezuela: 'VE',
  tanzania: 'TZ',
  moldova: 'MD',
  syria: 'SY',
  iran: 'IR',
  brunei: 'BN',
  burma: 'MM',
  myanmar: 'MM',
  macau: 'MO',
  'hong kong': 'HK',

  // Common 3-letter ISO alpha-3 codes
  kor: 'KR',
  jpn: 'JP',
  deu: 'DE',
  ger: 'DE',
  fra: 'FR',
  ita: 'IT',
  esp: 'ES',
  spa: 'ES',
  gbr: 'GB',
  usa_code: 'US',
  aus: 'AU',
  nzl: 'NZ',
  can: 'CA',
  mex: 'MX',
  sgp: 'SG',
  tha: 'TH',
  vnm: 'VN',
  idn: 'ID',
  mys: 'MY',
  phl: 'PH',
  prt: 'PT',
  por: 'PT',
  nld: 'NL',
  che: 'CH',
  sui: 'CH',
  aut: 'AT',
  grc: 'GR',
  gre: 'GR',
  tur: 'TR',
  nor: 'NO',
  swe: 'SE',
  fin: 'FI',
  dnk: 'DK',
  den: 'DK',
  isl: 'IS',
  ice: 'IS',
  irl: 'IE',
  bel: 'BE',
  pol: 'PL',
  hrv: 'HR',
  cro: 'HR',
  cze: 'CZ',
  hun: 'HU',
  bra: 'BR',
  arg: 'AR',
  chl: 'CL',
  col: 'CO',
  per: 'PE',
  egy: 'EG',
  zaf: 'ZA',
  rsa: 'ZA',
  mar: 'MA',
  mor: 'MA',
  ind: 'IN',
  chn: 'CN',
  are: 'AE',
};

// Global cache for resolved country lookups
const COUNTRY_CACHE = new Map<string, CountryMeta>();

// Build reverse lookup from Intl.DisplayNames across all ISO 3166-1 two-letter combinations
const ISO_NAME_TO_CODE = new Map<string, string>();
const VALID_ISO2_CODES = new Set<string>();

// Historical or deprecated codes that Intl may return for standard country names
const DEPRECATED_OR_SECONDARY_CODES = new Set([
  'FX', // France Metropolitan (deprecated in favor of FR)
  'UK', // Reserved in ISO (GB is standard)
  'DD', // East Germany (DE is Germany)
  'SU', // Soviet Union (RU is Russia)
  'ZR', // Zaire (CD is Congo)
  'YU', // Yugoslavia
  'CS', // Serbia & Montenegro
  'TP', // East Timor (TL is Timor-Leste)
  'VD', // North Vietnam (VN is Vietnam)
  'YD', // Democratic Yemen (YE is Yemen)
  'BU', // Burma (MM is Myanmar)
  'AN', // Netherlands Antilles (CW/BQ)
  'HV', // Upper Volta (BF is Burkina Faso)
  'DY', // Dahomey (BJ is Benin)
  'NH', // New Hebrides (VU is Vanuatu)
  'RH', // Southern Rhodesia (ZW is Zimbabwe)
]);

if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < letters.length; j++) {
        const code = letters[i] + letters[j];
        if (DEPRECATED_OR_SECONDARY_CODES.has(code)) {
          continue;
        }
        try {
          const officialName = regionNames.of(code);
          if (officialName && officialName !== code) {
            VALID_ISO2_CODES.add(code);
            const lowerName = officialName.toLowerCase();
            // Do not let secondary/deprecated codes overwrite standard codes
            if (!ISO_NAME_TO_CODE.has(lowerName)) {
              ISO_NAME_TO_CODE.set(lowerName, code);
            }

            // Also index simplified alphanumeric name (e.g. without accents / punctuation)
            const simplified = lowerName.replace(/[^a-z0-9]/g, '');
            if (simplified && !ISO_NAME_TO_CODE.has(simplified)) {
              ISO_NAME_TO_CODE.set(simplified, code);
            }
          }
        } catch {
          // Ignore invalid combinations
        }
      }
    }
  } catch {
    // Fallback if Intl.DisplayNames initialization fails
  }
}

function resolveCountryCode(query: string): string | null {
  const clean = query.trim();
  if (!clean) return null;

  const lower = clean.toLowerCase();

  // 1. Direct alias check first (e.g. "uk" -> "GB", "korea" -> "KR", "usa" -> "US")
  if (COMMON_ALIASES[lower]) {
    return COMMON_ALIASES[lower];
  }

  // 2. Direct 2-letter ISO check (if not an alias like "uk")
  const upper = clean.toUpperCase();
  if (upper.length === 2 && (VALID_ISO2_CODES.has(upper) || /^[A-Z]{2}$/.test(upper))) {
    return upper;
  }

  // 2. Direct Intl display name exact match
  if (ISO_NAME_TO_CODE.has(lower)) {
    return ISO_NAME_TO_CODE.get(lower)!;
  }

  // 3. Simplified Alphanumeric match (removes punctuation, accents, spaces)
  const simplified = lower.replace(/[^a-z0-9]/g, '');
  if (ISO_NAME_TO_CODE.has(simplified)) {
    return ISO_NAME_TO_CODE.get(simplified)!;
  }

  // 4. Substring / partial match in alias table
  for (const [alias, code] of Object.entries(COMMON_ALIASES)) {
    if (lower.includes(alias) || alias.includes(lower)) {
      return code;
    }
  }

  // 5. Substring search in official English country names
  for (const [name, code] of ISO_NAME_TO_CODE.entries()) {
    if (name.length > 3 && (lower.includes(name) || name.includes(lower))) {
      return code;
    }
  }

  return null;
}

/**
 * Main lookup function: Returns full metadata (name, emoji flag, badge color, ISO code)
 * for any country worldwide.
 */
export function getCountryMeta(countryInput: string): CountryMeta {
  if (!countryInput) {
    return { name: 'Unknown', flag: '🌏', badgeColor: 'bg-sky-500' };
  }

  const trimmed = countryInput.trim();
  const cacheKey = trimmed.toLowerCase();

  if (COUNTRY_CACHE.has(cacheKey)) {
    return COUNTRY_CACHE.get(cacheKey)!;
  }

  const isoCode = resolveCountryCode(trimmed);

  if (isoCode) {
    const flag = isoCodeToFlagEmoji(isoCode);
    const badgeColor = getBadgeColorForCode(isoCode);
    const meta: CountryMeta = {
      name: trimmed,
      flag,
      badgeColor,
      isoCode
    };
    COUNTRY_CACHE.set(cacheKey, meta);
    return meta;
  }

  // Fallback for custom or unrecognized destinations
  const fallbackMeta: CountryMeta = {
    name: trimmed,
    flag: '🌏',
    badgeColor: 'bg-sky-500'
  };
  COUNTRY_CACHE.set(cacheKey, fallbackMeta);
  return fallbackMeta;
}

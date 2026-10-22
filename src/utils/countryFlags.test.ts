import { describe, it, expect } from 'vitest';
import { getCountryMeta, isoCodeToFlagEmoji } from './countryFlags';

describe('Global Country & Flag Utility', () => {
  it('converts ISO alpha-2 codes directly to correct unicode regional flags', () => {
    expect(isoCodeToFlagEmoji('DE')).toBe('🇩🇪');
    expect(isoCodeToFlagEmoji('JP')).toBe('🇯🇵');
    expect(isoCodeToFlagEmoji('KR')).toBe('🇰🇷');
    expect(isoCodeToFlagEmoji('AU')).toBe('🇦🇺');
    expect(isoCodeToFlagEmoji('US')).toBe('🇺🇸');
    expect(isoCodeToFlagEmoji('BR')).toBe('🇧🇷');
    expect(isoCodeToFlagEmoji('ZA')).toBe('🇿🇦');
  });

  it('resolves countries by full English name across every continent', () => {
    // Europe
    expect(getCountryMeta('Germany').flag).toBe('🇩🇪');
    expect(getCountryMeta('France').flag).toBe('🇫🇷');
    expect(getCountryMeta('Italy').flag).toBe('🇮🇹');
    expect(getCountryMeta('Iceland').flag).toBe('🇮🇸');
    expect(getCountryMeta('Greece').flag).toBe('🇬🇷');
    expect(getCountryMeta('Norway').flag).toBe('🇳🇴');
    expect(getCountryMeta('Croatia').flag).toBe('🇭🇷');

    // Asia
    expect(getCountryMeta('Japan').flag).toBe('🇯🇵');
    expect(getCountryMeta('Korea').flag).toBe('🇰🇷');
    expect(getCountryMeta('South Korea').flag).toBe('🇰🇷');
    expect(getCountryMeta('Vietnam').flag).toBe('🇻🇳');
    expect(getCountryMeta('Thailand').flag).toBe('🇹🇭');
    expect(getCountryMeta('Indonesia').flag).toBe('🇮🇩');
    expect(getCountryMeta('Singapore').flag).toBe('🇸🇬');
    expect(getCountryMeta('Taiwan').flag).toBe('🇹🇼');
    expect(getCountryMeta('India').flag).toBe('🇮🇳');
    expect(getCountryMeta('Sri Lanka').flag).toBe('🇱🇰');
    expect(getCountryMeta('Maldives').flag).toBe('🇲🇻');

    // Americas
    expect(getCountryMeta('United States').flag).toBe('🇺🇸');
    expect(getCountryMeta('Canada').flag).toBe('🇨🇦');
    expect(getCountryMeta('Mexico').flag).toBe('🇲🇽');
    expect(getCountryMeta('Brazil').flag).toBe('🇧🇷');
    expect(getCountryMeta('Argentina').flag).toBe('🇦🇷');
    expect(getCountryMeta('Peru').flag).toBe('🇵🇪');
    expect(getCountryMeta('Costa Rica').flag).toBe('🇨🇷');
    expect(getCountryMeta('Chile').flag).toBe('🇨🇱');

    // Africa & Middle East
    expect(getCountryMeta('South Africa').flag).toBe('🇿🇦');
    expect(getCountryMeta('Egypt').flag).toBe('🇪🇬');
    expect(getCountryMeta('Morocco').flag).toBe('🇲🇦');
    expect(getCountryMeta('Kenya').flag).toBe('🇰🇪');
    expect(getCountryMeta('United Arab Emirates').flag).toBe('🇦🇪');

    // Oceania
    expect(getCountryMeta('Australia').flag).toBe('🇦🇺');
    expect(getCountryMeta('New Zealand').flag).toBe('🇳🇿');
    expect(getCountryMeta('Fiji').flag).toBe('🇫🇯');
  });

  it('handles colloquial names and aliases gracefully', () => {
    expect(getCountryMeta('USA').flag).toBe('🇺🇸');
    expect(getCountryMeta('UK').flag).toBe('🇬🇧');
    expect(getCountryMeta('UAE').flag).toBe('🇦🇪');
    expect(getCountryMeta('England').flag).toBe('🇬🇧');
  });

  it('handles 2-letter ISO codes directly', () => {
    expect(getCountryMeta('DE').flag).toBe('🇩🇪');
    expect(getCountryMeta('JP').flag).toBe('🇯🇵');
    expect(getCountryMeta('KR').flag).toBe('🇰🇷');
    expect(getCountryMeta('FR').flag).toBe('🇫🇷');
  });

  it('provides a graceful fallback for unknown or empty names', () => {
    expect(getCountryMeta('').flag).toBe('🌏');
    expect(getCountryMeta('Atlantis').flag).toBe('🌏');
  });
});

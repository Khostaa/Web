import { safeUrl } from './media.js';

// Local marketplace searches keep the requested model/configuration in the URL.
// A search is deliberately not presented as an in-stock product listing.
export const giftMarkets = {
  NP: ['Nepal', 'Daraz', 'https://www.daraz.com.np/catalog/', 'q'],
  IN: ['India', 'Amazon India', 'https://www.amazon.in/s', 'k'],
  US: ['United States', 'Amazon US', 'https://www.amazon.com/s', 'k'],
  GB: ['United Kingdom', 'Amazon UK', 'https://www.amazon.co.uk/s', 'k'],
  AU: ['Australia', 'Amazon Australia', 'https://www.amazon.com.au/s', 'k'],
  CA: ['Canada', 'Amazon Canada', 'https://www.amazon.ca/s', 'k'],
  AE: ['United Arab Emirates', 'Amazon UAE', 'https://www.amazon.ae/s', 'k'],
  DE: ['Germany', 'Amazon Germany', 'https://www.amazon.de/s', 'k'],
  FR: ['France', 'Amazon France', 'https://www.amazon.fr/s', 'k'],
  IT: ['Italy', 'Amazon Italy', 'https://www.amazon.it/s', 'k'],
  ES: ['Spain', 'Amazon Spain', 'https://www.amazon.es/s', 'k'],
  NL: ['Netherlands', 'Amazon Netherlands', 'https://www.amazon.nl/s', 'k'],
  SE: ['Sweden', 'Amazon Sweden', 'https://www.amazon.se/s', 'k'],
  PL: ['Poland', 'Amazon Poland', 'https://www.amazon.pl/s', 'k'],
  SA: ['Saudi Arabia', 'Amazon Saudi Arabia', 'https://www.amazon.sa/s', 'k'],
  JP: ['Japan', 'Amazon Japan', 'https://www.amazon.co.jp/s', 'k'],
  SG: ['Singapore', 'Amazon Singapore', 'https://www.amazon.sg/s', 'k'],
  BR: ['Brazil', 'Amazon Brazil', 'https://www.amazon.com.br/s', 'k'],
  MX: ['Mexico', 'Amazon Mexico', 'https://www.amazon.com.mx/s', 'k'],
  GLOBAL: ['Other country / region']
};

export function giftDestination(gift, country) {
  const override = gift.regionalUrls?.[country];
  if (override && safeUrl(override.url)) return { url: safeUrl(override.url), label: override.label || 'View product ↗' };
  const market = giftMarkets[country];
  if (market?.[2] && (gift.query || gift.title)) {
    const url = new URL(market[2]);
    url.searchParams.set(market[3], gift.query || gift.title);
    return { url: url.href, label: 'Find at ' + market[1] + ' ↗' };
  }
  return { url: safeUrl(gift.url), label: 'View brand website ↗' };
}

export function suggestedGiftCountry(languages = [], timezone = '') {
  if (['Asia/Katmandu', 'Asia/Kathmandu'].includes(timezone)) return 'NP';
  for (const language of languages) {
    try {
      const region = new Intl.Locale(language).region;
      if (region && giftMarkets[region]) return region;
    } catch { /* Invalid/absent browser locale: use the brand link. */ }
  }
  return 'GLOBAL';
}

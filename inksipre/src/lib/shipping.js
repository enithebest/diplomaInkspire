/**
 * Calculate shipping fees according to the tiers listed on the About page.
 * Amounts are in the same currency as product prices (displayed as $ in checkout UI).
 *
 * Rules derived from About page:
 * - DE: EUR 5 flat, free when subtotal >= EUR 120
 * - EU: EUR 12 flat
 * - International: EUR 18 for North America, EUR 25 for other regions
 */
export function calculateShippingFee({ subtotal = 0, country = '' } = {}) {
  const subtotalNumber = Math.max(0, Number(subtotal) || 0);
  const code = (country || '').toString().trim().toUpperCase();

  if (!code || code.length < 2) {
    return {
      amount: 0,
      label: 'Enter country to calculate shipping',
      tier: 'missing_country'
    };
  }

  const EU_COUNTRIES = new Set([
    'AT',
    'BE',
    'BG',
    'HR',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IE',
    'IT',
    'LV',
    'LT',
    'LU',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'SE'
  ]);

  if (code === 'DE') {
    if (subtotalNumber >= 120) {
      return { amount: 0, label: 'Free shipping in DE (orders over EUR 120)', tier: 'de_free' };
    }
    return { amount: 5, label: 'Domestic DE shipping (EUR 5)', tier: 'de_flat' };
  }

  if (EU_COUNTRIES.has(code)) {
    return { amount: 12, label: 'EU shipping (EUR 12)', tier: 'eu_flat' };
  }

  const NA_COUNTRIES = new Set(['US', 'CA', 'MX']);
  if (NA_COUNTRIES.has(code)) {
    return { amount: 18, label: 'International (North America, EUR 18)', tier: 'intl_na' };
  }

  return { amount: 25, label: 'International (EUR 25)', tier: 'intl_rest' };
}

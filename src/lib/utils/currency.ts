import type { WishItem } from '../../api';

/**
 * Formats a price given in minor units (e.g. cents/øre) as a localized
 * currency string.
 *
 * Uses the built-in Intl.NumberFormat, so for DKK (da-DK) thousands are
 * separated with "." and the decimal separator is "," — e.g. 44900 -> "449,00 kr."
 */
export function formatPrice(
  priceMinor: number,
  currency: WishItem['currency'] = 'DKK',
  locale = 'da-DK',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(priceMinor / 100);
}

import { CurrencyOption } from '../types';

/**
 * Available currency options
 */
export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
];

/**
 * Format amount as currency using user's preferred currency
 * @param amount - Amount to format
 * @param currencyCode - Currency code (ISO 4217)
 * @param locale - Locale for formatting (defaults to 'fr-FR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'EUR', locale: string = 'fr-FR'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is not supported
    const currency = CURRENCY_OPTIONS.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    return `${symbol} ${amount.toFixed(2)}`;
  }
};



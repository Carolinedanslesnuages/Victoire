/**
 * Tests for widget data utilities
 */

import { formatWidgetCurrency, getWidgetColor } from '../widgetData';

describe('Widget Data Utilities', () => {
  describe('formatWidgetCurrency', () => {
    it('should format EUR currency correctly', () => {
      const result = formatWidgetCurrency(25.50, 'EUR');
      expect(result).toBe('25.50 €');
    });

    it('should format negative amounts as positive', () => {
      const result = formatWidgetCurrency(-12.30, 'EUR');
      expect(result).toBe('12.30 €');
    });

    it('should format USD currency correctly', () => {
      const result = formatWidgetCurrency(100.00, 'USD');
      expect(result).toBe('$100.00');
    });

    it('should format GBP currency correctly', () => {
      const result = formatWidgetCurrency(50.75, 'GBP');
      expect(result).toBe('£50.75');
    });

    it('should format CHF currency correctly', () => {
      const result = formatWidgetCurrency(75.25, 'CHF');
      expect(result).toBe('75.25 CHF');
    });

    it('should handle unknown currencies', () => {
      const result = formatWidgetCurrency(10.00, 'JPY');
      expect(result).toBe('JPY10.00');
    });
  });

  describe('getWidgetColor', () => {
    it('should return teal colors for positive budget', () => {
      const colors = getWidgetColor(true);
      expect(colors.background).toBe('#008080');
      expect(colors.text).toBe('#FFFFFF');
    });

    it('should return red colors for negative budget', () => {
      const colors = getWidgetColor(false);
      expect(colors.background).toBe('#FF3B30');
      expect(colors.text).toBe('#FFFFFF');
    });
  });
});

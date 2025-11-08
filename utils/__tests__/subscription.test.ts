/**
 * Tests for subscription utilities
 */
import {
  getSubscriptionStatus,
  hasPremiumAccess,
  isFeatureAvailable,
  PREMIUM_FEATURES,
} from '../subscription';

describe('subscription utilities', () => {
  describe('getSubscriptionStatus', () => {
    it('should return premium status in development mode', async () => {
      // __DEV__ is true by default in Jest environment
      const status = await getSubscriptionStatus();
      expect(status).toEqual({
        status: 'premium',
        isActive: true,
      });
    });
  });

  describe('hasPremiumAccess', () => {
    it('should return true in development mode', async () => {
      const isPremium = await hasPremiumAccess();
      expect(isPremium).toBe(true);
    });
  });

  describe('isFeatureAvailable', () => {
    it('should allow UNLIMITED_CATEGORIES in development mode', async () => {
      const available = await isFeatureAvailable(PREMIUM_FEATURES.UNLIMITED_CATEGORIES);
      expect(available).toBe(true);
    });

    it('should allow ADVANCED_ANALYTICS in development mode', async () => {
      const available = await isFeatureAvailable(PREMIUM_FEATURES.ADVANCED_ANALYTICS);
      expect(available).toBe(true);
    });

    it('should allow CLOUD_BACKUP in development mode', async () => {
      const available = await isFeatureAvailable(PREMIUM_FEATURES.CLOUD_BACKUP);
      expect(available).toBe(true);
    });

    it('should allow EXPORT_DATA in development mode', async () => {
      const available = await isFeatureAvailable(PREMIUM_FEATURES.EXPORT_DATA);
      expect(available).toBe(true);
    });

    it('should allow all features when premium', async () => {
      const features = Object.values(PREMIUM_FEATURES);
      for (const feature of features) {
        const available = await isFeatureAvailable(feature);
        expect(available).toBe(true);
      }
    });
  });
});

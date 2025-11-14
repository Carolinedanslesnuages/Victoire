/**
 * Tests for complete data reset functionality
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetAllData } from '../storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getAllKeys: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('resetAllData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove all keys starting with @pace_ prefix', async () => {
    // Mock getAllKeys to return various keys including @pace_ keys
    const allKeys = [
      '@pace_budget_config',
      '@pace_transactions',
      '@pace_user_preferences',
      '@pace_budget_profiles',
      '@pace_active_budget_id',
      '@pace_gamification_data',
      '@pace_streak_info',
      '@pace_onboarding_carousel_completed',
      '@pace_onboarding_tooltips_completed',
      '@pace_bonus_piggy_bank_personal-default',
      '@other_app_key', // Should NOT be removed
      'some_other_key', // Should NOT be removed
    ];

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(allKeys);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    const result = await resetAllData();

    expect(result).toBe(true);
    expect(AsyncStorage.getAllKeys).toHaveBeenCalledTimes(1);
    
    // Should only remove keys starting with @pace_
    const expectedKeysToRemove = [
      '@pace_budget_config',
      '@pace_transactions',
      '@pace_user_preferences',
      '@pace_budget_profiles',
      '@pace_active_budget_id',
      '@pace_gamification_data',
      '@pace_streak_info',
      '@pace_onboarding_carousel_completed',
      '@pace_onboarding_tooltips_completed',
      '@pace_bonus_piggy_bank_personal-default',
    ];

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(expectedKeysToRemove);
  });

  it('should return true on successful reset', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
      '@pace_budget_config',
      '@pace_transactions',
    ]);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    const result = await resetAllData();

    expect(result).toBe(true);
  });

  it('should return false on error', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(
      new Error('Storage error')
    );

    const result = await resetAllData();

    expect(result).toBe(false);
  });

  it('should handle empty storage gracefully', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    const result = await resetAllData();

    expect(result).toBe(true);
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([]);
  });

  it('should handle storage with no @pace_ keys', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
      '@other_app_key',
      'some_other_key',
    ]);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    const result = await resetAllData();

    expect(result).toBe(true);
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([]);
  });
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadGamificationData,
  saveGamificationData,
  unlockBadge,
  hasBadge,
} from '../gamification';
import { GamificationData, BadgeType } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock other dependencies
jest.mock('../storage', () => ({
  loadBudgetConfig: jest.fn(),
  getTransactionsForCurrentCycle: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../budgetCalculations', () => ({
  calculateDailyBudget: jest.fn(() => 0),
}));

describe('Gamification Badge Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadGamificationData', () => {
    it('should return default data when no data is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const data = await loadGamificationData();

      expect(data).toEqual({
        badges: [],
        streakInfo: expect.objectContaining({
          currentStreak: 0,
          longestStreak: 0,
          streakFreezes: 2,
          jokersRemaining: 3,
        }),
        monthlyStats: {
          cyclesWithPositiveBalance: 0,
          totalCyclesCompleted: 0,
        },
      });
    });

    it('should load and parse stored data', async () => {
      const storedData: GamificationData = {
        badges: [
          { type: 'first_step', unlockedAt: '2024-01-01T00:00:00.000Z', isRare: false },
        ],
        streakInfo: {
          currentStreak: 5,
          longestStreak: 10,
          lastActivityDate: '2024-01-01',
          isActive: true,
          streakFreezes: 2,
          jokersRemaining: 3,
          lastJokerResetDate: '2024-01-01',
        },
        monthlyStats: {
          cyclesWithPositiveBalance: 2,
          totalCyclesCompleted: 3,
        },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedData));

      const data = await loadGamificationData();

      expect(data.badges).toHaveLength(1);
      expect(data.badges[0].type).toBe('first_step');
      expect(data.streakInfo.currentStreak).toBe(5);
    });

    it('should return default data when stored data is invalid', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const data = await loadGamificationData();

      expect(data.badges).toEqual([]);
      expect(data.streakInfo.currentStreak).toBe(0);
    });

    it('should return default data when stored data structure is invalid', async () => {
      const invalidData = { some: 'invalid', structure: true };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(invalidData));

      const data = await loadGamificationData();

      expect(data.badges).toEqual([]);
      expect(data.streakInfo.currentStreak).toBe(0);
    });
  });

  describe('saveGamificationData', () => {
    it('should save data to AsyncStorage', async () => {
      const data: GamificationData = {
        badges: [
          { type: 'first_step', unlockedAt: '2024-01-01T00:00:00.000Z', isRare: false },
        ],
        streakInfo: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          isActive: false,
          streakFreezes: 2,
          jokersRemaining: 3,
          lastJokerResetDate: '2024-01-01',
        },
        monthlyStats: {
          cyclesWithPositiveBalance: 0,
          totalCyclesCompleted: 0,
        },
      };
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await saveGamificationData(data);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pace_gamification_data',
        JSON.stringify(data)
      );
    });

    it('should return false when save fails', async () => {
      const data: GamificationData = {
        badges: [],
        streakInfo: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          isActive: false,
          streakFreezes: 2,
          jokersRemaining: 3,
          lastJokerResetDate: '2024-01-01',
        },
        monthlyStats: {
          cyclesWithPositiveBalance: 0,
          totalCyclesCompleted: 0,
        },
      };
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await saveGamificationData(data);

      expect(result).toBe(false);
    });
  });

  describe('unlockBadge', () => {
    it('should unlock a new badge and save it', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const badge = await unlockBadge('first_step', false);

      expect(badge).not.toBeNull();
      expect(badge?.type).toBe('first_step');
      expect(badge?.isRare).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should return null if badge is already unlocked', async () => {
      const existingData: GamificationData = {
        badges: [
          { type: 'first_step', unlockedAt: '2024-01-01T00:00:00.000Z', isRare: false },
        ],
        streakInfo: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          isActive: false,
          streakFreezes: 2,
          jokersRemaining: 3,
          lastJokerResetDate: '2024-01-01',
        },
        monthlyStats: {
          cyclesWithPositiveBalance: 0,
          totalCyclesCompleted: 0,
        },
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      const badge = await unlockBadge('first_step', false);

      expect(badge).toBeNull();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should return null if save fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const badge = await unlockBadge('first_step', false);

      expect(badge).toBeNull();
    });

    it('should prevent badge modal from showing if persistence fails', async () => {
      // This test verifies that the bug fix works: if save fails, badge is null
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage quota exceeded'));

      const badge = await unlockBadge('first_step', false);

      // Badge should be null, preventing the modal from showing
      expect(badge).toBeNull();
    });
  });

  describe('hasBadge', () => {
    it('should return true if badge exists', () => {
      const data: GamificationData = {
        badges: [
          { type: 'first_step', unlockedAt: '2024-01-01T00:00:00.000Z', isRare: false },
        ],
        streakInfo: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          isActive: false,
          streakFreezes: 2,
          jokersRemaining: 3,
          lastJokerResetDate: '2024-01-01',
        },
        monthlyStats: {
          cyclesWithPositiveBalance: 0,
          totalCyclesCompleted: 0,
        },
      };

      expect(hasBadge(data, 'first_step')).toBe(true);
    });

    it('should return false if badge does not exist', () => {
      const data: GamificationData = {
        badges: [],
        streakInfo: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          isActive: false,
          streakFreezes: 2,
          jokersRemaining: 3,
          lastJokerResetDate: '2024-01-01',
        },
        monthlyStats: {
          cyclesWithPositiveBalance: 0,
          totalCyclesCompleted: 0,
        },
      };

      expect(hasBadge(data, 'first_step')).toBe(false);
    });
  });

  describe('Badge Persistence Integration', () => {
    it('should persist badge across app reloads', async () => {
      // First load: No data
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      // Unlock badge
      const badge1 = await unlockBadge('first_step', false);
      expect(badge1).not.toBeNull();

      // Simulate app reload by loading the saved data
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);

      // Try to unlock the same badge again
      const badge2 = await unlockBadge('first_step', false);
      
      // Should return null because badge is already unlocked
      expect(badge2).toBeNull();
    });

    it('should unlock and persist multiple badges', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      // Unlock first badge
      const badge1 = await unlockBadge('first_step', false);
      expect(badge1?.type).toBe('first_step');

      // Get the saved data after first badge
      const savedData1 = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData1);

      // Unlock second badge
      const badge2 = await unlockBadge('streak_7', false);
      expect(badge2?.type).toBe('streak_7');

      // Load the final saved data
      const savedData2 = (AsyncStorage.setItem as jest.Mock).mock.calls[1][1];
      const finalData = JSON.parse(savedData2);

      // Both badges should be present
      expect(finalData.badges).toHaveLength(2);
      expect(finalData.badges.find((b: any) => b.type === 'first_step')).toBeDefined();
      expect(finalData.badges.find((b: any) => b.type === 'streak_7')).toBeDefined();
    });
  });
});

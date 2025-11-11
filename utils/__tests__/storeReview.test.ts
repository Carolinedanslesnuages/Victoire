import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import {
  loadReviewRequestState,
  saveReviewRequestState,
  hasAchievedPositiveMoment,
  shouldShowReviewPrompt,
  requestReview,
  markUserDeclinedReview,
} from '../storeReview';
import { loadStreakInfo } from '../streaks';
import { loadTransactions } from '../storage';

// Mock the dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-store-review');
jest.mock('../streaks');
jest.mock('../storage');

describe('storeReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    // Mock StoreReview
    (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);
  });

  describe('loadReviewRequestState', () => {
    it('should return default state when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const state = await loadReviewRequestState();

      expect(state).toEqual({
        hasBeenAsked: false,
        lastAskedDate: null,
        userDeclined: false,
        lastDeclinedDate: null,
      });
    });

    it('should return stored state when data exists', async () => {
      const storedState = {
        hasBeenAsked: true,
        lastAskedDate: '2024-01-01T00:00:00.000Z',
        userDeclined: false,
        lastDeclinedDate: null,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedState));

      const state = await loadReviewRequestState();

      expect(state).toEqual(storedState);
    });
  });

  describe('saveReviewRequestState', () => {
    it('should save state to AsyncStorage', async () => {
      const state = {
        hasBeenAsked: true,
        lastAskedDate: '2024-01-01T00:00:00.000Z',
        userDeclined: false,
        lastDeclinedDate: null,
      };

      const result = await saveReviewRequestState(state);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pace_review_request',
        JSON.stringify(state)
      );
    });

    it('should return false on error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const state = {
        hasBeenAsked: false,
        lastAskedDate: null,
        userDeclined: false,
        lastDeclinedDate: null,
      };

      const result = await saveReviewRequestState(state);

      expect(result).toBe(false);
    });
  });

  describe('hasAchievedPositiveMoment', () => {
    it('should detect 3-day streak as positive moment', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 3,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);

      const result = await hasAchievedPositiveMoment();

      expect(result).toEqual({
        achieved: true,
        momentType: 'streak_3',
      });
    });

    it('should detect 10th expense as positive moment', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 0,
        isActive: false,
      });
      (loadTransactions as jest.Mock).mockResolvedValue(
        Array(10).fill({ id: '1', amount: 10, description: 'Test' })
      );

      const result = await hasAchievedPositiveMoment();

      expect(result).toEqual({
        achieved: true,
        momentType: 'expense_10',
      });
    });

    it('should return false when no positive moment achieved', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 1,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([{ id: '1', amount: 10, description: 'Test' }]);

      const result = await hasAchievedPositiveMoment();

      expect(result).toEqual({
        achieved: false,
        momentType: null,
      });
    });
  });

  describe('shouldShowReviewPrompt', () => {
    it('should return false if store review not available', async () => {
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      const result = await shouldShowReviewPrompt();

      expect(result).toBe(false);
    });

    it('should return false if no positive moment achieved', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 0,
        isActive: false,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await shouldShowReviewPrompt();

      expect(result).toBe(false);
    });

    it('should return true if positive moment achieved and never asked', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 3,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await shouldShowReviewPrompt();

      expect(result).toBe(true);
    });

    it('should return false if user declined recently (within 180 days)', async () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30); // 30 days ago

      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 3,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          hasBeenAsked: true,
          lastAskedDate: recentDate.toISOString(),
          userDeclined: true,
          lastDeclinedDate: recentDate.toISOString(),
        })
      );

      const result = await shouldShowReviewPrompt();

      expect(result).toBe(false);
    });

    it('should return true if user declined but 180+ days have passed', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 200); // 200 days ago

      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 3,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          hasBeenAsked: true,
          lastAskedDate: oldDate.toISOString(),
          userDeclined: true,
          lastDeclinedDate: oldDate.toISOString(),
        })
      );

      const result = await shouldShowReviewPrompt();

      expect(result).toBe(true);
    });

    it('should return false if asked recently (within 180 days)', async () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30); // 30 days ago

      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 3,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          hasBeenAsked: true,
          lastAskedDate: recentDate.toISOString(),
          userDeclined: false,
          lastDeclinedDate: null,
        })
      );

      const result = await shouldShowReviewPrompt();

      expect(result).toBe(false);
    });
  });

  describe('requestReview', () => {
    it('should request review and update state when conditions are met', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 3,
        isActive: true,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await requestReview();

      expect(result).toBe(true);
      expect(StoreReview.requestReview).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should not request review when conditions not met', async () => {
      (loadStreakInfo as jest.Mock).mockResolvedValue({
        currentStreak: 0,
        isActive: false,
      });
      (loadTransactions as jest.Mock).mockResolvedValue([]);

      const result = await requestReview();

      expect(result).toBe(false);
      expect(StoreReview.requestReview).not.toHaveBeenCalled();
    });
  });

  describe('markUserDeclinedReview', () => {
    it('should mark user as declined and save state', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await markUserDeclinedReview();

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should return false on storage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await markUserDeclinedReview();

      expect(result).toBe(false);
    });
  });
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { loadStreakInfo } from './streaks';
import { loadTransactions } from './storage';

const REVIEW_REQUEST_KEY = '@pace_review_request';

/**
 * Interface for tracking review request state
 */
export interface ReviewRequestState {
  hasBeenAsked: boolean;
  lastAskedDate: string | null; // ISO date string
  userDeclined: boolean; // true if user explicitly declined
  lastDeclinedDate: string | null; // ISO date string when user declined
}

/**
 * Get default review request state
 */
const getDefaultReviewRequestState = (): ReviewRequestState => ({
  hasBeenAsked: false,
  lastAskedDate: null,
  userDeclined: false,
  lastDeclinedDate: null,
});

/**
 * Load review request state from storage
 */
export const loadReviewRequestState = async (): Promise<ReviewRequestState> => {
  try {
    const jsonValue = await AsyncStorage.getItem(REVIEW_REQUEST_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return getDefaultReviewRequestState();
  } catch (error) {
    console.error('Error loading review request state:', error);
    return getDefaultReviewRequestState();
  }
};

/**
 * Save review request state to storage
 */
export const saveReviewRequestState = async (state: ReviewRequestState): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(REVIEW_REQUEST_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving review request state:', error);
    return false;
  }
};

/**
 * Check if user has achieved a positive moment worthy of review request
 * Positive moments:
 * - Completed a 3-day streak
 * - Recorded their 10th expense
 */
export const hasAchievedPositiveMoment = async (): Promise<{
  achieved: boolean;
  momentType: 'streak_3' | 'expense_10' | null;
}> => {
  try {
    // Check for 3-day streak
    const streakInfo = await loadStreakInfo();
    if (streakInfo.currentStreak >= 3 && streakInfo.isActive) {
      return { achieved: true, momentType: 'streak_3' };
    }

    // Check for 10th expense
    const transactions = await loadTransactions();
    if (transactions.length >= 10) {
      return { achieved: true, momentType: 'expense_10' };
    }

    return { achieved: false, momentType: null };
  } catch (error) {
    console.error('Error checking positive moment:', error);
    return { achieved: false, momentType: null };
  }
};

/**
 * Check if enough time has passed since last decline
 * Wait 6 months (180 days) before asking again after a decline
 */
const hasEnoughTimePassedSinceDecline = (lastDeclinedDate: string | null): boolean => {
  if (!lastDeclinedDate) {
    return true;
  }

  const lastDeclined = new Date(lastDeclinedDate);
  const now = new Date();
  const daysSinceDecline = Math.floor((now.getTime() - lastDeclined.getTime()) / (1000 * 60 * 60 * 24));
  
  // Wait 180 days (approximately 6 months) before asking again
  return daysSinceDecline >= 180;
};

/**
 * Check if we should show the review prompt
 * US 17.1.2: Don't harass users - wait several months before asking again
 */
export const shouldShowReviewPrompt = async (): Promise<boolean> => {
  try {
    // Check if store review is available on this device
    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) {
      return false;
    }

    // Check if user has achieved a positive moment
    const { achieved } = await hasAchievedPositiveMoment();
    if (!achieved) {
      return false;
    }

    // Check review request state
    const state = await loadReviewRequestState();
    
    // If user declined, check if enough time has passed (6 months)
    if (state.userDeclined && !hasEnoughTimePassedSinceDecline(state.lastDeclinedDate)) {
      return false;
    }

    // If already asked and not declined, wait 6 months before asking again
    if (state.hasBeenAsked && !state.userDeclined && state.lastAskedDate) {
      if (!hasEnoughTimePassedSinceDecline(state.lastAskedDate)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking if should show review prompt:', error);
    return false;
  }
};

/**
 * Request app store review
 * US 17.1.1: Trigger after positive moments (3-day streak or 10th expense)
 */
export const requestReview = async (): Promise<boolean> => {
  try {
    // Double-check if we should show the prompt
    const shouldShow = await shouldShowReviewPrompt();
    if (!shouldShow) {
      return false;
    }

    // Request the review
    await StoreReview.requestReview();

    // Update review request state
    const state = await loadReviewRequestState();
    state.hasBeenAsked = true;
    state.lastAskedDate = new Date().toISOString();
    await saveReviewRequestState(state);

    return true;
  } catch (error) {
    console.error('Error requesting review:', error);
    return false;
  }
};

/**
 * Mark that user declined to review
 * This will prevent showing the prompt again for 6 months
 */
export const markUserDeclinedReview = async (): Promise<boolean> => {
  try {
    const state = await loadReviewRequestState();
    state.userDeclined = true;
    state.lastDeclinedDate = new Date().toISOString();
    const saved = await saveReviewRequestState(state);
    return saved;
  } catch (error) {
    console.error('Error marking user declined review:', error);
    return false;
  }
};

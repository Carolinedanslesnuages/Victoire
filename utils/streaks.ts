import AsyncStorage from '@react-native-async-storage/async-storage';
import { StreakInfo } from '../types';
import { loadTransactions } from './storage';
import { updateStreakWithGamification, loadGamificationData } from './gamification';

const STREAK_INFO_KEY = '@pace_streak_info';

/**
 * Get default streak info
 */
const getDefaultStreakInfo = (): StreakInfo => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: '',
  isActive: false,
  streakFreezes: 2,
  jokersRemaining: 3,
  lastJokerResetDate: new Date().toISOString().split('T')[0],
});

/**
 * Load streak info from storage
 */
export const loadStreakInfo = async (): Promise<StreakInfo> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STREAK_INFO_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return getDefaultStreakInfo();
  } catch (error) {
    console.error('Error loading streak info:', error);
    return getDefaultStreakInfo();
  }
};

/**
 * Save streak info to storage
 */
export const saveStreakInfo = async (streakInfo: StreakInfo): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(streakInfo);
    await AsyncStorage.setItem(STREAK_INFO_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving streak info:', error);
    return false;
  }
};

/**
 * Check if two dates are consecutive days
 */
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const dayInMs = 24 * 60 * 60 * 1000;
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return diff <= dayInMs;
};

/**
 * Check if a date is today
 */
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get unique activity dates from transactions
 */
const getUniqueActivityDates = (transactions: any[]): string[] => {
  const uniqueDates = new Set<string>();
  transactions.forEach(t => {
    const date = new Date(t.date);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    uniqueDates.add(dateStr);
  });
  return Array.from(uniqueDates).sort();
};

/**
 * Calculate current streak based on transactions
 */
export const calculateStreak = async (): Promise<StreakInfo> => {
  try {
    const transactions = await loadTransactions();
    
    if (transactions.length === 0) {
      return getDefaultStreakInfo();
    }

    // Get unique activity dates
    const activityDates = getUniqueActivityDates(transactions);
    
    if (activityDates.length === 0) {
      return getDefaultStreakInfo();
    }

    // Get the most recent activity date
    const lastActivityDateStr = activityDates[activityDates.length - 1];
    const lastActivityDate = new Date(lastActivityDateStr);

    // Check if streak is active (activity today or yesterday)
    const isActive = isToday(lastActivityDate) || isYesterday(lastActivityDate);

    // Calculate current streak
    let currentStreak = 1;
    for (let i = activityDates.length - 1; i > 0; i--) {
      const currentDate = new Date(activityDates[i]);
      const previousDate = new Date(activityDates[i - 1]);
      
      if (areConsecutiveDays(currentDate, previousDate)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 1;
    let tempStreak = 1;
    for (let i = 1; i < activityDates.length; i++) {
      const currentDate = new Date(activityDates[i]);
      const previousDate = new Date(activityDates[i - 1]);
      
      if (areConsecutiveDays(currentDate, previousDate)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // If streak is not active, reset current streak to 0
    if (!isActive) {
      currentStreak = 0;
    }

    // Get gamification data for freezes and jokers
    const gamificationData = await loadGamificationData();

    const streakInfo: StreakInfo = {
      currentStreak,
      longestStreak,
      lastActivityDate: lastActivityDateStr,
      isActive,
      streakFreezes: gamificationData.streakInfo.streakFreezes,
      jokersRemaining: gamificationData.streakInfo.jokersRemaining,
      lastJokerResetDate: gamificationData.streakInfo.lastJokerResetDate,
    };

    // Update with gamification features (handles auto-freeze)
    await updateStreakWithGamification(streakInfo);

    // Save the calculated streak info
    await saveStreakInfo(streakInfo);

    return streakInfo;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return getDefaultStreakInfo();
  }
};

/**
 * Update streak after a new transaction
 */
export const updateStreakAfterActivity = async (): Promise<StreakInfo> => {
  return await calculateStreak();
};

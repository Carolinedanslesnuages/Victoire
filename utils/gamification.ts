import AsyncStorage from '@react-native-async-storage/async-storage';
import { GamificationData, Badge, BadgeType, StreakInfo } from '../types';
import { loadBudgetConfig, getTransactionsForCurrentCycle } from './storage';
import { calculateDailyBudget } from './budgetCalculations';

const GAMIFICATION_DATA_KEY = '@pace_gamification_data';

/**
 * Get default gamification data
 * @param isPremium - Whether user has premium subscription (affects joker quota)
 */
const getDefaultGamificationData = (isPremium: boolean = false): GamificationData => {
  const jokerQuota = isPremium ? 5 : 1;
  return {
    badges: [],
    streakInfo: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: '',
      isActive: false,
      streakFreezes: 2, // Start with 2 streak freezes
      jokersRemaining: jokerQuota,
      lastJokerResetDate: new Date().toISOString().split('T')[0],
      jokerQuota: jokerQuota, // Store the quota for future resets
    },
    monthlyStats: {
      cyclesWithPositiveBalance: 0,
      totalCyclesCompleted: 0,
    },
  };
};

/**
 * Validate that loaded gamification data has the expected structure
 */
const validateGamificationData = (data: any): boolean => {
  try {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.badges) &&
      data.streakInfo &&
      typeof data.streakInfo === 'object' &&
      typeof data.streakInfo.currentStreak === 'number' &&
      typeof data.streakInfo.longestStreak === 'number' &&
      data.monthlyStats &&
      typeof data.monthlyStats === 'object' &&
      typeof data.monthlyStats.cyclesWithPositiveBalance === 'number' &&
      typeof data.monthlyStats.totalCyclesCompleted === 'number'
    );
  } catch {
    return false;
  }
};

/**
 * Load gamification data from storage
 * @param isPremium - Whether user has premium subscription (affects joker quota)
 */
export const loadGamificationData = async (isPremium: boolean = false): Promise<GamificationData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(GAMIFICATION_DATA_KEY);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      
      // Validate the loaded data structure
      if (!validateGamificationData(data)) {
        console.error('Invalid gamification data structure, resetting to defaults');
        return getDefaultGamificationData(isPremium);
      }
      
      // Ensure jokers are reset monthly
      return resetJokersIfNeeded(data, isPremium);
    }
    return getDefaultGamificationData(isPremium);
  } catch (error) {
    console.error('Error loading gamification data:', error);
    return getDefaultGamificationData(isPremium);
  }
};

/**
 * Save gamification data to storage
 */
export const saveGamificationData = async (data: GamificationData): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(GAMIFICATION_DATA_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving gamification data:', error);
    return false;
  }
};

/**
 * Reset jokers if a new month has started
 * @param data - Gamification data to check and potentially reset
 * @param isPremium - Whether user has premium subscription (affects joker quota)
 */
const resetJokersIfNeeded = (data: GamificationData, isPremium: boolean = false): GamificationData => {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  // Determine the joker quota (use stored quota if available, otherwise use isPremium)
  const jokerQuota = data.streakInfo.jokerQuota !== undefined 
    ? data.streakInfo.jokerQuota 
    : (isPremium ? 5 : 1);
  
  // Update quota if isPremium status changed
  if (isPremium && jokerQuota < 5) {
    data.streakInfo.jokerQuota = 5;
  } else if (!isPremium && jokerQuota > 1) {
    // If user was premium but is now free, downgrade quota
    data.streakInfo.jokerQuota = 1;
  } else if (data.streakInfo.jokerQuota === undefined) {
    // Store the quota for future use
    data.streakInfo.jokerQuota = jokerQuota;
  }
  
  if (!data.streakInfo.lastJokerResetDate) {
    data.streakInfo.lastJokerResetDate = today.toISOString().split('T')[0];
    return data;
  }

  const lastResetDate = new Date(data.streakInfo.lastJokerResetDate);
  const lastResetMonth = `${lastResetDate.getFullYear()}-${String(lastResetDate.getMonth() + 1).padStart(2, '0')}`;

  if (currentMonth !== lastResetMonth) {
    // Use the stored or updated quota
    data.streakInfo.jokersRemaining = data.streakInfo.jokerQuota || jokerQuota;
    data.streakInfo.lastJokerResetDate = today.toISOString().split('T')[0];
  }

  return data;
};

/**
 * Check if a badge is already unlocked
 */
export const hasBadge = (data: GamificationData, badgeType: BadgeType): boolean => {
  return data.badges.some(badge => badge.type === badgeType);
};

/**
 * Unlock a new badge
 */
export const unlockBadge = async (
  badgeType: BadgeType,
  isRare: boolean = false
): Promise<Badge | null> => {
  try {
    const data = await loadGamificationData();
    
    // Check if badge is already unlocked
    if (hasBadge(data, badgeType)) {
      return null;
    }

    const newBadge: Badge = {
      type: badgeType,
      unlockedAt: new Date().toISOString(),
      isRare,
    };

    data.badges.push(newBadge);
    const saved = await saveGamificationData(data);
    
    // Only return the badge if it was successfully saved
    // This prevents showing the unlock modal if persistence failed
    if (!saved) {
      console.error('Failed to save badge data to storage');
      return null;
    }

    return newBadge;
  } catch (error) {
    console.error('Error unlocking badge:', error);
    return null;
  }
};

/**
 * Check and unlock badges based on current state
 */
export const checkAndUnlockBadges = async (): Promise<Badge[]> => {
  try {
    const data = await loadGamificationData();
    const newBadges: Badge[] = [];

    // Check streak-based badges
    const currentStreak = data.streakInfo.currentStreak;
    
    if (currentStreak >= 7 && !hasBadge(data, 'streak_7')) {
      const badge = await unlockBadge('streak_7', false);
      if (badge) newBadges.push(badge);
    }

    if (currentStreak >= 30 && !hasBadge(data, 'streak_30')) {
      const badge = await unlockBadge('streak_30', true);
      if (badge) newBadges.push(badge);
    }

    if (currentStreak >= 100 && !hasBadge(data, 'streak_100')) {
      const badge = await unlockBadge('streak_100', true);
      if (badge) newBadges.push(badge);
    }

    // Check budget master badge (3 cycles with positive balance)
    if (data.monthlyStats.cyclesWithPositiveBalance >= 3 && !hasBadge(data, 'budget_master')) {
      const badge = await unlockBadge('budget_master', true);
      if (badge) newBadges.push(badge);
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
};

/**
 * Use a streak freeze to protect the streak
 */
export const useStreakFreeze = async (): Promise<boolean> => {
  try {
    const data = await loadGamificationData();
    
    if (data.streakInfo.streakFreezes <= 0) {
      return false;
    }

    data.streakInfo.streakFreezes--;
    
    // Unlock badge for first use of streak freeze
    if (!hasBadge(data, 'streak_saver')) {
      await unlockBadge('streak_saver', false);
    }

    const saved = await saveGamificationData(data);
    if (!saved) {
      console.error('Failed to save streak freeze usage to storage');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error using streak freeze:', error);
    return false;
  }
};

/**
 * Use a joker to forgive a small budget overrun
 */
export const useJoker = async (): Promise<boolean> => {
  try {
    const data = await loadGamificationData();
    
    if (data.streakInfo.jokersRemaining <= 0) {
      return false;
    }

    // Check if daily budget is negative but by less than 5€
    const config = await loadBudgetConfig();
    if (!config) return false;

    const transactions = await getTransactionsForCurrentCycle(config.cycleStartDay);
    const totalSpent = transactions
      .filter(t => t.type !== 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cycleMode = config.cycleMode || 'monthly';
    const dailyBudget = calculateDailyBudget(
      config.monthlyIncome,
      config.fixedCharges,
      config.savingsGoal,
      totalSpent,
      config.cycleStartDay,
      totalIncome,
      config.midCycleOnboarding,
      cycleMode,
      config.customStartDate,
      config.customEndDate
    );

    // Only allow joker if budget is negative but by less than 5€
    if (dailyBudget >= 0 || dailyBudget < -5) {
      return false;
    }

    data.streakInfo.jokersRemaining--;
    
    // Unlock badge for first use of joker
    if (!hasBadge(data, 'joker_user')) {
      await unlockBadge('joker_user', false);
    }

    const saved = await saveGamificationData(data);
    if (!saved) {
      console.error('Failed to save joker usage to storage');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error using joker:', error);
    return false;
  }
};

/**
 * Check if user can use a joker (budget negative by less than 5€)
 */
export const canUseJoker = async (): Promise<boolean> => {
  try {
    const data = await loadGamificationData();
    
    if (data.streakInfo.jokersRemaining <= 0) {
      return false;
    }

    const config = await loadBudgetConfig();
    if (!config) return false;

    const transactions = await getTransactionsForCurrentCycle(config.cycleStartDay);
    const totalSpent = transactions
      .filter(t => t.type !== 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cycleMode = config.cycleMode || 'monthly';
    const dailyBudget = calculateDailyBudget(
      config.monthlyIncome,
      config.fixedCharges,
      config.savingsGoal,
      totalSpent,
      config.cycleStartDay,
      totalIncome,
      config.midCycleOnboarding,
      cycleMode,
      config.customStartDate,
      config.customEndDate
    );

    // Can use joker if budget is negative but by less than 5€
    return dailyBudget < 0 && dailyBudget >= -5;
  } catch (error) {
    console.error('Error checking joker eligibility:', error);
    return false;
  }
};

/**
 * Update streak with gamification features (freeze support)
 */
export const updateStreakWithGamification = async (newStreakInfo: StreakInfo): Promise<void> => {
  try {
    const data = await loadGamificationData();
    
    // Check if streak would break and we have a freeze available
    if (newStreakInfo.currentStreak === 0 && 
        data.streakInfo.currentStreak > 0 && 
        data.streakInfo.streakFreezes > 0) {
      // Automatically use a freeze to save the streak
      data.streakInfo.streakFreezes--;
      // Keep the old streak value instead of resetting to 0
      newStreakInfo.currentStreak = data.streakInfo.currentStreak;
      newStreakInfo.isActive = true;
      
      // Unlock badge for first use of streak freeze
      if (!hasBadge(data, 'streak_saver')) {
        await unlockBadge('streak_saver', false);
      }
    }
    
    // Update streak info
    data.streakInfo = {
      ...newStreakInfo,
      streakFreezes: data.streakInfo.streakFreezes,
      jokersRemaining: data.streakInfo.jokersRemaining,
      lastJokerResetDate: data.streakInfo.lastJokerResetDate,
    };

    const saved = await saveGamificationData(data);
    if (!saved) {
      console.error('Failed to save streak data to storage');
      throw new Error('Failed to persist streak update');
    }
  } catch (error) {
    console.error('Error updating streak with gamification:', error);
    throw error;
  }
};


/**
 * Get badge metadata (name, description, emoji)
 */
export const getBadgeMetadata = (badgeType: BadgeType) => {
  const metadata: Record<BadgeType, { emoji: string; nameKey: string; descriptionKey: string }> = {
    first_step: { emoji: '🏅', nameKey: 'badges.firstStep.name', descriptionKey: 'badges.firstStep.description' },
    streak_7: { emoji: '🔥', nameKey: 'badges.streak7.name', descriptionKey: 'badges.streak7.description' },
    streak_30: { emoji: '🏆', nameKey: 'badges.streak30.name', descriptionKey: 'badges.streak30.description' },
    streak_100: { emoji: '💎', nameKey: 'badges.streak100.name', descriptionKey: 'badges.streak100.description' },
    perfect_balance: { emoji: '🎯', nameKey: 'badges.perfectBalance.name', descriptionKey: 'badges.perfectBalance.description' },
    budget_master: { emoji: '💰', nameKey: 'badges.budgetMaster.name', descriptionKey: 'badges.budgetMaster.description' },
    early_bird: { emoji: '🌅', nameKey: 'badges.earlyBird.name', descriptionKey: 'badges.earlyBird.description' },
    night_owl: { emoji: '🦉', nameKey: 'badges.nightOwl.name', descriptionKey: 'badges.nightOwl.description' },
    frugal_month: { emoji: '🌱', nameKey: 'badges.frugalMonth.name', descriptionKey: 'badges.frugalMonth.description' },
    saver: { emoji: '💎', nameKey: 'badges.saver.name', descriptionKey: 'badges.saver.description' },
    streak_saver: { emoji: '🧊', nameKey: 'badges.streakSaver.name', descriptionKey: 'badges.streakSaver.description' },
    joker_user: { emoji: '❤️', nameKey: 'badges.jokerUser.name', descriptionKey: 'badges.jokerUser.description' },
  };

  return metadata[badgeType];
};

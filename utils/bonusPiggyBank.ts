/**
 * Bonus Piggy Bank utilities for Epic 10.4
 * Handles the logic for transferring unspent daily budget to the bonus piggy bank
 */

import { BudgetProfile } from '../types';
import { getDaysRemainingInCycle } from './budgetCalculations';
import { getTransactionsForBudget, getBonusPiggyBank, addToBonusPiggyBank, saveBonusPiggyBank } from './storage';

/**
 * Check if we need to process unspent budget for yesterday
 * and add it to the bonus piggy bank
 * @param profile - Budget profile
 * @returns Amount added to piggy bank (0 if nothing was added)
 */
export const processUnspentDailyBudget = async (profile: BudgetProfile): Promise<number> => {
  try {
    const piggyBank = await getBonusPiggyBank(profile.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Yesterday
    
    const lastProcessedDate = piggyBank.lastProcessedDate
      ? new Date(piggyBank.lastProcessedDate)
      : new Date(0); // Unix epoch if never processed
    lastProcessedDate.setHours(0, 0, 0, 0);
    
    // Check if we already processed yesterday
    if (lastProcessedDate >= yesterday) {
      return 0; // Already processed
    }
    
    // Get all transactions up to yesterday to calculate what the daily budget was
    const transactions = await getTransactionsForBudget(profile.id, profile.cycleStartDay);
    
    // Filter transactions up to end of yesterday
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    const transactionsUpToYesterday = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate <= yesterdayEnd;
    });
    
    // Calculate spending and income up to yesterday
    const totalSpent = transactionsUpToYesterday.reduce((sum, t) => {
      return t.type === 'income' ? sum : sum + t.amount;
    }, 0);
    const totalIncome = transactionsUpToYesterday.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum;
    }, 0);
    
    // Check if user spent anything yesterday
    const yesterdayStart = new Date(yesterday);
    yesterdayStart.setHours(0, 0, 0, 0);
    const spentYesterday = transactionsUpToYesterday.some(t => {
      const txDate = new Date(t.date);
      return txDate >= yesterdayStart && txDate <= yesterdayEnd && t.type !== 'income';
    });
    
    // Only add to piggy bank if user didn't spend anything yesterday
    if (!spentYesterday) {
      // Calculate what the daily budget was at the start of yesterday
      // We need to calculate the budget as it would have been yesterday
      // by removing today's transactions from the calculation
      
      // For simplicity, we'll calculate the daily budget that was available yesterday
      // This is: remaining budget at start of yesterday / days remaining at that point
      
      // Get days remaining as of yesterday
      const daysRemainingYesterday = getDaysRemainingInCycle(profile.cycleStartDay) + 1;
      
      if (daysRemainingYesterday > 0) {
        const resteAVivre = profile.monthlyIncome - profile.fixedCharges - profile.savingsGoal;
        const remainingBudgetYesterday = resteAVivre - totalSpent + totalIncome;
        const dailyBudgetYesterday = remainingBudgetYesterday / daysRemainingYesterday;
        
        // Only add positive amounts
        if (dailyBudgetYesterday > 0) {
          const result = await addToBonusPiggyBank(dailyBudgetYesterday, profile.id);
          return result ? dailyBudgetYesterday : 0;
        }
      }
    }
    
    // Update last processed date even if we didn't add anything
    // to avoid checking the same day multiple times
    piggyBank.lastProcessedDate = yesterday.toISOString();
    await saveBonusPiggyBank(piggyBank, profile.id);
    
    return 0;
  } catch (error) {
    console.error('Error processing unspent daily budget:', error);
    return 0;
  }
};

/**
 * Get the current month's accumulated bonus amount
 * @param budgetId - Budget profile ID (optional)
 * @returns Total bonus accumulated this month
 */
export const getCurrentMonthBonus = async (budgetId?: string): Promise<number> => {
  try {
    const piggyBank = await getBonusPiggyBank(budgetId);
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const monthData = piggyBank.monthlyHistory.find(h => h.month === currentMonth);
    return monthData ? monthData.totalAccumulated : 0;
  } catch (error) {
    console.error('Error getting current month bonus:', error);
    return 0;
  }
};

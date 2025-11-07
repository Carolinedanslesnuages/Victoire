/**
 * Budget calculation utilities for the PACE app
 */

/**
 * Get the current budget cycle dates
 * @param {number} cycleStartDay - Day of month when cycle starts (1-31)
 * @returns {Object} Object with cycleStart and cycleEnd dates
 */
export const getCurrentCycle = (cycleStartDay) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  let cycleStart, cycleEnd;

  // If today is before cycle start day, cycle started last month
  if (day < cycleStartDay) {
    cycleStart = new Date(year, month - 1, cycleStartDay);
    cycleEnd = new Date(year, month, cycleStartDay - 1);
  } else {
    cycleStart = new Date(year, month, cycleStartDay);
    cycleEnd = new Date(year, month + 1, cycleStartDay - 1);
  }

  return { cycleStart, cycleEnd };
};

/**
 * Calculate days remaining in current cycle
 * @param {number} cycleStartDay - Day of month when cycle starts (1-31)
 * @returns {number} Number of days remaining in cycle
 */
export const getDaysRemainingInCycle = (cycleStartDay) => {
  const today = new Date();
  const { cycleEnd } = getCurrentCycle(cycleStartDay);
  
  const diffTime = cycleEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Calculate days elapsed in current cycle
 * @param {number} cycleStartDay - Day of month when cycle starts (1-31)
 * @returns {number} Number of days elapsed in cycle
 */
export const getDaysElapsedInCycle = (cycleStartDay) => {
  const today = new Date();
  const { cycleStart, cycleEnd } = getCurrentCycle(cycleStartDay);
  
  const totalDays = Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysRemaining = getDaysRemainingInCycle(cycleStartDay);
  
  return totalDays - daysRemaining;
};

/**
 * Calculate total days in current cycle
 * @param {number} cycleStartDay - Day of month when cycle starts (1-31)
 * @returns {number} Total number of days in cycle
 */
export const getTotalDaysInCycle = (cycleStartDay) => {
  const { cycleStart, cycleEnd } = getCurrentCycle(cycleStartDay);
  return Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Calculate daily budget based on remaining budget and days
 * @param {number} monthlyIncome - Monthly income
 * @param {number} fixedCharges - Fixed charges
 * @param {number} savingsGoal - Savings goal
 * @param {number} totalSpent - Total amount spent in current cycle
 * @param {number} cycleStartDay - Day of month when cycle starts
 * @returns {number} Daily budget for today
 */
export const calculateDailyBudget = (monthlyIncome, fixedCharges, savingsGoal, totalSpent, cycleStartDay) => {
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  const remainingBudget = resteAVivre - totalSpent;
  const daysRemaining = getDaysRemainingInCycle(cycleStartDay);
  
  // Avoid division by zero, if no days remaining, show the remaining budget
  if (daysRemaining === 0) {
    return remainingBudget;
  }
  
  return remainingBudget / daysRemaining;
};

/**
 * Calculate budget status based on spending pace
 * @param {number} monthlyIncome - Monthly income
 * @param {number} fixedCharges - Fixed charges
 * @param {number} savingsGoal - Savings goal
 * @param {number} totalSpent - Total amount spent in current cycle
 * @param {number} cycleStartDay - Day of month when cycle starts
 * @returns {Object} Status object with type and label
 */
export const calculateBudgetStatus = (monthlyIncome, fixedCharges, savingsGoal, totalSpent, cycleStartDay) => {
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  const daysElapsed = getDaysElapsedInCycle(cycleStartDay);
  const totalDays = getTotalDaysInCycle(cycleStartDay);
  
  // Calculate percentage of time elapsed vs percentage of budget spent
  const timeElapsedPercent = (daysElapsed / totalDays) * 100;
  const budgetSpentPercent = (totalSpent / resteAVivre) * 100;
  
  // If spending less than time elapsed, user is ahead
  if (budgetSpentPercent < timeElapsedPercent - 10) {
    return {
      type: 'ahead',
      label: 'En Avance',
      color: '#4CAF50', // Green
    };
  }
  
  // If spending more than time elapsed + 10%, user is behind
  if (budgetSpentPercent > timeElapsedPercent + 10) {
    return {
      type: 'behind',
      label: 'En Retard',
      color: '#FF3B30', // Red
    };
  }
  
  // Otherwise, user is on track but needs attention
  return {
    type: 'attention',
    label: 'Attention',
    color: '#FF9500', // Orange
  };
};

/**
 * Calculate percentage of budget spent
 * @param {number} monthlyIncome - Monthly income
 * @param {number} fixedCharges - Fixed charges
 * @param {number} savingsGoal - Savings goal
 * @param {number} totalSpent - Total amount spent in current cycle
 * @returns {number} Percentage of budget spent (0-100)
 */
export const calculateSpentPercentage = (monthlyIncome, fixedCharges, savingsGoal, totalSpent) => {
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  if (resteAVivre === 0) return 0;
  return Math.min(100, Math.max(0, (totalSpent / resteAVivre) * 100));
};

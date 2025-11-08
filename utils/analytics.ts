import { Transaction } from '../types';

/**
 * Category spending data
 */
export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

/**
 * Monthly comparison data
 */
export interface MonthlyComparison {
  currentMonth: number;
  previousMonth: number;
  difference: number;
  differencePercentage: number;
}

/**
 * Color palette for category pie chart
 */
const categoryColors = [
  '#00897B', // Teal (primary)
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#CDDC39', // Lime
  '#FF5722', // Deep Orange
  '#607D8B', // Blue Gray
];

/**
 * Calculate spending by category for a list of transactions
 * @param transactions - Array of transactions
 * @returns Array of category spending data sorted by amount (descending)
 */
export const calculateCategorySpending = (transactions: Transaction[]): CategorySpending[] => {
  if (transactions.length === 0) {
    return [];
  }

  // Group transactions by category
  const categoryMap = new Map<string, number>();
  
  transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';
    const currentAmount = categoryMap.get(category) || 0;
    categoryMap.set(category, currentAmount + transaction.amount);
  });

  // Calculate total spending
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Convert to array and calculate percentages
  const categorySpending: CategorySpending[] = [];
  let colorIndex = 0;
  
  categoryMap.forEach((amount, category) => {
    categorySpending.push({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
      color: categoryColors[colorIndex % categoryColors.length],
    });
    colorIndex++;
  });

  // Sort by amount (descending)
  return categorySpending.sort((a, b) => b.amount - a.amount);
};

/**
 * Get top N categories by spending
 * @param categorySpending - Array of category spending data
 * @param topN - Number of top categories to return
 * @returns Array of top N categories
 */
export const getTopCategories = (
  categorySpending: CategorySpending[],
  topN: number = 3
): CategorySpending[] => {
  return categorySpending.slice(0, topN);
};

/**
 * Compare current month spending with previous month at the same date
 * @param currentMonthTransactions - Transactions for current month cycle
 * @param previousMonthTransactions - Transactions for previous month cycle
 * @returns Monthly comparison data
 */
export const compareMonthlySpending = (
  currentMonthTransactions: Transaction[],
  previousMonthTransactions: Transaction[]
): MonthlyComparison => {
  const currentTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const previousTotal = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const difference = currentTotal - previousTotal;
  const differencePercentage = previousTotal > 0 
    ? (difference / previousTotal) * 100 
    : 0;

  return {
    currentMonth: currentTotal,
    previousMonth: previousTotal,
    difference,
    differencePercentage,
  };
};

/**
 * Get transactions for a specific date range
 * @param transactions - All transactions
 * @param startDate - Start date of the range
 * @param endDate - End date of the range
 * @returns Filtered transactions
 */
export const getTransactionsInDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

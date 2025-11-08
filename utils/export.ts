import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types';

/**
 * Convert transactions to CSV format
 * @param transactions - Array of transactions to export
 * @returns CSV string
 */
export const convertTransactionsToCSV = (
  transactions: Transaction[]
): string => {
  // CSV header
  const header = 'Date,Amount,Description,Category';
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Convert each transaction to a CSV row
  const rows = sortedTransactions.map(transaction => {
    const date = new Date(transaction.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const amount = transaction.amount.toFixed(2);
    const description = `"${transaction.description.replace(/"/g, '""')}"`;
    const category = transaction.category ? `"${transaction.category.replace(/"/g, '""')}"` : '';
    
    return `${date},${amount},${description},${category}`;
  });
  
  // Combine header and rows
  return [header, ...rows].join('\n');
};

/**
 * Export transactions to a CSV file and share it
 * @param transactions - Array of transactions to export
 * @returns Success status
 */
export const exportTransactionsToCSV = async (
  transactions: Transaction[]
): Promise<boolean> => {
  try {
    // Check if sharing is available on this device
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.error('Sharing is not available on this device');
      return false;
    }
    
    // Generate CSV content
    const csvContent = convertTransactionsToCSV(transactions);
    
    // Create a filename with current date
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `PACE_expenses_${timestamp}.csv`;
    const file = new File(Paths.cache, fileName);
    
    // Write CSV to file
    await file.create({ overwrite: true });
    await file.write(csvContent);
    
    // Share the file
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export PACE Expenses',
      UTI: 'public.comma-separated-values-text',
    });
    
    return true;
  } catch (error) {
    console.error('Error exporting transactions to CSV:', error);
    return false;
  }
};

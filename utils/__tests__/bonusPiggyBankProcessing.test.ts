/**
 * @jest-environment node
 */

import { processUnspentDailyBudget, getCurrentMonthBonus } from '../bonusPiggyBank';
import * as storage from '../storage';
import { BudgetProfile, Transaction, BonusPiggyBank } from '../../types';

// Mock the storage module
jest.mock('../storage');

describe('Bonus Piggy Bank Processing', () => {
  const mockProfile: BudgetProfile = {
    id: 'test-budget',
    type: 'personal',
    name: 'Test Budget',
    monthlyIncome: 2000,
    fixedCharges: 1000,
    savingsGoal: 200,
    cycleStartDay: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processUnspentDailyBudget', () => {
    it('should add to piggy bank when user did not spend yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      // Mock piggy bank with no processing yet
      const mockPiggyBank: BonusPiggyBank = {
        amount: 0,
        lastProcessedDate: '',
        monthlyHistory: [],
      };

      // Mock transactions - no transactions yesterday
      const mockTransactions: Transaction[] = [];

      (storage.getBonusPiggyBank as jest.Mock).mockResolvedValue(mockPiggyBank);
      (storage.getTransactionsForBudget as jest.Mock).mockResolvedValue(mockTransactions);
      (storage.addToBonusPiggyBank as jest.Mock).mockResolvedValue({
        ...mockPiggyBank,
        amount: 10,
        lastProcessedDate: yesterday.toISOString(),
        monthlyHistory: [{ month: '2024-01', totalAccumulated: 10 }],
      });
      (storage.saveBonusPiggyBank as jest.Mock).mockResolvedValue(true);

      const result = await processUnspentDailyBudget(mockProfile);

      expect(result).toBeGreaterThan(0);
      expect(storage.addToBonusPiggyBank).toHaveBeenCalled();
    });

    it('should not add to piggy bank when user spent yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(12, 0, 0, 0);

      const mockPiggyBank: BonusPiggyBank = {
        amount: 0,
        lastProcessedDate: '',
        monthlyHistory: [],
      };

      // Mock transactions - has expense yesterday
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          amount: 15,
          description: 'Coffee',
          date: yesterday.toISOString(),
          type: 'expense',
        },
      ];

      (storage.getBonusPiggyBank as jest.Mock).mockResolvedValue(mockPiggyBank);
      (storage.getTransactionsForBudget as jest.Mock).mockResolvedValue(mockTransactions);
      (storage.saveBonusPiggyBank as jest.Mock).mockResolvedValue(true);

      const result = await processUnspentDailyBudget(mockProfile);

      expect(result).toBe(0);
      expect(storage.addToBonusPiggyBank).not.toHaveBeenCalled();
    });

    it('should not process if already processed yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockPiggyBank: BonusPiggyBank = {
        amount: 50,
        lastProcessedDate: yesterday.toISOString(),
        monthlyHistory: [{ month: '2024-01', totalAccumulated: 50 }],
      };

      (storage.getBonusPiggyBank as jest.Mock).mockResolvedValue(mockPiggyBank);

      const result = await processUnspentDailyBudget(mockProfile);

      expect(result).toBe(0);
      expect(storage.getTransactionsForBudget).not.toHaveBeenCalled();
    });

    it('should ignore income transactions when checking for spending', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(12, 0, 0, 0);

      const mockPiggyBank: BonusPiggyBank = {
        amount: 0,
        lastProcessedDate: '',
        monthlyHistory: [],
      };

      // Mock transactions - only income yesterday (no expenses)
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          amount: 50,
          description: 'Gift',
          date: yesterday.toISOString(),
          type: 'income',
        },
      ];

      (storage.getBonusPiggyBank as jest.Mock).mockResolvedValue(mockPiggyBank);
      (storage.getTransactionsForBudget as jest.Mock).mockResolvedValue(mockTransactions);
      (storage.addToBonusPiggyBank as jest.Mock).mockResolvedValue({
        ...mockPiggyBank,
        amount: 10,
      });
      (storage.saveBonusPiggyBank as jest.Mock).mockResolvedValue(true);

      const result = await processUnspentDailyBudget(mockProfile);

      expect(result).toBeGreaterThan(0);
      expect(storage.addToBonusPiggyBank).toHaveBeenCalled();
    });
  });

  describe('getCurrentMonthBonus', () => {
    it('should return current month accumulated bonus', async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      const mockPiggyBank: BonusPiggyBank = {
        amount: 150,
        lastProcessedDate: today.toISOString(),
        monthlyHistory: [
          { month: currentMonth, totalAccumulated: 150 },
          { month: '2023-12', totalAccumulated: 100 },
        ],
      };

      (storage.getBonusPiggyBank as jest.Mock).mockResolvedValue(mockPiggyBank);

      const result = await getCurrentMonthBonus('test-budget');

      expect(result).toBe(150);
    });

    it('should return 0 if no data for current month', async () => {
      const mockPiggyBank: BonusPiggyBank = {
        amount: 100,
        lastProcessedDate: '2023-12-15T00:00:00.000Z',
        monthlyHistory: [
          { month: '2023-12', totalAccumulated: 100 },
        ],
      };

      (storage.getBonusPiggyBank as jest.Mock).mockResolvedValue(mockPiggyBank);

      const result = await getCurrentMonthBonus('test-budget');

      expect(result).toBe(0);
    });
  });
});

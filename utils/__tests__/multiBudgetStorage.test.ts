/**
 * Tests for multi-budget storage functions (Epic 25)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveBudgetProfiles,
  loadBudgetProfiles,
  getBudgetProfile,
  createBudgetProfile,
  updateBudgetProfile,
  deleteBudgetProfile,
  getActiveBudgetId,
  setActiveBudgetId,
  getActiveBudgetProfile,
  getTransactionsForBudget,
  saveTransaction,
} from '../storage';
import { BudgetProfile, Transaction } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('Multi-Budget Storage Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Budget Profile Management', () => {
    const testProfile: BudgetProfile = {
      id: 'test-budget-1',
      type: 'personal',
      name: 'Test Budget',
      monthlyIncome: 3000,
      fixedCharges: 1000,
      savingsGoal: 500,
      cycleStartDay: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
    };

    it('should save budget profiles', async () => {
      const profiles = [testProfile];
      const result = await saveBudgetProfiles(profiles);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pace_budget_profiles',
        JSON.stringify(profiles)
      );
    });

    it('should load budget profiles', async () => {
      const profiles = [testProfile];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(profiles));

      const result = await loadBudgetProfiles();

      expect(result).toEqual(profiles);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pace_budget_profiles');
    });

    it('should get a specific budget profile by ID', async () => {
      const profiles = [testProfile];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(profiles));

      const result = await getBudgetProfile('test-budget-1');

      expect(result).toEqual(testProfile);
    });

    it('should return null when budget profile not found', async () => {
      const profiles = [testProfile];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(profiles));

      const result = await getBudgetProfile('non-existent');

      expect(result).toBeNull();
    });

    it('should create a new budget profile', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const newProfile = {
        type: 'household' as const,
        name: 'Foyer',
        monthlyIncome: 5000,
        fixedCharges: 2000,
        savingsGoal: 1000,
        cycleStartDay: 1,
      };

      const result = await createBudgetProfile(newProfile);

      expect(result).toBeTruthy();
      expect(result?.type).toBe('household');
      expect(result?.name).toBe('Foyer');
      expect(result?.id).toBeTruthy();
      expect(result?.createdAt).toBeTruthy();
    });

    it('should update an existing budget profile', async () => {
      const profiles = [testProfile];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(profiles));

      const updates = {
        name: 'Updated Budget',
        monthlyIncome: 3500,
      };

      const result = await updateBudgetProfile('test-budget-1', updates);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should delete a budget profile', async () => {
      const profile2: BudgetProfile = {
        ...testProfile,
        id: 'test-budget-2',
        name: 'Budget 2',
      };
      const profiles = [testProfile, profile2];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(profiles));

      const result = await deleteBudgetProfile('test-budget-1');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should not delete the last budget profile', async () => {
      const profiles = [testProfile];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(profiles));

      const result = await deleteBudgetProfile('test-budget-1');

      expect(result).toBe(false);
    });
  });

  describe('Active Budget Management', () => {
    it('should set active budget ID', async () => {
      const result = await setActiveBudgetId('test-budget-1');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pace_active_budget_id',
        'test-budget-1'
      );
    });

    it('should get active budget ID', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-budget-1');

      const result = await getActiveBudgetId();

      expect(result).toBe('test-budget-1');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pace_active_budget_id');
    });

    it('should get active budget profile', async () => {
      const testProfile: BudgetProfile = {
        id: 'test-budget-1',
        type: 'personal',
        name: 'Test Budget',
        monthlyIncome: 3000,
        fixedCharges: 1000,
        savingsGoal: 500,
        cycleStartDay: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@pace_active_budget_id') {
          return Promise.resolve('test-budget-1');
        }
        if (key === '@pace_budget_profiles') {
          return Promise.resolve(JSON.stringify([testProfile]));
        }
        return Promise.resolve(null);
      });

      const result = await getActiveBudgetProfile();

      expect(result).toEqual(testProfile);
    });
  });

  describe('Transaction Budget Association', () => {
    beforeEach(() => {
      // Mock the current date to be consistent with test data
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T00:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should save transaction with budget ID', async () => {
      const budgetId = 'test-budget-1';
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@pace_active_budget_id') {
          return Promise.resolve(budgetId);
        }
        if (key === '@pace_transactions') {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.resolve(null);
      });

      const transaction = {
        amount: 50,
        description: 'Test expense',
        date: '2024-01-15T00:00:00.000Z',
      };

      const result = await saveTransaction(transaction);

      expect(result).toBe(true);
      
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const savedTransactions = JSON.parse(savedData);
      expect(savedTransactions[0].budgetId).toBe(budgetId);
    });

    it('should filter transactions by budget ID', async () => {
      const budgetId = 'test-budget-1';
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 50,
          description: 'Budget 1 expense',
          date: '2024-01-15T00:00:00.000Z',
          budgetId: 'test-budget-1',
        },
        {
          id: '2',
          amount: 75,
          description: 'Budget 2 expense',
          date: '2024-01-16T00:00:00.000Z',
          budgetId: 'test-budget-2',
        },
        {
          id: '3',
          amount: 100,
          description: 'Budget 1 expense 2',
          date: '2024-01-17T00:00:00.000Z',
          budgetId: 'test-budget-1',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(transactions)
      );

      const result = await getTransactionsForBudget(budgetId, 1);

      expect(result).toHaveLength(2);
      expect(result.every(t => t.budgetId === budgetId)).toBe(true);
    });

    it('should include legacy transactions without budgetId for default budget', async () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 50,
          description: 'Legacy expense',
          date: '2024-01-15T00:00:00.000Z',
          // No budgetId
        },
        {
          id: '2',
          amount: 75,
          description: 'New expense',
          date: '2024-01-16T00:00:00.000Z',
          budgetId: 'personal-default',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(transactions)
      );

      const result = await getTransactionsForBudget('personal-default', 1);

      expect(result).toHaveLength(2);
    });
  });

  describe('Migration from old format', () => {
    it('should migrate old budget config to new profile format', async () => {
      const oldConfig = {
        monthlyIncome: 3000,
        fixedCharges: 1000,
        savingsGoal: 500,
        cycleStartDay: 1,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@pace_budget_profiles') {
          return Promise.resolve(null);
        }
        if (key === '@pace_budget_config') {
          return Promise.resolve(JSON.stringify(oldConfig));
        }
        return Promise.resolve(null);
      });

      const result = await loadBudgetProfiles();

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('personal');
      expect(result[0].monthlyIncome).toBe(3000);
    });
  });
});

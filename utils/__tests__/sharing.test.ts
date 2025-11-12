import * as Sharing from 'expo-sharing';
import {
  shareAchievement,
  generateStreakShareText,
  generateBudgetShareText,
} from '../sharing';

// Mock the dependencies
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

jest.mock('../i18n', () => ({
  t: jest.fn((key: string, params?: any) => {
    const translations: { [key: string]: string } = {
      'sharing.streakMessage': `I've been managing my budget for ${params?.days} consecutive days with PACE! 🔥`,
      'sharing.budgetMessage': `I've stayed on budget for ${params?.days} days in a row with PACE! 💰`,
      'sharing.goalMessage': `I reached my savings goal with PACE! 🎯`,
      'sharing.defaultMessage': 'Managing my budget has never been easier with PACE!',
      'sharing.appPromo': '#PACE #BudgetApp',
      'sharing.shareDialogTitle': 'Share Your Success',
    };
    return translations[key] || key;
  }),
}));

describe('sharing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Sharing
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
  });

  describe('shareAchievement', () => {
    it('should share streak achievement successfully', async () => {
      const result = await shareAchievement('streak', 7);

      expect(result).toBe(true);
      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });

    it('should share budget achievement successfully', async () => {
      const result = await shareAchievement('budget', 14);

      expect(result).toBe(true);
      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });

    it('should share goal achievement successfully', async () => {
      const result = await shareAchievement('goal', 100);

      expect(result).toBe(true);
      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });

    it('should return false if sharing not available', async () => {
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      const result = await shareAchievement('streak', 7);

      expect(result).toBe(false);
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it('should return false on error', async () => {
      (Sharing.shareAsync as jest.Mock).mockRejectedValue(new Error('Share error'));

      const result = await shareAchievement('streak', 7);

      expect(result).toBe(false);
    });
  });

  describe('generateStreakShareText', () => {
    it('should generate streak share text correctly', () => {
      const text = generateStreakShareText(7);

      expect(text).toContain('7 consecutive days');
      expect(text).toContain('PACE');
      expect(text).toContain('#PACE');
    });

    it('should handle large streak numbers', () => {
      const text = generateStreakShareText(100);

      expect(text).toContain('100 consecutive days');
      expect(text).toContain('#PACE');
    });
  });

  describe('generateBudgetShareText', () => {
    it('should generate budget share text correctly', () => {
      const text = generateBudgetShareText(14);

      expect(text).toContain('14 days');
      expect(text).toContain('PACE');
      expect(text).toContain('#PACE');
    });

    it('should handle large day numbers', () => {
      const text = generateBudgetShareText(30);

      expect(text).toContain('30 days');
      expect(text).toContain('#PACE');
    });
  });
});

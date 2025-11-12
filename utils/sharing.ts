import * as Sharing from 'expo-sharing';
import i18n from './i18n';

/**
 * Share achievement success text to social media
 * US 17.2.1: Share stylized success message about streak achievements
 * 
 * @param achievementType - Type of achievement (e.g., 'streak', 'budget')
 * @param value - Value to display (e.g., streak count, days)
 * @returns Success status
 */
export const shareAchievement = async (
  achievementType: 'streak' | 'budget' | 'goal',
  value: number
): Promise<boolean> => {
  try {
    // Check if sharing is available on this device
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      console.error('Sharing is not available on this device');
      return false;
    }

    // Generate the message based on achievement type
    let message = '';
    
    switch (achievementType) {
      case 'streak':
        message = i18n.t('sharing.streakMessage', { days: value });
        break;
      case 'budget':
        message = i18n.t('sharing.budgetMessage', { days: value });
        break;
      case 'goal':
        message = i18n.t('sharing.goalMessage', { value });
        break;
      default:
        message = i18n.t('sharing.defaultMessage');
    }

    // Add app name to message
    message += ' ' + i18n.t('sharing.appPromo');

    // Share the text (on mobile, this will open share sheet)
    // Use Buffer for base64 encoding (works in both Node and React Native)
    const base64Message = Buffer.from(message, 'utf-8').toString('base64');
    await Sharing.shareAsync('data:text/plain;base64,' + base64Message, {
      mimeType: 'text/plain',
      dialogTitle: i18n.t('sharing.shareDialogTitle'),
    });

    return true;
  } catch (error) {
    console.error('Error sharing achievement:', error);
    return false;
  }
};

/**
 * Generate a shareable text for a streak achievement
 * @param streakDays - Number of consecutive days
 * @returns Formatted message string
 */
export const generateStreakShareText = (streakDays: number): string => {
  return i18n.t('sharing.streakMessage', { days: streakDays }) + ' ' + i18n.t('sharing.appPromo');
};

/**
 * Generate a shareable text for a budget success
 * @param days - Number of days with positive budget
 * @returns Formatted message string
 */
export const generateBudgetShareText = (days: number): string => {
  return i18n.t('sharing.budgetMessage', { days }) + ' ' + i18n.t('sharing.appPromo');
};

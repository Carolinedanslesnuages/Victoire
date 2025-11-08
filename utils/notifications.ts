import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationSettings } from '../types';
import { loadUserPreferences, loadBudgetConfig, getTransactionsForCurrentCycle } from './storage';
import { calculateDailyBudget } from './budgetCalculations';
import i18n from './i18n';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Notification identifiers
const EVENING_REMINDER_ID = 'evening-reminder';
const MORNING_BUDGET_ID = 'morning-budget';

/**
 * Request notification permissions
 * @returns Permission status
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    // For Android, create a notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

/**
 * Schedule evening reminder notification
 * @param settings - Notification settings
 */
export const scheduleEveningReminder = async (settings: NotificationSettings): Promise<void> => {
  try {
    if (!settings.eveningReminderEnabled) {
      await Notifications.cancelScheduledNotificationAsync(EVENING_REMINDER_ID).catch(() => {});
      return;
    }

    // Parse time (format: "HH:mm")
    const [hours, minutes] = settings.eveningReminderTime.split(':').map(Number);

    await Notifications.cancelScheduledNotificationAsync(EVENING_REMINDER_ID).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: EVENING_REMINDER_ID,
      content: {
        title: i18n.t('notifications.eveningReminder.title'),
        body: i18n.t('notifications.eveningReminder.body'),
        sound: true,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling evening reminder:', error);
  }
};

/**
 * Schedule morning budget notification
 * @param settings - Notification settings
 */
export const scheduleMorningBudgetNotification = async (settings: NotificationSettings): Promise<void> => {
  try {
    if (!settings.morningBudgetEnabled) {
      await Notifications.cancelScheduledNotificationAsync(MORNING_BUDGET_ID).catch(() => {});
      return;
    }

    // Parse time (format: "HH:mm")
    const [hours, minutes] = settings.morningBudgetTime.split(':').map(Number);

    await Notifications.cancelScheduledNotificationAsync(MORNING_BUDGET_ID).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: MORNING_BUDGET_ID,
      content: {
        title: i18n.t('notifications.morningBudget.title'),
        body: i18n.t('notifications.morningBudget.body'),
        sound: true,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling morning budget notification:', error);
  }
};

/**
 * Send immediate notification when daily budget goes negative
 * @param remainingBudget - The current remaining budget (negative value)
 * @param currency - Currency symbol
 */
export const sendBudgetAlertNotification = async (remainingBudget: number, currency: string): Promise<void> => {
  try {
    const preferences = await loadUserPreferences();
    
    if (!preferences.notificationSettings?.budgetAlertEnabled) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.budgetAlert.title'),
        body: i18n.t('notifications.budgetAlert.body', { 
          amount: Math.abs(remainingBudget).toFixed(2),
          currency 
        }),
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Immediate notification
    });
  } catch (error) {
    console.error('Error sending budget alert notification:', error);
  }
};

/**
 * Update morning budget notification with actual budget data
 * This should be called daily to update the notification content
 */
export const updateMorningBudgetContent = async (): Promise<void> => {
  try {
    const preferences = await loadUserPreferences();
    const budgetConfig = await loadBudgetConfig();
    
    if (!preferences.notificationSettings?.morningBudgetEnabled || !budgetConfig) {
      return;
    }

    const transactions = await getTransactionsForCurrentCycle(budgetConfig.cycleStartDay);
    const dailyBudget = calculateDailyBudget(budgetConfig, transactions);

    const [hours, minutes] = preferences.notificationSettings.morningBudgetTime.split(':').map(Number);

    await Notifications.cancelScheduledNotificationAsync(MORNING_BUDGET_ID).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: MORNING_BUDGET_ID,
      content: {
        title: i18n.t('notifications.morningBudget.title'),
        body: i18n.t('notifications.morningBudget.bodyWithAmount', { 
          amount: dailyBudget.toFixed(2),
          currency: preferences.currency
        }),
        sound: true,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error updating morning budget notification:', error);
  }
};

/**
 * Initialize all notifications based on user preferences
 */
export const initializeNotifications = async (): Promise<void> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    const preferences = await loadUserPreferences();
    const settings = preferences.notificationSettings;

    if (!settings) {
      return;
    }

    await scheduleEveningReminder(settings);
    await scheduleMorningBudgetNotification(settings);
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

/**
 * Get default notification settings
 */
export const getDefaultNotificationSettings = (): NotificationSettings => {
  return {
    eveningReminderEnabled: true,
    eveningReminderTime: '20:00',
    morningBudgetEnabled: true,
    morningBudgetTime: '08:00',
    budgetAlertEnabled: true,
  };
};

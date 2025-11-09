/**
 * Quick Actions (App Shortcuts) utilities
 * Handles 3D Touch / Long Press shortcuts on app icon
 */

import * as QuickActions from 'expo-quick-actions';
import i18n from './i18n';

export type QuickActionType = 'add_expense';

/**
 * Set up quick actions for the app
 * @param onAction - Callback function when a quick action is triggered
 */
export async function setupQuickActions(onAction: (actionType: string) => void): Promise<(() => void) | undefined> {
  try {
    // Define quick actions
    const actions: QuickActions.Action[] = [
      {
        id: 'add_expense',
        title: i18n.t('quickActions.addExpense.title'),
        subtitle: i18n.t('quickActions.addExpense.subtitle'),
        icon: 'add_expense', // Matches the icon defined in app.json
        params: { type: 'add_expense' },
      },
    ];

    // Set the quick actions
    await QuickActions.setItems(actions);

    // Listen for quick action events
    if (QuickActions.initial && typeof QuickActions.initial === 'function') {
      const initialAction = await (QuickActions.initial as () => Promise<QuickActions.Action | null>)();
      if (initialAction) {
        onAction(initialAction.id);
      }
    }

    const subscription = QuickActions.addListener((action) => {
      if (action) {
        onAction(action.id);
      }
    });

    // Return cleanup function
    return () => {
      subscription.remove();
    };
  } catch (error) {
    console.error('Error setting up quick actions:', error);
    return undefined;
  }
}

/**
 * Clear all quick actions
 */
export async function clearQuickActions(): Promise<void> {
  try {
    await QuickActions.setItems([]);
  } catch (error) {
    console.error('Error clearing quick actions:', error);
  }
}

/**
 * Haptic Feedback Utility
 * Epic 11.2: Haptic Feedback (Vibrations)
 */
import * as Haptics from 'expo-haptics';

/**
 * US 11.2.1: Success haptic feedback when expense is validated
 * Light impact for successful expense addition
 */
export const triggerSuccessHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * US 11.2.1: Warning haptic feedback when expense puts budget in the red
 * Heavy impact for warning/alert state
 */
export const triggerWarningHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};



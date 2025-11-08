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

/**
 * Light haptic feedback for general interactions
 * Can be used for button presses, selections, etc.
 */
export const triggerLightHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * Medium haptic feedback for moderate interactions
 */
export const triggerMediumHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

/**
 * Error haptic feedback for errors
 */
export const triggerErrorHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.log('Haptic feedback not available:', error);
  }
};

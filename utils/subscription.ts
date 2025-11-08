/**
 * Subscription utilities using RevenueCat
 */
import { SubscriptionPlan, SubscriptionInfo } from '../types';

/**
 * Initialize RevenueCat SDK
 * Note: In production, use actual API keys from RevenueCat dashboard
 */
export const initializePurchases = async (): Promise<void> => {
  try {
    // For development/demo purposes, we'll handle initialization gracefully
    // In production, replace with actual API keys:
    // iOS: Purchases.configure({ apiKey: 'appl_XXX' });
    // Android: Purchases.configure({ apiKey: 'goog_XXX' });
    
    // For now, we'll use a mock implementation that allows the UI to work
    console.log('RevenueCat: Would initialize in production with API keys');
  } catch (error) {
    console.error('Error initializing purchases:', error);
  }
};

/**
 * Get current subscription status
 */
export const getSubscriptionStatus = async (): Promise<SubscriptionInfo> => {
  try {
    // In production, fetch from RevenueCat:
    // const customerInfo = await Purchases.getCustomerInfo();
    // return parseSubscriptionInfo(customerInfo);
    
    // For demo/development, return free tier
    return {
      status: 'free',
      isActive: false,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      status: 'free',
      isActive: false,
    };
  }
};

/**
 * Check if user has premium access
 */
export const hasPremiumAccess = async (): Promise<boolean> => {
  const subscriptionInfo = await getSubscriptionStatus();
  return subscriptionInfo.isActive && subscriptionInfo.status === 'premium';
};

/**
 * Purchase a subscription
 */
export const purchaseSubscription = async (plan: SubscriptionPlan): Promise<boolean> => {
  try {
    // In production, use RevenueCat:
    // const offerings = await Purchases.getOfferings();
    // const packageToPurchase = plan === 'monthly' 
    //   ? offerings.current?.monthly 
    //   : offerings.current?.annual;
    // 
    // if (packageToPurchase) {
    //   const purchaserInfo = await Purchases.purchasePackage(packageToPurchase);
    //   return purchaserInfo.entitlements.active['premium'] !== undefined;
    // }
    
    console.log(`Would purchase ${plan} subscription in production`);
    return false; // Return false in demo mode
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    return false;
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    // In production, use RevenueCat:
    // const customerInfo = await Purchases.restorePurchases();
    // return customerInfo.entitlements.active['premium'] !== undefined;
    
    console.log('Would restore purchases in production');
    return false; // Return false in demo mode
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return false;
  }
};

/**
 * Get available subscription offerings
 */
export const getOfferings = async () => {
  try {
    // In production, use RevenueCat:
    // const offerings = await Purchases.getOfferings();
    // return offerings.current;
    
    // For demo, return mock data
    return {
      monthly: {
        identifier: 'monthly',
        priceString: '€2.99',
        price: 2.99,
      },
      annual: {
        identifier: 'annual',
        priceString: '€24.99',
        price: 24.99,
      },
    };
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
};

/**
 * Premium features list
 * Defines which features require a premium subscription
 */
export const PREMIUM_FEATURES = {
  UNLIMITED_CATEGORIES: 'unlimited_categories',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  CLOUD_BACKUP: 'cloud_backup',
  EXPORT_DATA: 'export_data',
} as const;

/**
 * Check if a specific feature is available to the user
 */
export const isFeatureAvailable = async (feature: string): Promise<boolean> => {
  const isPremium = await hasPremiumAccess();
  
  // Free tier limits
  if (!isPremium) {
    switch (feature) {
      case PREMIUM_FEATURES.UNLIMITED_CATEGORIES:
        return false; // Limit to 3 custom categories for free users
      case PREMIUM_FEATURES.ADVANCED_ANALYTICS:
        return false;
      case PREMIUM_FEATURES.CLOUD_BACKUP:
        return false;
      case PREMIUM_FEATURES.EXPORT_DATA:
        return false;
      default:
        return true; // Other features are free
    }
  }
  
  return true; // Premium users get everything
};

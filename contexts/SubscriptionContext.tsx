/**
 * Subscription Context
 * Manages subscription state across the application
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubscriptionInfo } from '../types';
import { getSubscriptionStatus, initializePurchases } from '../utils/subscription';

interface SubscriptionContextType {
  subscriptionInfo: SubscriptionInfo;
  isLoading: boolean;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    status: 'free',
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await initializePurchases();
    await refreshSubscription();
  };

  const refreshSubscription = async () => {
    setIsLoading(true);
    try {
      const info = await getSubscriptionStatus();
      setSubscriptionInfo(info);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = subscriptionInfo.isActive && subscriptionInfo.status === 'premium';

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionInfo,
        isLoading,
        isPremium,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

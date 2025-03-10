"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { SubscriptionResponse, UserSubscriptionPlan } from "types";

// ⚡ Configurable constants for the subscription system
const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 🕒 Refresh every 10 minutes
const SUBSCRIPTION_ENDPOINT = "/api/subscription";

// 📋 Define the shape of our subscription context
type SubscriptionContextType = {
  subscription: UserSubscriptionPlan | null;
  hasAccess: boolean;
  isLoading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
  refresh: () => Promise<void>; // 🔄 Manual refresh function
};

// 🏗️ Create context with safe default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  hasAccess: false,
  isLoading: true,
  error: null,
  lastRefreshed: null,
  refresh: async () => {}, // Empty placeholder
});

// 🎣 Custom hook for easy context consumption
export const useSubscription = () => useContext(SubscriptionContext);

type SubscriptionProviderProps = {
  children: React.ReactNode;
  initialData?: SubscriptionResponse | null;
  autoRefresh?: boolean; // 🚦 Toggle automatic refreshing
};

export function SubscriptionProvider({
  children,
  initialData = null,
  autoRefresh = true,
}: SubscriptionProviderProps) {
  // 🗄️ Store subscription state
  const [subscription, setSubscription] = useState<UserSubscriptionPlan | null>(
    initialData?.subscription || null,
  );
  const [hasAccess, setHasAccess] = useState<boolean>(
    initialData?.userHasAccess || false,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(
    initialData ? new Date() : null,
  );

  // 🔄 Fetch subscription data from the API
  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(SUBSCRIPTION_ENDPOINT);

      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.status}`);
      }

      const data: SubscriptionResponse = await response.json();

      // 📊 Update state with fresh data
      setSubscription(data.subscription);
      setHasAccess(data.userHasAccess);
      setLastRefreshed(new Date());

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("💥 Subscription fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧠 Exposed refresh function for manual updates (memoized to prevent dependency loops)
  const refresh = React.useCallback(async () => {
    await fetchSubscription();
  }, []);

  // ⏱️ Set up auto-refresh interval when enabled
  useEffect(() => {
    // Skip if auto-refresh is disabled or we're in SSR
    if (!autoRefresh || typeof window === "undefined") return;

    // Initial fetch if no data was provided
    if (!initialData) {
      fetchSubscription();
    }

    // Set up the refresh interval
    const intervalId = setInterval(() => {
      fetchSubscription();
    }, AUTO_REFRESH_INTERVAL);

    // 🧹 Clean up on unmount
    return () => clearInterval(intervalId);
  }, [autoRefresh, initialData]);

  // 🎁 Context value with all subscription data and utilities
  const value = {
    subscription,
    hasAccess,
    isLoading,
    error,
    lastRefreshed,
    refresh,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

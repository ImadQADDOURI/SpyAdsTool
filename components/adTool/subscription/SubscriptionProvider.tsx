// @components/adLibrary/subscription/SubscriptionProvider.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { SubscriptionResponse, UserSubscriptionPlan } from "types"; // Assuming 'types' is a project alias or relative path

// ⚡ Configurable constants for the subscription system
const AUTO_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 🕒 Refresh every 24 hours
const SUBSCRIPTION_ENDPOINT = "/api/subscription"; // 🔗 API endpoint for subscription data

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
  isLoading: true, // Start with loading true, as data will be fetched on mount
  error: null,
  lastRefreshed: null,
  refresh: async () => {
    console.warn("🔄 Refresh function called before provider initialization.");
  },
});

// 🎣 Custom hook for easy context consumption
export const useSubscription = () => useContext(SubscriptionContext);

type SubscriptionProviderProps = {
  children: React.ReactNode;
  autoRefresh?: boolean; // 🚦 Toggle automatic refreshing (defaults to true)
};

export function SubscriptionProvider({
  children,
  autoRefresh = true,
}: SubscriptionProviderProps) {
  // 🗄️ Store subscription state
  const [subscription, setSubscription] = useState<UserSubscriptionPlan | null>(
    null,
  );
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Always start loading true
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const DEBUG = process.env.NEXT_PUBLIC_DEBUG_SUBSCRIPTION === "true";

  // 🔄 Core fetch subscription data function
  const fetchSubscriptionData = useCallback(
    async (isForcedRefresh = false) => {
      if (DEBUG)
        console.log(
          `📡 [SubscriptionProvider] Fetching subscription data... Forced: ${isForcedRefresh}`,
        );
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(SUBSCRIPTION_ENDPOINT, {
          cache: "no-store", // Ensures no client-side HTTP caching is used.
          headers: isForcedRefresh ? { "x-force-refresh": "true" } : {},
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(
            `💀 [SubscriptionProvider] API Error: ${response.status}`,
            errorData,
          );
          throw new Error(
            `Failed to fetch subscription: ${response.status} - ${errorData || response.statusText}`,
          );
        }

        const data: SubscriptionResponse = await response.json();
        if (DEBUG)
          console.log("✅ [SubscriptionProvider] Data received:", data);

        setSubscription(data.subscription);
        setHasAccess(data.userHasAccess);
        setLastRefreshed(new Date());
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        if (DEBUG)
          console.error(
            "💥 [SubscriptionProvider] Fetch subscription error:",
            errorMessage,
          );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        if (DEBUG) console.log("🏁 [SubscriptionProvider] Fetching complete.");
      }
    },
    [DEBUG],
  );

  // 🧠 Exposed refresh function for manual updates (memoized)
  const refresh = useCallback(async () => {
    if (DEBUG)
      console.log("🔄 [SubscriptionProvider] Manual refresh triggered.");
    await fetchSubscriptionData(true); // Pass true to indicate a forced refresh
  }, [fetchSubscriptionData, DEBUG]);

  // ⏱️ Effect for initial data load and auto-refresh
  useEffect(() => {
    if (DEBUG)
      console.log(
        "🚀 [SubscriptionProvider] Mounted. Triggering initial fetch.",
      );
    fetchSubscriptionData(); // Always fetch data on mount

    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh && typeof window !== "undefined") {
      if (DEBUG)
        console.log(
          `🕒 [SubscriptionProvider] Auto-refresh enabled. Interval: ${AUTO_REFRESH_INTERVAL / 1000}s`,
        );
      intervalId = setInterval(() => {
        if (DEBUG)
          console.log(
            "⏰ [SubscriptionProvider] Auto-refresh triggered by interval.",
          );
        fetchSubscriptionData();
      }, AUTO_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        if (DEBUG)
          console.log(
            "🧹 [SubscriptionProvider] Cleaned up auto-refresh interval.",
          );
      }
    };
  }, [autoRefresh, fetchSubscriptionData, DEBUG]); // Removed initialData from dependencies

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

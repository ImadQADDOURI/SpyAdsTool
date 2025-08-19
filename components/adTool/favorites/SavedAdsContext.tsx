// src/contexts/SavedAdsContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserSavedData } from "@/actions/savedAds";
import { toast } from "sonner";

// 📊 Types for our context data
export type Board = {
  name: string;
  count: number;
  lastUpdated: Date;
  coverImage: string | null;
};

// 🎯 Lightweight type for saved ad lookup
export type SavedAdLookup = {
  ad_archive_id: string;
  board: string;
};

export type SavedAdsContextType = {
  isLoading: boolean;
  boards: Board[];
  savedAdIds: SavedAdLookup[]; // Lightweight data for isAdSaved checks
  refreshData: () => Promise<void>;
  error: string | null;
};

// 🎯 Create the context with default values
const SavedAdsContext = createContext<SavedAdsContextType>({
  isLoading: true,
  boards: [],
  savedAdIds: [],
  refreshData: async () => {},
  error: null,
});

// 🧩 Custom hook to use the context
export const useSavedAds = () => useContext(SavedAdsContext);

// 📄 Provider component
export const SavedAdsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAdIds, setSavedAdIds] = useState<SavedAdLookup[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  // 🚀 Fetch both saved IDs and boards in one call
  const fetchSavedData = async () => {
    try {
      setIsLoading(true);
      const result = await fetchUserSavedData();

      if ("error" in result) {
        setError(result.error || "An unknown error occurred");
        return;
      }

      setSavedAdIds(result.savedIds);
      setBoards(result.boards);
    } catch (err) {
      setError("Failed to fetch saved data");
      toast.error("Failed to load your saved data");
    } finally {
      setIsLoading(false);
    }
  };

  // 📄 Refresh data
  const refreshData = async () => {
    await fetchSavedData();
  };

  // 🚀 Initial data load
  useEffect(() => {
    fetchSavedData();
  }, []);

  return (
    <SavedAdsContext.Provider
      value={{
        isLoading,
        boards,
        savedAdIds,
        refreshData,
        error,
      }}
    >
      {children}
    </SavedAdsContext.Provider>
  );
};

// src/contexts/SavedAdsContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchUserSavedAdIds,
  fetchUserSavedAds,
  getUserBoards,
} from "@/actions/savedAds";
import { toast } from "sonner";

import { AdData } from "@/types/ad";

// 📊 Types for our context data
export type SavedAd = {
  id: string;
  ad_archive_id: string;
  board: string;
  adData: AdData;
  imageUrl?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Board = {
  name: string;
  count: number;
  lastUpdated?: Date;
  coverImage?: string | null;
};

export type PaginationInfo = {
  total: number;
  pages: number;
  current: number;
};

// 🎯 Lightweight type for saved ad lookup
export type SavedAdLookup = {
  ad_archive_id: string;
  board: string;
};

export type SavedAdsContextType = {
  isLoading: boolean;
  boards: Board[];
  savedAds: SavedAd[]; // Full data for display
  savedAdIds: SavedAdLookup[]; // Lightweight data for isAdSaved checks
  pagination: PaginationInfo;
  refreshData: () => Promise<void>;
  refreshBoards: () => Promise<void>;
  refreshSavedIds: () => Promise<void>;
  error: string | null;
};

// 🎯 Create the context with default values
const SavedAdsContext = createContext<SavedAdsContextType>({
  isLoading: true,
  boards: [],
  savedAds: [],
  savedAdIds: [],
  pagination: { total: 0, pages: 0, current: 1 },
  refreshData: async () => {},
  refreshBoards: async () => {},
  refreshSavedIds: async () => {},
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
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [savedAdIds, setSavedAdIds] = useState<SavedAdLookup[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    current: 1,
  });

  // 🆔 Fetch only saved ad IDs (lightweight)
  const fetchSavedIds = async () => {
    try {
      const result = await fetchUserSavedAdIds();

      if ("error" in result) {
        setError(result.error || "An unknown error occurred");
        return;
      }

      setSavedAdIds(result.savedIds);
    } catch (err) {
      setError("Failed to fetch saved ad IDs");
    }
  };

  // 🔥 Fetch paginated saved ads (full data for display)
  const fetchSavedAds = async (page = 1, pageSize = 20) => {
    try {
      setIsLoading(true);
      const result = await fetchUserSavedAds(page, pageSize);

      if ("error" in result) {
        setError(result.error || "An unknown error occurred");
        return;
      }

      setSavedAds(result.ads as unknown as SavedAd[]);
      setPagination(result.pagination);
    } catch (err) {
      setError("Failed to fetch saved ads");
      toast.error("Failed to load your saved ads");
    } finally {
      setIsLoading(false);
    }
  };

  // 🗂️ Fetch all boards with metadata
  const fetchBoards = async () => {
    try {
      const result = await getUserBoards();

      if ("error" in result) {
        setError(result.error || "An unknown error occurred");
        return;
      }

      // Process boards to add cover images and last updated
      const boardsData = result.boards.map((board) => {
        // Find the most recently updated ad for this board
        const boardAds = savedAds.filter((ad) => ad.board === board.name);
        const latestAd = boardAds.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0];

        return {
          name: board.name,
          count: board.count,
          lastUpdated: latestAd?.updatedAt,
          coverImage: latestAd?.imageUrl || null,
        };
      });

      setBoards(boardsData);
    } catch (err) {
      setError("Failed to fetch boards");
      toast.error("Failed to load your boards");
    }
  };

  // 🔄 Refresh all data
  const refreshData = async () => {
    await fetchSavedAds();
    await fetchBoards();
  };

  // 📄 Refresh just boards
  const refreshBoards = async () => {
    await fetchBoards();
  };

  // 🆔 Refresh just saved IDs
  const refreshSavedIds = async () => {
    await fetchSavedIds();
  };

  // 🚀 Initial data load
  useEffect(() => {
    // Load saved IDs immediately for isAdSaved checks
    fetchSavedIds();
    // Load full data for display
    refreshData();
  }, []);

  // 🧠 Recalculate board metadata when saved ads change
  useEffect(() => {
    if (savedAds.length > 0) {
      fetchBoards();
    }
  }, [savedAds]);

  return (
    <SavedAdsContext.Provider
      value={{
        isLoading,
        boards,
        savedAds,
        savedAdIds,
        pagination,
        refreshData,
        refreshBoards,
        refreshSavedIds,
        error,
      }}
    >
      {children}
    </SavedAdsContext.Provider>
  );
};

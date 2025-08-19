// src/hooks/useSavedAdsActions.ts
"use client";

import { useCallback } from "react";
import {
  deleteBoard,
  moveAdsToBoard,
  removeAdFromBoard,
  renameBoard,
  saveAdToBoard,
} from "@/actions/savedAds";
import { toast } from "sonner";

import { AdData } from "@/types/ad";

import { useSavedAds } from "./SavedAdsContext";

export const useSavedAdsActions = () => {
  const { refreshData, refreshBoards, refreshSavedIds, boards, savedAdIds } =
    useSavedAds();

  // 💾 Save an ad to a board
  const saveAd = useCallback(
    async (ad_archive_id: string, board: string, adData: AdData) => {
      try {
        const result = await saveAdToBoard(ad_archive_id, board, adData);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success(`Saved to ${board}`);
        // Refresh both the IDs (for immediate UI feedback) and full data
        await Promise.all([refreshSavedIds(), refreshData()]);
        return true;
      } catch (error) {
        toast.error("Failed to save ad");
        return false;
      }
    },
    [refreshData, refreshSavedIds],
  );

  // 🗑️ Remove an ad from a board
  const removeAd = useCallback(
    async (ad_archive_id: string, board: string) => {
      try {
        const result = await removeAdFromBoard(ad_archive_id, board);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success("Ad removed");
        // Refresh both the IDs (for immediate UI feedback) and full data
        await Promise.all([refreshSavedIds(), refreshData()]);
        return true;
      } catch (error) {
        toast.error("Failed to remove ad");
        return false;
      }
    },
    [refreshData, refreshSavedIds],
  );

  // ✏️ Rename a board
  const rename = useCallback(
    async (oldName: string, newName: string) => {
      try {
        const result = await renameBoard(oldName, newName);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success(`Renamed to ${newName}`);
        await Promise.all([refreshSavedIds(), refreshData()]);
        return true;
      } catch (error) {
        toast.error("Failed to rename board");
        return false;
      }
    },
    [refreshData, refreshSavedIds],
  );

  // 🗑️ Delete a board
  const deleteABoard = useCallback(
    async (board: string) => {
      try {
        const result = await deleteBoard(board);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success("Board deleted");
        await Promise.all([refreshSavedIds(), refreshData()]);
        return true;
      } catch (error) {
        toast.error("Failed to delete board");
        return false;
      }
    },
    [refreshData, refreshSavedIds],
  );

  // 📄 Move ads between boards
  const moveAds = useCallback(
    async (sourceBoard: string, targetBoard: string) => {
      try {
        const result = await moveAdsToBoard(sourceBoard, targetBoard);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success(`Moved to ${targetBoard}`);
        await Promise.all([refreshSavedIds(), refreshData()]);
        return true;
      } catch (error) {
        toast.error("Failed to move ads");
        return false;
      }
    },
    [refreshData, refreshSavedIds],
  );

  // 🔍 Check if an ad is saved to a specific board (now uses lightweight data)
  const isAdSaved = useCallback(
    (ad_archive_id: string, board?: string) => {
      if (board) {
        return savedAdIds.some(
          (item) =>
            item.ad_archive_id === ad_archive_id && item.board === board,
        );
      }
      return savedAdIds.some((item) => item.ad_archive_id === ad_archive_id);
    },
    [savedAdIds],
  );

  // 📋 Get all boards an ad is saved to (now uses lightweight data)
  const getAdBoards = useCallback(
    (ad_archive_id: string) => {
      return savedAdIds
        .filter((item) => item.ad_archive_id === ad_archive_id)
        .map((item) => item.board);
    },
    [savedAdIds],
  );

  return {
    saveAd,
    removeAd,
    rename,
    deleteBoard: deleteABoard,
    moveAds,
    isAdSaved,
    getAdBoards,
    boards,
  };
};

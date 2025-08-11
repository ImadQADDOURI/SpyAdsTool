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
  const { refreshData, refreshBoards, boards, savedAds } = useSavedAds();

  // 💾 Save an ad to a board
  const saveAd = useCallback(
    async (ad_archive_id: string, board: string, adData: AdData) => {
      try {
        //toast.loading("Saving ad...");
        const result = await saveAdToBoard(ad_archive_id, board, adData);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success(`Saved to ${board}`);
        await refreshData();
        return true;
      } catch (error) {
        toast.error("Failed to save ad");
        return false;
      }
    },
    [refreshData],
  );

  // 🗑️ Remove an ad from a board
  const removeAd = useCallback(
    async (ad_archive_id: string, board: string) => {
      try {
        //toast.loading("Removing ad...");
        const result = await removeAdFromBoard(ad_archive_id, board);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success("Ad removed");
        await refreshData();
        return true;
      } catch (error) {
        toast.error("Failed to remove ad");
        return false;
      }
    },
    [refreshData],
  );

  // ✏️ Rename a board
  const rename = useCallback(
    async (oldName: string, newName: string) => {
      try {
        //toast.loading("Renaming board...");
        const result = await renameBoard(oldName, newName);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success(`Renamed to ${newName}`);
        await refreshData();
        return true;
      } catch (error) {
        toast.error("Failed to rename board");
        return false;
      }
    },
    [refreshData],
  );

  // 🗑️ Delete a board
  const deleteABoard = useCallback(
    async (board: string) => {
      try {
        //toast.loading("Deleting board...");
        const result = await deleteBoard(board);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success("Board deleted");
        await refreshData();
        return true;
      } catch (error) {
        toast.error("Failed to delete board");
        return false;
      }
    },
    [refreshData],
  );

  // 🔄 Move ads between boards
  const moveAds = useCallback(
    async (sourceBoard: string, targetBoard: string) => {
      try {
        //toast.loading("Moving ads...");
        const result = await moveAdsToBoard(sourceBoard, targetBoard);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success(`Moved to ${targetBoard}`);
        await refreshData();
        return true;
      } catch (error) {
        toast.error("Failed to move ads");
        return false;
      }
    },
    [refreshData],
  );

  // 🔍 Check if an ad is saved to a specific board
  const isAdSaved = useCallback(
    (ad_archive_id: string, board?: string) => {
      if (board) {
        return savedAds.some(
          (ad) => ad.ad_archive_id === ad_archive_id && ad.board === board,
        );
      }
      return savedAds.some((ad) => ad.ad_archive_id === ad_archive_id);
    },
    [savedAds],
  );

  // 📋 Get all boards an ad is saved to
  const getAdBoards = useCallback(
    (ad_archive_id: string) => {
      return savedAds
        .filter((ad) => ad.ad_archive_id === ad_archive_id)
        .map((ad) => ad.board);
    },
    [savedAds],
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

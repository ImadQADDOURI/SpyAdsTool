// src/hooks/useSavedAdsActions.ts
"use client";

import { useCallback } from "react";
import {
  // prettier-ignore
  deleteBoard,
  exportUserAds,
  importUserAds,
  moveAdsToBoard,
  removeAdFromBoard,
  renameBoard,
  saveAdToBoard,
} from "@/actions/savedAds";
import { toast } from "sonner";

import { AdData } from "@/types/ad";

import { useSavedAds } from "./SavedAdsContext";

export const useSavedAdsActions = () => {
  const { refreshData, boards, savedAdIds } = useSavedAds();

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
        // Refresh data for immediate UI feedback
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
        const result = await removeAdFromBoard(ad_archive_id, board);

        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        toast.success("Ad removed");
        // Refresh data for immediate UI feedback
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
        await refreshData();
        return true;
      } catch (error) {
        toast.error("Failed to move ads");
        return false;
      }
    },
    [refreshData],
  );

  // 📤 Export all ads
  const exportAds = useCallback(async () => {
    try {
      toast.info("Preparing your export...");
      const result = await exportUserAds();

      if (result.error) {
        toast.error(result.error);
        return false;
      }

      if (!result.data || result.data.length === 0) {
        toast.warning("You have no saved ads to export.");
        return true; // Not an error, just nothing to do
      }

      const jsonString = JSON.stringify(result.data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      link.download = `saved-ads-export-${date}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export successful! Check your downloads.");
      return true;
    } catch (error) {
      toast.error("Failed to export ads.");
      console.error(error);
      return false;
    }
  }, []);

  // 📥 Import ads from a file
  const importAds = useCallback(
    async (file: File) => {
      if (!file) return false;
      if (file.type !== "application/json") {
        toast.error("Invalid file type. Please select a JSON file.");
        return false;
      }

      try {
        toast.info("Importing ads... This may take a moment.");
        const jsonContent = await file.text();
        const result = await importUserAds(jsonContent);

        if (result.error) {
          toast.error(result.error);
          return false;
        }

        if (result.success && result.summary) {
          const { imported, duplicates, errors } = result.summary;
          let message = `Import complete. Imported: ${imported}.`;
          if (duplicates && duplicates > 0) {
            message += ` Duplicates skipped: ${duplicates}.`;
          }
          if (errors > 0) {
            // Now 'errors' refers to actual processing errors
            message += ` Errors: ${errors}.`;
          }
          toast.success(message);
          await refreshData();
        } else if (result.summary?.message) {
          toast.info(result.summary.message);
        }
        return true;
      } catch (error) {
        toast.error("An unexpected error occurred during import.");
        console.error(error);
        return false;
      }
    },
    [refreshData],
  );

  // 🔍 Check if an ad is saved to a specific board
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

  // 📋 Get all boards an ad is saved to
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
    exportAds,
    importAds,
    getAdBoards,
    boards,
  };
};

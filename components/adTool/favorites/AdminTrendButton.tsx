// src/components/AdminTrendButton.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useSavedAdsActions } from "./useSavedAdsActions";

type AdminTrendButtonProps = {
  ad: AdData;
  className?: string;
};

export default function AdminTrendButton({
  ad,
  className,
}: AdminTrendButtonProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 Optimized: Direct destructuring from actions hook
  const { saveAd, removeAd, isAdSaved } = useSavedAdsActions();

  const ad_archive_id = ad.ad_archive_id || "";
  const trendBoardName = process.env.NEXT_PUBLIC_TREND_BOARD_NAME;

  // 🎯 Optimized: Use memoized check instead of getAdBoards + includes
  const isInTrend = useMemo(
    () => (trendBoardName ? isAdSaved(ad_archive_id, trendBoardName) : false),
    [isAdSaved, ad_archive_id, trendBoardName],
  );

  // 🎯 Optimized: Use useCallback to prevent function recreation
  const handleTrendToggle = useCallback(async () => {
    if (!ad_archive_id || !trendBoardName) {
      toast.error("Invalid ad data or trend board not configured");
      return;
    }

    setIsLoading(true);

    try {
      const success = isInTrend
        ? await removeAd(ad_archive_id, trendBoardName)
        : await saveAd(ad_archive_id, trendBoardName, ad);

      if (success) {
        toast.success(
          `${isInTrend ? "Removed from" : "Added to"} ${trendBoardName}`,
        );
      }
    } catch (error) {
      console.error("Failed to toggle trend board:", error);
      toast.error("Failed to update trend status");
    } finally {
      setIsLoading(false);
    }
  }, [ad_archive_id, trendBoardName, isInTrend, removeAd, saveAd, ad]);

  // Early returns for better performance
  if (status === "loading") return null;
  if (!session?.user || session.user.role !== "ADMIN") return null;

  if (!trendBoardName) {
    return (
      <div className={className}>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-2 opacity-50"
        >
          <TrendingUp className="h-4 w-4" />
          Unavailable
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        variant={isInTrend ? "default" : "outline"}
        size="sm"
        disabled={isLoading}
        onClick={handleTrendToggle}
        className={cn(
          "gap-2 transition-all",
          isInTrend
            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
            : "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/30",
          isLoading && "cursor-not-allowed opacity-70",
        )}
        aria-label={isInTrend ? "Remove from trend" : "Add to trend"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isInTrend ? (
          <TrendingDown className="h-4 w-4" />
        ) : (
          <TrendingUp className="h-4 w-4" />
        )}
        {isLoading
          ? isInTrend
            ? "Removing..."
            : "Adding..."
          : isInTrend
            ? "Remove"
            : "Add"}
      </Button>
    </div>
  );
}

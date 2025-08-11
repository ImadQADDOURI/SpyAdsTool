// @/components/adLibrary/favorites/TrendAds.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTrendAds } from "@/actions/savedAds";
import { ArrowRight, ChevronRight, Flame, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { AdCardGrid } from "@/components/adTool/sharedComponents/AdCardGrid";
import { Loading } from "@/components/adTool/sharedComponents/Loading";
import LoadingTrigger from "@/components/adTool/sharedComponents/LoadingTrigger";
import { ScrollButtons } from "@/components/adTool/sharedComponents/ScrollButtons";

import TitleSection from "../sharedComponents/TitleSection";

// Define pagination response type to avoid TS errors
type PaginationResponse = {
  total: number;
  pages: number;
  current: number;
};

// Define server response type
type TrendAdsResponse = {
  ads?: {
    adData: AdData;
    id: string;
  }[];
  pagination?: PaginationResponse;
  error?: string;
};

export default function TrendAds() {
  const [ads, setAds] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationResponse>({
    total: 0,
    pages: 0,
    current: 1,
  });
  const [hasMore, setHasMore] = useState(true);

  // Load initial ads
  const loadAds = useCallback(async (page = 1, reset = false) => {
    try {
      setIsLoading(true);

      const response = await fetchTrendAds(page, 20);
      const result = response as TrendAdsResponse;

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.ads && result.pagination) {
        // Extract only the adData from each saved ad
        const extractedAds = result.ads.map(
          (savedAd) => savedAd.adData as AdData,
        );

        // Update state based on whether we're resetting or adding more ads
        setAds((prevAds) =>
          reset ? extractedAds : [...prevAds, ...extractedAds],
        );
        setPagination(result.pagination);

        // Check if there are more ads to load
        setHasMore(result.pagination.current < result.pagination.pages);
      }
    } catch (error) {
      toast.error("Failed to load trending ads");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAds(1, true);
  }, [loadAds]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadAds(pagination.current + 1);
    }
  }, [isLoading, hasMore, pagination.current, loadAds]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <TitleSection
        icon={Flame}
        badgeText="Top Trends"
        image={Sparkles}
        imageColor="text-yellow-500 dark:text-yellow-300"
        highlightedText="Best Picks"
        remainingTitle="For Your Market"
        auroraColors={["#f97316", "#f59e0b", "#fbbf24", "#fde047"]}
        description="Explore the hottest ads selected for your niche."
      />

      {/* Content Section */}
      <div className="mx-auto w-full">
        {/* Show loading for initial load */}
        {isLoading && ads.length === 0 ? (
          <div className="flex h-60 items-center justify-center">
            <Loading size="large" message="Loading trending ads..." />
          </div>
        ) : ads.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center space-y-4 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No trending ads available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-8 p-4">
              <AdCardGrid ads={ads} />

              {/* Load more trigger */}
              <LoadingTrigger
                onIntersect={handleLoadMore}
                isLoading={isLoading}
              />

              {/* Loading More indicator */}
              {isLoading && (
                <Loading size="medium" message="Loading more ads..." />
              )}
            </div>
          </>
        )}

        {/* Scroll buttons */}
        <ScrollButtons />
      </div>
    </div>
  );
}

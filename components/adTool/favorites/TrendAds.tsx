// @/components/adLibrary/favorites/TrendAds.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTrendAds } from "@/actions/savedAds";
import { Flame, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { ScrollButtons } from "@/components/adTool/sharedComponents/ScrollButtons";

import SearchResults from "../sharedComponents/SearchResults";
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
  const [error, setError] = useState<string | null>(null);
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
      setError(null);

      const response = await fetchTrendAds(page, 20);
      const result = response as TrendAdsResponse;

      if (result.error) {
        setError(result.error);
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
      const errorMessage = "Failed to load trending ads";
      setError(errorMessage);
      toast.error(errorMessage);
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

  // Calculate remaining count
  const remainingCount = pagination.total - ads.length;

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
        <SearchResults
          isLoading={isLoading}
          error={error}
          totalCount={pagination.total}
          searchResults={ads}
          hasNextPage={hasMore}
          remainingCount={remainingCount > 0 ? remainingCount : null}
          handleLoadMore={handleLoadMore}
        />

        {/* Scroll buttons */}
        <ScrollButtons />
      </div>
    </div>
  );
}

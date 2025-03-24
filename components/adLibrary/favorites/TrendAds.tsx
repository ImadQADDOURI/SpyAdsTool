"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTrendAds } from "@/actions/savedAds";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { AdCardGrid } from "@/components/adLibrary/microComponents/AdCardGrid";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import LoadingTrigger from "@/components/adLibrary/microComponents/LoadingTrigger";
import { ScrollButtons } from "@/components/adLibrary/microComponents/ScrollButtons";

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
    <div className="min-h-screen space-y-8 bg-gray-100 pb-8 dark:bg-gray-800">
      <FirefliesWrapper intensity={"medium"}>
        {/* Title */}
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
              Trending Ads
            </h1>
            <div className="relative">
              <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

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
  );
}

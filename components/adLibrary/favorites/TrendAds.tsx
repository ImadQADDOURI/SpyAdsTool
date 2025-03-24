"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTrendingAds } from "@/actions/savedAds";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { AdCardGrid } from "@/components/adLibrary/microComponents/AdCardGrid";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import LoadingTrigger from "@/components/adLibrary/microComponents/LoadingTrigger";
import { ScrollButtons } from "@/components/adLibrary/microComponents/ScrollButtons";

export default function TrendAds() {
  const [ads, setAds] = useState<AdData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Function to load trending ads
  const loadTrendingAds = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await fetchTrendingAds(currentPage);

      if ("error" in response) {
        toast.error(response.error);
        return;
      }

      // Extract just the adData from the SavedAd objects
      const newAds = response.ads.map(
        (savedAd) => savedAd.adData as unknown as AdData,
      );

      if (currentPage === 1) {
        setAds(newAds);
      } else {
        // Append new ads to existing list
        setAds((prevAds) => [...prevAds, ...newAds]);
      }

      // Check if there are more ads to load
      setHasMore(currentPage < response.pagination.pages);
    } catch (error) {
      console.error("Failed to load trending ads:", error);
      toast.error("Failed to load trending ads");
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadTrendingAds(1);
  }, [loadTrendingAds]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTrendingAds(nextPage);
    }
  }, [isLoading, hasMore, page, loadTrendingAds]);

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

      {isInitialLoad ? (
        <Loading size="medium" message="Loading trending ads..." />
      ) : ads.length > 0 ? (
        <div className="space-y-8 p-4">
          <AdCardGrid ads={ads} />
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <LoadingTrigger
                onIntersect={handleLoadMore}
                isLoading={isLoading}
              />
              {/* Loading More indicator */}
              {isLoading && (
                <Loading size="medium" message="Loading more ads..." />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center">
          <p className="text-lg text-gray-500">No trending ads found</p>
        </div>
      )}

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

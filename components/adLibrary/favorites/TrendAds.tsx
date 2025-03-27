// @/components/adLibrary/favorites/TrendAds.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTrendAds } from "@/actions/savedAds";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Flame, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <FirefliesWrapper intensity="high">
        {/* Premium Header Section */}
        <div className="group relative overflow-hidden py-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6566F1]/5 via-transparent to-[#B977F8]/5" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="flex items-center space-x-2">
                <Flame className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  Trending Now
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  Hot Picks
                </span>{" "}
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-100 dark:to-white">
                  In Your Niche
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Discover the highest performing ads with verified metrics and
                conversion strategies
              </p>
              <div className="relative pt-4">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-500 ease-in-out group-hover:w-32 group-hover:from-[#6566F1]/60 group-hover:to-[#B977F8]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-lg" />
              </div>
              {/* <div className="mt-8 flex items-center gap-x-4">
                <Button
                  size="lg"
                  className="group rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-6 shadow-lg transition-all hover:shadow-[0_10px_25px_-5px_rgba(101,102,241,0.3)]"
                >
                  Explore Ads
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-gray-900/10 px-6 dark:border-gray-100/10"
                >
                  How we rank
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div> */}
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div className="space-y-8 py-8">
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

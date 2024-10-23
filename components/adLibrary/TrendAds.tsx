// components/TrendAds.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getTrendAds } from "@/actions/trendAds";
import { toast } from "sonner";

import { AdCardGrid } from "@/components/adLibrary/microComponents/AdCardGrid";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import LoadingTrigger from "@/components/adLibrary/microComponents/LoadingTrigger";

import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import { ScrollButtons } from "./microComponents/ScrollButtons";

export function TrendAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTrendAds = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const { ads: newAds, hasMore: moreAds } = await getTrendAds(pageNum);
      setAds((prevAds) => (pageNum === 1 ? newAds : [...prevAds, ...newAds]));
      setHasMore(moreAds);
    } catch (error) {
      toast.error("Failed to fetch trend ads");
      console.error("Error fetching trend ads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendAds(1);
  }, [fetchTrendAds]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchTrendAds(page + 1);
    }
  }, [isLoading, hasMore, page, fetchTrendAds]);

  if (isLoading && ads.length === 0) {
    return <Loading size="large" message="Loading trend ads..." />;
  }

  if (ads.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No trend ads available at the moment.
      </div>
    );
  }

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
      <AdCardGrid ads={ads} />
      {hasMore && (
        <div className="mt-8">
          <LoadingTrigger onIntersect={handleLoadMore} isLoading={isLoading} />
          {isLoading && <Loading size="medium" message="Loading more ads..." />}
        </div>
      )}

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

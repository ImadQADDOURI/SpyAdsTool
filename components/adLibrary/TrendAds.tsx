// components/TrendAds.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getTrendAds } from "@/actions/trendAds";
import { toast } from "sonner";

import { AdCardGrid } from "@/components/adLibrary/microComponents/AdCardGrid";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import LoadingTrigger from "@/components/adLibrary/microComponents/LoadingTrigger";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
          Trending Ads
        </h1>
        <AdCardGrid ads={ads} />
        {hasMore && (
          <div className="mt-8">
            <LoadingTrigger
              onIntersect={handleLoadMore}
              isLoading={isLoading}
            />
            {isLoading && (
              <Loading size="medium" message="Loading more ads..." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

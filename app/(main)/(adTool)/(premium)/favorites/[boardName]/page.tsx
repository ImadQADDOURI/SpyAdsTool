// @/app/(main)/(adTool)/(premium)/favorites/[boardName]/page.tsx
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAdsByBoard } from "@/actions/savedAds";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Folder,
  Heart,
  Package,
  PackageOpen,
  RefreshCw,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import BoardSettingsDropdown from "@/components/adTool/favorites/BoardSettingsDropdown";
import { Loading } from "@/components/adTool/sharedComponents/Loading";
import { ScrollButtons } from "@/components/adTool/sharedComponents/ScrollButtons";
import SearchResults from "@/components/adTool/sharedComponents/SearchResults";
import TitleSection from "@/components/adTool/sharedComponents/TitleSection";
import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";

// Define pagination response type
type PaginationResponse = {
  total: number;
  pages: number;
  current: number;
};

// Define server response type
type BoardAdsResponse = {
  ads?: {
    adData: AdData;
    id: string;
  }[];
  pagination?: PaginationResponse;
  error?: string;
};

type BoardContentProps = {
  boardName: string;
};

export default function BoardPage() {
  const params = useParams();
  const boardName = decodeURIComponent(params.boardName as string);

  return (
    <SubscriptionPageGuard>
      <BoardContent boardName={boardName} />
    </SubscriptionPageGuard>
  );
}

const BoardContent = ({ boardName }: BoardContentProps) => {
  const [ads, setAds] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationResponse>({
    total: 0,
    pages: 0,
    current: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📂 Load board ads with pagination
  const loadBoardAds = useCallback(
    async (page = 1, reset = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchAdsByBoard(boardName, page, 20);
        const result = response as BoardAdsResponse;

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
            reset ? extractedAds : [...(prevAds || []), ...extractedAds],
          );
          setPagination(result.pagination);

          // Check if there are more ads to load
          setHasMore(result.pagination.current < result.pagination.pages);
        }
      } catch (error) {
        const errorMessage = "Failed to load board ads";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [boardName],
  );

  // 🔄 Handle refresh - reset to first page
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBoardAds(1, true);
    setRefreshing(false);
    toast.success("Board refreshed");
  };

  // 📄 Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadBoardAds(pagination.current + 1);
    }
  }, [isLoading, hasMore, pagination.current, loadBoardAds]);

  // 🚀 Initial load
  useEffect(() => {
    loadBoardAds(1, true);
  }, [loadBoardAds]);

  // Calculate remaining count
  const remainingCount = pagination.total - (ads?.length ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <TitleSection
        icon={Heart}
        badgeText="Board"
        image={Folder}
        imageColor="text-indigo-500 dark:text-indigo-400"
        highlightedText={boardName}
        remainingTitle="Overview"
        auroraColors={["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"]}
        description="A snapshot of your saved ads and settings."
      />

      {/* Info Section - enhanced */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        <div className="group flex items-center space-x-2 rounded-full bg-[#B977F8]/10 px-4 py-1.5">
          <Heart className="h-5 w-5 text-[#B977F8] transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-medium text-[#B977F8]">
            {pagination.total} saved ads
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <BoardSettingsDropdown boardName={boardName} />

          <button
            className="group flex cursor-pointer items-center space-x-2 rounded-full bg-gray-200/70 px-4 py-1.5 transition-all hover:bg-gray-300/50 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-700/50 dark:hover:bg-gray-600/50"
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
          >
            <RefreshCw
              className={`h-5 w-5 text-gray-600 transition-all duration-300 group-hover:scale-110 dark:text-gray-300 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Refresh
            </span>
          </button>
        </div>
      </div>

      {/* Content Section using SearchResults */}
      <div className="mx-auto mt-8 w-full">
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
};

// src/app/(dashboard)/favorites/[boardName]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAdsByBoard } from "@/actions/savedAds";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Folder,
  Heart,
  RefreshCw,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BoardSettingsDropdown from "@/components/adLibrary/favorites/BoardSettingsDropdown";
import {
  SavedAd,
  useSavedAds,
} from "@/components/adLibrary/favorites/SavedAdsContext";
import AdCardGrid from "@/components/adLibrary/microComponents/AdCardGrid";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { ScrollButtons } from "@/components/adLibrary/microComponents/ScrollButtons";

export default function BoardPage() {
  const params = useParams();
  const boardName = decodeURIComponent(params.boardName as string);

  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<AdData[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current: 1,
  });
  const [refreshing, setRefreshing] = useState(false);

  const { boards } = useSavedAds();
  const currentBoard = boards.find((board) => board.name === boardName);

  // 📥 Fetch ads for this board
  const loadBoardAds = async () => {
    try {
      setLoading(true);
      const result = await fetchAdsByBoard(boardName, 1, 100);

      if ("error" in result) {
        toast.error(result.error);
        setAds([]);
        return;
      }

      // Convert SavedAd[] to AdData[]
      const adData = (result.ads as unknown as SavedAd[]).map(
        (savedAd) => savedAd.adData,
      );
      setAds(adData);
      setPagination(result.pagination);
    } catch (error) {
      toast.error("Failed to load board ads");
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBoardAds();
    setRefreshing(false);
    toast.success("Board refreshed");
  };

  // 🚀 Initial load
  useEffect(() => {
    loadBoardAds();
  }, [boardName]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <FirefliesWrapper intensity="medium">
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            {/* Back button */}
            <div className="absolute left-4 top-0">
              <Link href="/favorites">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
            </div>

            {/* Title with decorative line */}
            <div className="flex flex-col items-center space-y-2">
              <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-center text-3xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01] md:text-4xl">
                {boardName}
              </h1>
              <div className="relative">
                <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex items-center gap-6">
              <div className="group flex items-center space-x-2">
                <Heart className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {pagination.total} saved ads
                </span>
              </div>

              {/* Last Updated */}
              <div className="group flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {currentBoard?.lastUpdated
                    ? formatDistanceToNow(new Date(currentBoard.lastUpdated), {
                        addSuffix: true,
                      })
                    : "No updates yet"}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-6">
                <BoardSettingsDropdown boardName={boardName} />

                <button
                  className="group flex cursor-pointer items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                >
                  <RefreshCw
                    className={`h-5 w-5 text-[#6566F1] transition-all duration-300 group-hover:scale-110 dark:text-[#B977F8] ${refreshing ? "animate-spin" : ""}`}
                  />

                  <span className="text-sm font-medium text-gray-600 group-hover:text-[#6566F1] dark:text-gray-300 dark:group-hover:text-[#B977F8]">
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

      {/* Content area */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        ) : ads.length > 0 ? (
          <AdCardGrid ads={ads} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-gray-200 p-4 dark:bg-gray-700">
              <Folder className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No ads saved yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start saving ads to see them here
            </p>
            <Link href="/adlibrary">
              <Button className="mt-6 bg-gradient-to-r from-[#6566F1] to-[#B977F8] hover:opacity-90">
                Browse Ads
              </Button>
            </Link>
          </div>
        )}
      </div>
      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

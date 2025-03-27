// src/app/(dashboard)/favorites/[boardName]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAdsByBoard } from "@/actions/savedAds";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
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
import { Loading } from "@/components/adLibrary/microComponents/Loading";
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
              {/* Back button - moved to top left */}
              <div className="absolute left-4 top-0">
                <Link href="/favorites">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                </Link>
              </div>

              {/* Board name with gradient */}
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  {boardName}
                </span>
              </h1>

              {/* Decorative line */}
              <div className="relative pt-2">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-500 ease-in-out group-hover:w-32 group-hover:from-[#6566F1]/60 group-hover:to-[#B977F8]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-lg" />
              </div>

              {/* Info Section - enhanced */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                <div className="group flex items-center space-x-2 rounded-full bg-[#B977F8]/10 px-4 py-1.5">
                  <Heart className="h-5 w-5 text-[#B977F8] transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium text-[#B977F8]">
                    {pagination.total} saved ads
                  </span>
                </div>

                {/* Last Updated */}
                <div className="group flex items-center space-x-2 rounded-full bg-[#6566F1]/10 px-4 py-1.5">
                  <Clock className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium text-[#6566F1]">
                    {currentBoard?.lastUpdated
                      ? formatDistanceToNow(
                          new Date(currentBoard.lastUpdated),
                          {
                            addSuffix: true,
                          },
                        )
                      : "No updates yet"}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <BoardSettingsDropdown boardName={boardName} />

                  <button
                    className="group flex cursor-pointer items-center space-x-2 rounded-full bg-gray-200/70 px-4 py-1.5 transition-all hover:bg-gray-300/50 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-700/50 dark:hover:bg-gray-600/50"
                    onClick={handleRefresh}
                    disabled={refreshing || loading}
                  >
                    <RefreshCw
                      className={`h-5 w-5 text-gray-600 transition-all duration-300 group-hover:scale-110 dark:text-gray-300 ${refreshing ? "animate-spin" : ""}`}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Refresh
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      {/* Content area */}
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:px-6 lg:px-8">
        {loading ? (
          <Loading size="medium" message="Loading ads..." />
        ) : ads.length > 0 ? (
          <AdCardGrid ads={ads} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 p-5">
              <Folder className="h-10 w-10 text-[#B977F8]" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-gray-100">
              No ads saved yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start saving ads to see them here
            </p>
            <Link href="/adlibrary">
              <Button
                size="lg"
                className="mt-6 bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-6 shadow-lg transition-all hover:shadow-[0_10px_25px_-5px_rgba(101,102,241,0.3)]"
              >
                Browse Ads
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

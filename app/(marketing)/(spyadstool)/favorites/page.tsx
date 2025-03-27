// src/app/(dashboard)/favorites/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Album,
  ArrowRight,
  ChevronRight,
  Folder,
  Heart,
  Images,
  RefreshCw,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import BoardCard from "@/components/adLibrary/favorites/BoardCard";
import { useSavedAds } from "@/components/adLibrary/favorites/SavedAdsContext";
import { useSavedAdsActions } from "@/components/adLibrary/favorites/useSavedAdsActions";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { ScrollButtons } from "@/components/adLibrary/microComponents/ScrollButtons";

// Wrap the main content with Suspense for loading state
const FavoritesPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <FavoritesContent />
    </Suspense>
  );
};

// The actual content component
const FavoritesContent = () => {
  const { boards, isLoading, refreshData, error } = useSavedAds();
  const { boards: actionBoards } = useSavedAdsActions();
  const [searchQuery, setSearchQuery] = useState("");
  const [totalSavedAds, setTotalSavedAds] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use a unified boards source that combines context and actions
  const boardsToUse = actionBoards.length > 0 ? actionBoards : boards;

  // Calculate total saved ads
  useEffect(() => {
    if (boardsToUse.length > 0) {
      const total = boardsToUse.reduce((sum, board) => sum + board.count, 0);
      setTotalSavedAds(total);
    } else {
      setTotalSavedAds(0);
    }
  }, [boardsToUse]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter boards by search query
  const filteredBoards = boardsToUse.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle board update with loading state
  const handleBoardUpdate = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      toast.success("Boards refreshed");
    } catch (err) {
      toast.error("Failed to refresh boards");
    } finally {
      setIsRefreshing(false);
    }
  };

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
              {/* Title with decorative elements */}
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  My Collections
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  My Boards
                </span>
              </h1>

              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Organize and manage your saved ads in customized boards
              </p>

              {/* Decorative line */}
              <div className="relative pt-2">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-500 ease-in-out group-hover:w-32 group-hover:from-[#6566F1]/60 group-hover:to-[#B977F8]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-lg" />
              </div>

              {/* Info Section - enhanced */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <div className="group flex items-center space-x-2 rounded-full bg-[#6566F1]/10 px-4 py-1.5">
                  <Folder className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium text-[#6566F1]">
                    {boardsToUse.length} boards
                  </span>
                </div>

                <div className="group flex items-center space-x-2 rounded-full bg-[#B977F8]/10 px-4 py-1.5">
                  <Heart className="h-5 w-5 text-[#B977F8] transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium text-[#B977F8]">
                    {totalSavedAds} saved ads
                  </span>
                </div>

                {/* Refresh Button */}
                <button
                  className="group flex cursor-pointer items-center space-x-2 rounded-full bg-gray-200/70 px-4 py-1.5 transition-all hover:bg-gray-300/50 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-700/50 dark:hover:bg-gray-600/50"
                  onClick={handleBoardUpdate}
                  disabled={isLoading || isRefreshing}
                >
                  <RefreshCw
                    className={`h-5 w-5 text-gray-600 transition-all duration-300 group-hover:scale-110 dark:text-gray-300 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Refresh
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search input - enhanced */}
        <div className="mb-8 flex justify-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-xs transition-all duration-300 focus-within:max-w-sm"
          >
            <div className="group relative flex items-center">
              <Input
                className="h-10 rounded-full border-gray-200 bg-white/70 pl-4 pr-12 text-sm backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 hover:bg-white/90 focus:border-[#6566F1] focus:bg-white focus:ring-2 focus:ring-[#6566F1]/20 dark:border-gray-700 dark:bg-gray-800/70 dark:hover:bg-gray-800/90 dark:focus:border-[#B977F8] dark:focus:ring-[#B977F8]/20"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#6566F1]/10 p-1.5 transition-all duration-300 group-focus-within:bg-[#6566F1]/20 dark:bg-[#B977F8]/10 dark:group-focus-within:bg-[#B977F8]/20">
                <Search className="h-4 w-4 text-[#6566F1] transition-colors duration-200 dark:text-[#B977F8]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Boards grid */}
        {isLoading ? (
          <Loading size="medium" message="Loading boards..." />
        ) : filteredBoards.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.name}
                board={board}
                onUpdate={handleBoardUpdate}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center rounded-xl bg-white/70 py-16 text-center shadow-sm backdrop-blur-sm dark:bg-gray-800/70"
          >
            <div className="rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 p-5">
              <Folder className="h-10 w-10 text-[#B977F8]" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200">
                  No boards match &quot;{searchQuery}&quot;
                </h3>
                <button
                  className="mt-4 text-sm font-medium text-[#6566F1] hover:underline dark:text-[#B977F8]"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <h3 className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200">
                  You don&apos;t have any boards yet
                </h3>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Save ads by clicking the heart icon on any ad in the library.
                  Your saved ads will appear here, organized by boards.
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
              </>
            )}
          </motion.div>
        )}
      </div>
      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
};

export default FavoritesPage;

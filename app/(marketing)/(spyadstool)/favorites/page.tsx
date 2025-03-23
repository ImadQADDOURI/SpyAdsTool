// src/app/(dashboard)/favorites/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { Folder, Heart, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <FirefliesWrapper intensity="medium">
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            {/* Title with decorative line */}
            <div className="flex flex-col items-center space-y-2">
              <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
                My Boards
              </h1>
              <div className="relative">
                <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
              </div>
            </div>
            {/* Info Section */}
            <div className="flex items-center gap-6">
              <div className="group flex items-center space-x-2">
                <Folder className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {boardsToUse.length} boards
                </span>
              </div>
              <div className="group flex items-center space-x-2">
                <Heart className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {totalSavedAds} saved ads
                </span>
              </div>

              {/* Refresh Button */}
              <button
                className="group flex cursor-pointer items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={handleBoardUpdate}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw
                  className={`h-5 w-5 text-[#6566F1] transition-all duration-300 group-hover:scale-110 dark:text-[#B977F8] ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-[#6566F1] dark:text-gray-300 dark:group-hover:text-[#B977F8]">
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>
          </div>
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Search input */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-xs transition-all duration-300 focus-within:max-w-sm">
            <div className="group relative flex items-center">
              <Input
                className="h-10 rounded-full border-gray-200 bg-white/50 pl-4 pr-12 text-sm backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 hover:bg-white/80 focus:border-[#6566F1] focus:bg-white focus:ring-2 focus:ring-[#6566F1]/20 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900/80 dark:focus:border-[#B977F8] dark:focus:ring-[#B977F8]/20"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute right-3 flex h-7 w-7 items-center justify-center">
                <Search className="h-4 w-4 text-gray-400 transition-colors duration-200 group-focus-within:text-[#6566F1] dark:group-focus-within:text-[#B977F8]" />
              </div>
            </div>
          </div>
        </div>

        {/* Boards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : filteredBoards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.name}
                board={board}
                onUpdate={handleBoardUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white/50 py-16 text-center shadow-sm backdrop-blur-sm dark:bg-gray-800/50">
            <Folder className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            {searchQuery ? (
              <>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  No boards match "{searchQuery}"
                </p>
                <button
                  className="mt-4 text-sm text-[#6566F1] hover:underline dark:text-[#B977F8]"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  You don't have any boards yet
                </p>
                <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Save ads by clicking the heart icon on any ad in the library.
                  Your saved ads will appear here, organized by boards.
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
};

export default FavoritesPage;

// @/components/adLibrary/AdBrowser.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AdLibrarySearchPaginationQuery,
  getAdSearchVariables,
} from "@/utils/MetaGraphQLConstsAndFunctions";
import { motion } from "framer-motion";
import {
  BarChart,
  BrainCircuit,
  Download,
  Filter,
  PieChart,
  TrendingUp,
  Zap,
} from "lucide-react";

import { AdData } from "@/types/ad";

import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import AdaptiveSearchFilters from "./searchFilters/adaptive-search-filters";
import FilterPanel from "./searchFilters/FilterPanel";
import SearchFilters from "./searchFilters/search-filters";
import { SearchBar } from "./searchFilters/SearchBar";

export const AdBrowser = () => {
  const searchParams = useSearchParams();

  // 🔍 Search state
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📊 Pagination state
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // 🔒 Search lock mechanism to prevent multiple simultaneous searches
  const isSearchInProgress = useRef(false);

  // 📜 Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      // 🛑 If this is a new search (not loading more), ensure we're not already searching
      if (!useExistingParams && isSearchInProgress.current) {
        return;
      }

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // 🔄 Get variables for the search query
        const variables = getAdSearchVariables(
          searchParams,
          useExistingParams ? endCursor : null,
        );

        // 🔍 Execute search query
        const results = await AdLibrarySearchPaginationQuery(variables);

        // ✅ For load more, append results; for new search, replace results
        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          // 🧹 Clear previous results for new search
          setSearchResults(results.ads);
          setTotalCount(results.count);
        }

        // 📊 Update pagination state
        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // 🧮 Calculate remaining items
        const newRemainingCount =
          results.count >= 50001
            ? results.count
            : results.count -
              (useExistingParams ? searchResults!.length : 0) -
              results.ads.length;

        setRemainingCount(newRemainingCount > 0 ? newRemainingCount : 0);
      } catch (error) {
        console.error("Error searching ads:", error);
        setError(
          "An error occurred while searching for ads. Please try again.",
        );
        // 🧹 Clear results on error for new searches
        if (!useExistingParams) {
          setSearchResults(null);
        }
      } finally {
        setIsLoading(false);
        isSearchInProgress.current = false;
      }
    },
    [searchParams, searchResults, endCursor],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading && !isSearchInProgress.current) {
      handleSearchAds(true);
    }
  }, [hasNextPage, handleSearchAds, isLoading]);

  return (
    <div className="min-h-screen space-y-2 bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
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
                <Zap className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  Professional Ad Tools
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                  Ad Search
                </span>{" "}
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-100 dark:to-white">
                  Data & Insights
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Search millions of ads with powerful filters, visual analytics
                and AI tools
              </p>
              {/* Decorative line */}
              <div className="relative pt-4">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-500 ease-in-out group-hover:w-32 group-hover:from-[#6566F1]/60 group-hover:to-[#B977F8]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-lg" />
              </div>

              {/* Compact Feature Highlights */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <div className="flex items-center space-x-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/50">
                  <Filter className="h-4 w-4 text-[#6566F1]" />
                  <span className="text-sm">Filters</span>
                </div>
                <div className="flex items-center space-x-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/50">
                  <BarChart className="h-4 w-4 text-[#B977F8]" />
                  <span className="text-sm">Analytics</span>
                </div>

                <div className="flex items-center space-x-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/50">
                  <TrendingUp className="h-4 w-4 text-[#E9A8F2]" />
                  <span className="text-sm">Trends</span>
                </div>
                <div className="flex items-center space-x-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/50">
                  <PieChart className="h-4 w-4 text-[#6566F1]" />
                  <span className="text-sm">Charts</span>
                </div>
                <div className="flex items-center space-x-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/50">
                  <BrainCircuit className="h-4 w-4 text-[#B977F8]" />
                  <span className="text-sm">AI Tools</span>
                </div>
                <div className="flex items-center space-x-2 rounded-full bg-white/50 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/50">
                  <Download className="h-4 w-4 text-[#6566F1]" />
                  <span className="text-sm">Media</span>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      {/* Sticky SearchBar & Filter Section */}
      <SearchBar onSearch={handleSearchAds} isLoading={isLoading} />

      <AdaptiveSearchFilters
        onSearch={handleSearchAds}
        isLoading={isLoading}
        displayMode="full"
      />

      {/* Search Results */}
      <SearchResults
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        hasNextPage={hasNextPage}
        remainingCount={remainingCount}
        handleLoadMore={handleLoadMore}
      />

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
};

export default AdBrowser;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AdLibrarySearchPaginationQuery } from "@/actions/Meta-GraphQL-Queries";
import { motion } from "framer-motion";
import {
  BarChart,
  BrainCircuit,
  Download,
  Facebook,
  Filter,
  PieChart,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { AdData } from "@/types/ad";

import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import {
  SearchFilterProvider,
  useSearchFilters,
} from "./search/search-filter-context";
import SearchFilters from "./search/search-filters";

/**
 * Inner component that uses the search filter context
 */
const AdBrowserContent = () => {
  const { getSearchParams } = useSearchFilters();

  // Add ref for the FirefliesWrapper section
  const titleSectionRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Prevent concurrent searches
  const isSearchInProgress = useRef(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      if (!isLoadingMore && isSearchInProgress.current) return;

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = getSearchParams();

        const results = await AdLibrarySearchPaginationQuery(
          searchParams.q,
          searchParams.category_as_keyword,
          searchParams.search_type,
          searchParams.active_status,
          searchParams.ad_type,
          searchParams.content_languages,
          searchParams.countries,
          searchParams.media_type,
          searchParams.publisher_platforms,
          searchParams.sort_data,
          searchParams.start_date,
          searchParams.end_date,
          isLoadingMore ? endCursor : null,
        );

        // Update results
        if (isLoadingMore && searchResults) {
          setSearchResults((prevResults) => [
            ...(prevResults ?? []),
            ...results.ads,
          ]);
        } else {
          setSearchResults(results.ads);
          setTotalCount(results.total_count);
        }

        // Update pagination state
        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // Calculate remaining items
        const newRemainingCount =
          results.total_count >= 50001
            ? results.total_count
            : (remainingCount ?? results.total_count) - results.search_count;

        setRemainingCount(newRemainingCount > 0 ? newRemainingCount : 0);
      } catch (searchError) {
        console.error("Search error:", searchError);
        setError("An error occurred while searching. Please try again.");
        if (!isLoadingMore) {
          setSearchResults(null);
        }
      } finally {
        setIsLoading(false);
        isSearchInProgress.current = false;
      }
    },
    [getSearchParams, searchResults, endCursor],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading && !isSearchInProgress.current) {
      executeSearch(true);
    }
  }, [hasNextPage, executeSearch, isLoading]);

  return (
    <div className="min-h-screen space-y-2 bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <div ref={titleSectionRef}>
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
                  <span className="relative inline-block transform transition-transform duration-300 hover:scale-110">
                    <Image
                      src="/facebook.svg"
                      alt="Facebook Icon"
                      className="-mt-4 mr-2 inline-block size-24"
                      width={100} // adjust width as needed
                      height={100} // adjust height as needed
                    />
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <linearGradient
                          id="fb-icon-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#B977F8" />
                          <stop offset="100%" stopColor="#6566F1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
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
      </div>

      <SearchFilters onSearch={executeSearch} isLoading={isLoading} />
      <SearchResults
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        hasNextPage={hasNextPage}
        remainingCount={remainingCount}
        handleLoadMore={handleLoadMore}
      />

      {/* Scroll Buttons */}
      <ScrollButtons />
    </div>
  );
};

/**
 * Main AdBrowser component with context provider
 */
export const AdBrowser = () => {
  return (
    <SearchFilterProvider>
      <AdBrowserContent />
    </SearchFilterProvider>
  );
};

export default AdBrowser;

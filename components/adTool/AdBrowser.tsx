"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdLibrarySearchPaginationQuery } from "@/actions/Meta-GraphQL-Queries";
import { Facebook, Star } from "lucide-react";

import type { AdData } from "@/types/ad";

import {
  SearchFilterProvider,
  useSearchFilters,
} from "./search/search-filter-context";
import SearchFilters from "./search/search-filters";
import { ScrollButtons } from "./sharedComponents/ScrollButtons";
import SearchResults from "./sharedComponents/SearchResults";
import TitleSection from "./TitleSection";

/**
 * Inner component that uses the search filter context
 */
const AdBrowserContent = () => {
  const { getSearchParams } = useSearchFilters();

  // Search state
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // 🎯  Track actual loaded ads count using search_count
  const [totalLoadedAds, setTotalLoadedAds] = useState<number>(0);

  // 🎯  Current search params state for synchronization
  const [currentSearchParams, setCurrentSearchParams] = useState<any>(null);

  // Prevent concurrent searches
  const isSearchInProgress = useRef(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // 🎯  Handle sync issues
  const handleSyncIssue = useCallback((issue: string) => {
    console.warn("🔄 Sync Issue:", issue);
    // You can add toast notifications or other UI feedback here
  }, []);

  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      if (!isLoadingMore && isSearchInProgress.current) return;

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = getSearchParams();

        // 🎯  Store current search params for synchronization
        if (!isLoadingMore) {
          setCurrentSearchParams(searchParams);
        }

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

        // 🎯  Update loaded ads count using search_count
        if (isLoadingMore) {
          // Add the new search_count to existing total
          setTotalLoadedAds(
            (prevTotal) => prevTotal + (results.search_count || 0),
          );
        } else {
          // Reset for new search
          setTotalLoadedAds(results.search_count || 0);
        }

        // Update pagination state
        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // 🎯  Calculate remaining count correctly
        const newTotalLoadedAds = isLoadingMore
          ? totalLoadedAds + (results.search_count || 0)
          : results.search_count || 0;

        const newRemainingCount = Math.max(
          0,
          (results.total_count || 0) - newTotalLoadedAds,
        );
        setRemainingCount(newRemainingCount);

        console.log("📊 Load Stats:", {
          total_count: results.total_count,
          search_count: results.search_count,
          total_loaded: newTotalLoadedAds,
          remaining: newRemainingCount,
          has_next_page: results.has_next_page,
        });
      } catch (searchError) {
        console.error("Search error:", searchError);
        setError("An error occurred while searching. Please try again.");
        if (!isLoadingMore) {
          setSearchResults(null);
          setTotalLoadedAds(0); // Reset on error
        }
      } finally {
        setIsLoading(false);
        isSearchInProgress.current = false;
      }
    },
    [getSearchParams, searchResults, endCursor, totalLoadedAds], // Added totalLoadedAds to dependencies
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading && !isSearchInProgress.current) {
      executeSearch(true);
    }
  }, [hasNextPage, executeSearch, isLoading]);

  return (
    <div className="min-h-screen space-y-2 bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <TitleSection
        icon={Star}
        iconColor="text-purple-500 dark:text-purple-400"
        badgeText="Professional Ad Tools"
        image={Facebook}
        imageColor="text-blue-600 dark:text-blue-400"
        highlightedText="Ad Search"
        remainingTitle="Data & Analytics"
        auroraColors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
        description="Search millions of ads with powerful filters, visual analytics and AI tools"
      />

      <SearchFilters onSearch={executeSearch} isLoading={isLoading} />

      {/* 🎯  Pass search params to SearchResults for synchronization */}
      <SearchResults
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        hasNextPage={hasNextPage}
        remainingCount={remainingCount}
        handleLoadMore={handleLoadMore}
        searchParams={currentSearchParams}
        onSyncIssue={handleSyncIssue}
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

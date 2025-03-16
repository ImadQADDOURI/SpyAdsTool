"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdLibrarySearchPaginationQuery,
  getAdSearchVariables,
} from "@/utils/MetaGraphQLConstsAndFunctions";

import { AdData } from "@/types/ad";

import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import FilterPanel from "./searchFilters/FilterPanel";
import { SearchBar } from "./searchFilters/SearchBar";

export const AdBrowser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔍 Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
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
  // ⏱️ Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 🔄 Track the latest search query
  const latestQueryRef = useRef(searchQuery);

  // 📜 Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // 🔄 Sync searchQuery state with URL param when it changes externally
  useEffect(() => {
    const queryParam = searchParams.get("q") || "";
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
      latestQueryRef.current = queryParam;
    }
  }, [searchParams, searchQuery]);

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

  // 🔍 Enhanced search handler with debounce
  const handleSearch = useCallback(
    (query: string = searchQuery) => {
      // 🧹 Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 📝 Update local state immediately for UI responsiveness
      setSearchQuery(query);
      latestQueryRef.current = query;

      // ⏱️ Debounce the actual search execution
      debounceTimerRef.current = setTimeout(() => {
        // 🔒 Ensure we're not already searching
        if (isSearchInProgress.current) return;

        // 🔄 Update URL parameters
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", query);
        router.push(`?${params.toString()}`);

        // ⏳ Small delay to ensure URL is updated before search
        setTimeout(() => {
          // 🧐 Double-check that the query hasn't changed during the delay
          if (latestQueryRef.current === query) {
            handleSearchAds();
          }
        }, 50);
      }, 200); // 200ms debounce delay
    },
    [searchParams, router, handleSearchAds, searchQuery],
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-800">
      <FirefliesWrapper intensity={"medium"}>
        {/* Title */}
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
              Ad Search
            </h1>
            <div className="relative">
              <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

      {/* Sticky SearchBar & Filter Section */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <FilterPanel
        onSearch={handleSearch}
        isLoading={isLoading}
        variant="full"
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

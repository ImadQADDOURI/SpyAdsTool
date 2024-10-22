// components\adLibrary\AdBrowser.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdLibrarySearchPaginationQuery } from "@/actions/Meta-GraphQL-Queries";
import { getAdSearchVariables } from "@/utils/adSearchVariables";
import { Loader2 } from "lucide-react";

import { AdData } from "@/types/ad";

import { Button } from "../ui/button";
import { AdCardGrid } from "./microComponents/AdCardGrid";
import LoadingTrigger from "./microComponents/LoadingTrigger";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import FilterPanel from "./searchFilters/FilterPanel";
import { SearchBar } from "./searchFilters/SearchBar";

export const AdBrowser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const variables = getAdSearchVariables(
          searchParams,
          useExistingParams ? endCursor : null,
          //page_id,
        );
        // console.log("🚀🚀🚀🚀 ~ variables:", variables);

        const results = await AdLibrarySearchPaginationQuery(variables);

        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          setSearchResults(results.ads);
          setTotalCount(results.count); // setTotalCount in the First Search Only
        }

        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // Calculate remaining count
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
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams, searchResults, endCursor],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      handleSearchAds(true);
    }
  }, [hasNextPage, handleSearchAds, isLoading]);

  //////////////////
  //In essence, handleSearch acts as the bridge between user input (search query) and the underlying data fetching mechanism. It ensures that the UI and the data stay synchronized, providing a seamless search experience for the user.
  //Here's a breakdown of its usage in different contexts:
  //In FilterPanel: When the user applies filters in the filter panel and clicks the "Apply Filters" button, the handleSearch function is called without any arguments. This triggers a search using the current searchQuery state value, along with any applied filters.
  //In SearchBar: When the user enters a search term in the search bar and either presses Enter or clicks the "Search" button, the handleSearch function is called with the entered search query as the argument. This initiates a search with the specific search term entered by the user.
  const handleSearch = useCallback(
    (query: string = searchQuery) => {
      // Use default value from searchQuery
      setSearchQuery(query);
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query); // Use the passed query directly
      router.push(`?${params.toString()}`);
      handleSearchAds();
    },
    [searchParams, router, handleSearchAds, searchQuery],
  );
  /////////////////////////
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Title & Search Section */}
      <div className="group relative py-6">
        <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
          <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
            Ad Browser
          </h1>
          <div className="relative">
            <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
      </div>

      {/* Sticky SearchBar & Filter Section */}

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <FilterPanel onSearch={handleSearch} variant="full" />
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

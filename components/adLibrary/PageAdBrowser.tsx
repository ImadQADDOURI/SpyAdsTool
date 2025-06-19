"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AdLibraryMobileFocusedStateProviderRefetchQuery,
  AdLibrarySearchPaginationQuery,
  extractQueryParams,
} from "@/actions/Meta-GraphQL-Queries";

import { AdData } from "@/types/ad";

import PageInfoSection from "./microComponents/PageInfoSection";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import SearchFilters from "./search/search-filters";

interface PageAdBrowserProps {
  pageId: string;
}

export const PageAdBrowser = ({ pageId }: PageAdBrowserProps) => {
  // Add ref for the Info Section
  const infoSectionRef = useRef<HTMLDivElement>(null);

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

  // 📄 Page info state
  const [pageInfo, setPageInfo] = useState<any | null>(null);
  const [page, setPage] = useState<any | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [pageTotalAds, setPageTotalAds] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 🔒 Control references to handle race conditions
  const isSearchInProgress = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadCompletedRef = useRef(false);
  const searchRequestIdRef = useRef(0); // For tracking the latest search request

  // 📜 Scroll to top on page load
  useEffect(() => {
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isInitialLoad]);

  // extract URL params
  const getQueryParams = useCallback(() => {
    return extractQueryParams(searchParams);
  }, [searchParams]);

  const handleSearchAds = useCallback(
    async (useExistingParams = false) => {
      // 🛑 If this is a new search (not loading more), ensure we're not already searching
      if (!useExistingParams && isSearchInProgress.current && !isInitialLoad) {
        return;
      }

      // 🔢 Generate a unique request ID to track this specific search
      const currentRequestId = ++searchRequestIdRef.current;

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        let results;

        // 🔄 First load special case: fetch page info
        if (isInitialLoad) {
          // First search on page load

          results =
            await AdLibraryMobileFocusedStateProviderRefetchQuery(pageId);

          // 🛑 Check if this is still the relevant request
          if (currentRequestId !== searchRequestIdRef.current) return;

          setPageInfo(results.page_info);
          setPage(results.page);
          if (results.ads && results.ads.length > 0) {
            setProfilePictureUrl(
              results.ads[0].snapshot.page_profile_picture_url,
            );
          }
          setPageTotalAds(results.count);
          setIsInitialLoad(false);
          initialLoadCompletedRef.current = true;
        } else {
          // Subsequent searches or pagination

          // 🔄 Get variables for the search query using the helper
          const params = getQueryParams();

          // 🔍 Execute search query
          results = await AdLibrarySearchPaginationQuery(
            params.q,
            params.category_as_keyword,
            params.search_type,
            params.active_status,
            params.ad_type,
            params.content_languages,
            params.countries,
            params.media_type,
            params.publisher_platforms,
            params.sort_data,
            params.start_date,
            params.end_date,
            useExistingParams ? endCursor : null,
            pageId,
          );

          // 🛑 Check if this is still the relevant request
          if (currentRequestId !== searchRequestIdRef.current) return;

          // Only scroll on new searches (not during pagination)
          if (!useExistingParams && infoSectionRef.current) {
            const sectionBottom = infoSectionRef.current.offsetTop;
            // + infoSectionRef.current.offsetHeight;
            window.scrollTo({
              top: sectionBottom,
              behavior: "smooth",
            });
          }
        }

        // Update total count on first search or when search params change
        if (!useExistingParams) {
          setTotalCount(results.count);
        }

        // ✅ For load more, append results; for new search, replace results
        if (useExistingParams && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          setSearchResults(results.ads);
        }

        setEndCursor(results.end_cursor);
        setHasNextPage(results.has_next_page);

        // 🧮 Calculate remaining count
        const newRemainingCount =
          results.count >= 50001
            ? results.count
            : results.count -
              (useExistingParams ? searchResults!.length : 0) -
              results.ads.length;

        setRemainingCount(newRemainingCount > 0 ? newRemainingCount : 0);
      } catch (error) {
        console.error("Error searching ads:", error);

        // 🛑 Check if this is still the relevant request
        if (currentRequestId !== searchRequestIdRef.current) return;

        setError(
          "An error occurred while searching for ads. Please try again.",
        );

        // 🧹 Clear results on error for new searches
        if (!useExistingParams && !isInitialLoad) {
          setSearchResults(null);
        }
      } finally {
        // 🛑 Only update loading state if this is the most recent request
        if (currentRequestId === searchRequestIdRef.current) {
          setIsLoading(false);
          isSearchInProgress.current = false;
        }
      }
    },
    [getQueryParams, searchResults, endCursor, pageId, isInitialLoad],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading && !isSearchInProgress.current) {
      handleSearchAds(true);
    }
  }, [hasNextPage, handleSearchAds, isLoading]);

  // 🚀 Initial load effect - safely handle the initial search
  useEffect(() => {
    // Only execute once
    if (initialLoadCompletedRef.current) return;

    const initializeSearch = async () => {
      // Wait a tiny bit to ensure all component mounting is complete
      await new Promise((resolve) => setTimeout(resolve, 10));
      handleSearchAds();
    };

    initializeSearch();

    // Clean up any pending searches on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen space-y-2 bg-gray-100 pb-8 dark:bg-gray-800">
      {/* Page Info Section */}
      <div ref={infoSectionRef}>
        {pageInfo && (
          <PageInfoSection
            page={page}
            pageInfo={pageInfo}
            profilePictureUrl={profilePictureUrl}
            totalAds={pageTotalAds || 0}
          />
        )}
      </div>

      {/* Sticky SearchBar Filters */}
      <SearchFilters onSearch={handleSearchAds} isLoading={isLoading} />

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

export default PageAdBrowser;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdLibraryMobileFocusedStateProviderRefetchQuery,
  AdLibrarySearchPaginationQuery,
} from "@/actions/Meta-GraphQL-Queries";

import type { AdData } from "@/types/ad";

import PageInfoSection from "./microComponents/PageInfoSection";
import { ScrollButtons } from "./microComponents/ScrollButtons";
import SearchResults from "./microComponents/SearchResults";
import {
  SearchFilterProvider,
  useSearchFilters,
} from "./search/search-filter-context";
import SearchFilters from "./search/search-filters";

const PageAdBrowserContent = ({ pageId }: { pageId: string }) => {
  const { getSearchParams } = useSearchFilters();

  // Refs
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const isSearchInProgress = useRef(false);
  const initialLoadCompletedRef = useRef(false);
  const searchRequestIdRef = useRef(0);

  // Search state
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Page info state
  const [pageInfo, setPageInfo] = useState<any | null>(null);
  const [page, setPage] = useState<any | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [pageTotalAds, setPageTotalAds] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Scroll to top on component mount (except initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isInitialLoad]);

  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      // Prevent concurrent searches for new searches
      if (!isLoadingMore && isSearchInProgress.current && !isInitialLoad) {
        return;
      }

      // Generate unique request ID to handle race conditions
      const currentRequestId = ++searchRequestIdRef.current;

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        let results;

        if (isInitialLoad) {
          // Initial load: fetch page info and initial ads
          results =
            await AdLibraryMobileFocusedStateProviderRefetchQuery(pageId);

          // Check if this is still the relevant request
          if (currentRequestId !== searchRequestIdRef.current) return;

          // Set page information
          setPageInfo(results.page_info);
          setPage(results.page);
          if (results.ads && results.ads.length > 0) {
            setProfilePictureUrl(
              results.ads[0].snapshot.page_profile_picture_url,
            );
          }
          setPageTotalAds(results.total_count);
          setIsInitialLoad(false);
          initialLoadCompletedRef.current = true;
        } else {
          // Subsequent searches: use filter context
          const searchParams = getSearchParams();

          results = await AdLibrarySearchPaginationQuery(
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
            pageId,
          );

          // Check if this is still the relevant request
          if (currentRequestId !== searchRequestIdRef.current) return;
        }

        // Update total count for new searches
        if (!isLoadingMore) {
          setTotalCount(results.total_count);
        }

        // Update results
        if (isLoadingMore && searchResults) {
          setSearchResults((prevResults) => [...prevResults!, ...results.ads]);
        } else {
          setSearchResults(results.ads);
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
        console.error("Error searching ads:", searchError);

        // Check if this is still the relevant request
        if (currentRequestId !== searchRequestIdRef.current) return;

        setError(
          "An error occurred while searching for ads. Please try again.",
        );

        // Clear results on error for new searches
        if (!isLoadingMore && !isInitialLoad) {
          setSearchResults(null);
        }
      } finally {
        // Only update loading state if this is the most recent request
        if (currentRequestId === searchRequestIdRef.current) {
          setIsLoading(false);
          isSearchInProgress.current = false;
        }
      }
    },
    [getSearchParams, searchResults, endCursor, pageId, isInitialLoad],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading && !isSearchInProgress.current) {
      executeSearch(true);
    }
  }, [hasNextPage, executeSearch, isLoading]);

  // Initial load effect
  useEffect(() => {
    if (initialLoadCompletedRef.current) return;

    const initializePageData = async () => {
      // Small delay to ensure component mounting is complete
      await new Promise((resolve) => setTimeout(resolve, 10));
      executeSearch();
    };

    initializePageData();
  }, [executeSearch]);

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

      {/* Search Filters */}
      <SearchFilters onSearch={executeSearch} isLoading={isLoading} />

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

      {/* Scroll Buttons */}
      <ScrollButtons />
    </div>
  );
};

/**
 * Main PageAdBrowser component with context provider
 */
export const PageAdBrowser = ({ pageId }: { pageId: string }) => {
  return (
    <SearchFilterProvider
      defaultValues={{
        status: "ALL",
      }}
    >
      <PageAdBrowserContent pageId={pageId} />
    </SearchFilterProvider>
  );
};

export default PageAdBrowser;

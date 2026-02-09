"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AdData } from "@/types/ad";
import { fetchMeta } from "@/lib/meta/fetchMeta";

import {
  SearchFilterProvider,
  useSearchFilters,
} from "./search/search-filter-context";
import SearchFilters from "./search/search-filters";
import PageInfoSection from "./sharedComponents/PageInfoSection";
import { ScrollButtons } from "./sharedComponents/ScrollButtons";
import SearchResults from "./sharedComponents/SearchResults";

// 🗂️ Define the shape of the GraphQL edge
interface Edge {
  node: {
    collated_results?: AdData[];
  };
}

// ✨ Helper: Extract and collate Ads from edges
const extractCollatedAds = (
  rawEdges: Edge[] | Edge | null | undefined,
): { ads: AdData[]; searchCount: number } => {
  let totalOriginalAds = 0;

  // Normalize edges into an array
  const edges = Array.isArray(rawEdges) ? rawEdges : rawEdges ? [rawEdges] : [];

  const ads = edges
    .map((edge) => edge.node.collated_results ?? [])
    .filter((group) => group.length > 0)
    .map((group) => {
      const groupCount = group.length;
      totalOriginalAds += groupCount; // Count all original ads

      const maxOriginal = group.reduce(
        (max, ad) => Math.max(max, ad.collation_count ?? 0),
        0,
      );

      const collation_count = Math.max(maxOriginal, groupCount, 1);
      const [firstAd] = group;

      return { ...firstAd, collation_count };
    });

  return { ads, searchCount: totalOriginalAds };
};

const PageAdBrowserContent = ({ pageId }: { pageId: string }) => {
  const { getSearchParams } = useSearchFilters();

  // Refs
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const isSearchInProgress = useRef(false);
  const initialLoadCompletedRef = useRef(false);

  // Search state
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  // Track last search count
  const [lastSearchCount, setLastSearchCount] = useState<number>(0);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Current search params state for synchronization
  const [currentSearchParams, setCurrentSearchParams] = useState<any>(null);

  // Page info state (set once on initial load)
  const [pageInfo, setPageInfo] = useState<{
    about_text?: string;
    admin_country_counts?: any[];
    history_items?: any[];
    total_spend?: any;
    page_info?: any[];
    count?: number;
  }>({});

  // Scroll to top on component mount (except initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isInitialLoad]);

  // Handle sync issues
  const handleSyncIssue = useCallback((issue: string) => {
    console.warn("🔄 Page Sync Issue:", issue);
  }, []);

  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      // Prevent concurrent searches for new searches
      if (!isLoadingMore && isSearchInProgress.current && !isInitialLoad) {
        return;
      }

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = getSearchParams();

        // Store current search params for synchronization
        if (!isLoadingMore) {
          setCurrentSearchParams({ ...searchParams, pageId });
        }

        // Build query string
        let queryString = searchParams.q || "";
        const categoryAsKeyword = searchParams.category_as_keyword || "";
        queryString = [queryString, categoryAsKeyword]
          .filter(Boolean)
          .join(", ");

        // Process date range
        const startDate = (() => {
          const startDateParam = searchParams.start_date;
          let endDateParam = searchParams.end_date;

          if (endDateParam) {
            const updatedDate = new Date(endDateParam);
            updatedDate.setDate(updatedDate.getDate() + 1);
            endDateParam = updatedDate.toISOString().split("T")[0];
          }

          return startDateParam || endDateParam
            ? { min: startDateParam || null, max: endDateParam || null }
            : null;
        })();

        // Choose fetch method based on whether loading more
        const fetchName = isLoadingMore ? "ad-pagination" : "ad-refetch";

        const baseVariables = {
          adType: searchParams.ad_type || "ALL",
          bylines: [],
          collationToken: null,
          contentLanguages: searchParams.content_languages || [],
          countries: searchParams.countries || ["ALL"],
          mediaType: searchParams.media_type || "ALL",
          multiCountryFilterMode: null,
          pageIDs: [],
          publisherPlatforms: searchParams.publisher_platforms || [],
          queryString,
          searchType: searchParams.search_type || "PAGE",
          sortData: searchParams.sort_data || null,
          source: null,
          startDate,
          viewAllPageID: pageId,
        };

        // Add specific variables based on fetch type
        const variables = isLoadingMore
          ? {
              ...baseVariables,
              activeStatus: searchParams.active_status || "ACTIVE",
              cursor: endCursor,
              excludedIDs: null,
              first: 30,
              isTargetedCountry: false,
              location: null,
              potentialReachInput: null,
              regions: null,
            }
          : {
              ...baseVariables,
              activeStatus: searchParams.active_status || "ALL",
              audienceTimeframe: "LAST_7_DAYS",
              country: "ALL",
              deeplinkAdID: null,
              excludedIDs: [],
              fetchPageInfo: true,
              fetchSharedDisclaimers: true,
              hasDeeplinkAdID: false,
              isAboutTab: true,
              isAudienceTab: false,
              isLandingPage: false,
              isTargetedCountry: false,
              location: null,
              potentialReachInput: [],
              regions: [],
              shouldFetchCount: true,
            };

        const result = await fetchMeta(
          { name: fetchName },
          {
            variables,
            includeRaw: false,
          },
        );
        // Log diagnostics in browser console
        console.log("🩺 Diagnostic:", result.diagnostics, "\n", {
          name: result.name,
        });

        if (!result.success || !result.extracted) {
          console.error("❌ FetchMeta failed or no data extracted");
          throw new Error("Failed to fetch ads");
        }

        const { edges, end_cursor, has_next_page, count } = result.extracted;

        // Extract ads from edges and get search count
        const { ads: newAds, searchCount } = extractCollatedAds(edges || []);

        // Update results
        if (isLoadingMore && searchResults) {
          setSearchResults((prevResults) => [
            ...(prevResults ?? []),
            ...newAds,
          ]);
        } else {
          setSearchResults(newAds);
          setTotalCount(count || 0);
        }

        // Set page info once on initial load
        if (isInitialLoad) {
          setPageInfo({
            about_text: result.extracted.about_text,
            admin_country_counts: result.extracted.admin_country_counts,
            history_items: result.extracted.history_items,
            total_spend: result.extracted.total_spend,
            page_info: result.extracted.page_info,
            count: count,
          });
          setIsInitialLoad(false);
          initialLoadCompletedRef.current = true;
        }

        // Update last search count
        setLastSearchCount(searchCount);

        // Update pagination state
        setEndCursor(end_cursor || null);
        setHasNextPage(has_next_page || false);

        // Calculate remaining count
        if (isLoadingMore) {
          // Subtract last search count from remaining
          setRemainingCount((prev) => Math.max(0, (prev || 0) - searchCount));
        } else {
          // Initial remaining count = total - first batch
          setRemainingCount(Math.max(0, (count || 0) - searchCount));
        }

        console.log("📊 Page Load Stats:", {
          total_count: count,
          search_count: searchCount,
          remaining: isLoadingMore
            ? Math.max(0, (remainingCount || 0) - searchCount)
            : Math.max(0, (count || 0) - searchCount),
          has_next_page: has_next_page,
          pageId,
        });
      } catch (searchError) {
        console.error("Error searching ads:", searchError);
        setError(
          "An error occurred while searching for ads. Please try again.",
        );

        // Clear results on error for new searches
        if (!isLoadingMore && !isInitialLoad) {
          setSearchResults(null);
          setLastSearchCount(0);
        }
      } finally {
        setIsLoading(false);
        isSearchInProgress.current = false;
      }
    },
    [
      getSearchParams,
      searchResults,
      endCursor,
      pageId,
      isInitialLoad,
      remainingCount,
    ],
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
        <PageInfoSection
          about_text={pageInfo.about_text}
          admin_country_counts={pageInfo.admin_country_counts}
          history_items={pageInfo.history_items}
          total_spend={pageInfo.total_spend}
          page_info={pageInfo.page_info}
          count={pageInfo.count}
        />
      </div>

      {/* Search Filters */}
      <SearchFilters
        onSearch={executeSearch}
        isLoading={isLoading}
        defaultExpanded={false}
      />

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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Facebook, Star } from "lucide-react";

import type { AdData } from "@/types/ad";

import { fetchMeta } from "./meta/fetchMeta";
import {
  SearchFilterProvider,
  useSearchFilters,
} from "./search/search-filter-context";
import SearchFilters from "./search/search-filters";
import { ScrollButtons } from "./sharedComponents/ScrollButtons";
import SearchResults from "./sharedComponents/SearchResults";
import TitleSection from "./sharedComponents/TitleSection";

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

  // Track last search count
  const [lastSearchCount, setLastSearchCount] = useState<number>(0);

  // Current search params state for synchronization
  const [currentSearchParams, setCurrentSearchParams] = useState<any>(null);

  // Prevent concurrent searches
  const isSearchInProgress = useRef(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Handle sync issues
  const handleSyncIssue = useCallback((issue: string) => {
    console.warn("🔄 Sync Issue:", issue);
  }, []);

  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      if (!isLoadingMore && isSearchInProgress.current) return;

      isSearchInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const searchParams = getSearchParams();

        // Store current search params for synchronization
        if (!isLoadingMore) {
          setCurrentSearchParams(searchParams);
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
          activeStatus: searchParams.active_status || "ACTIVE",
          adType: searchParams.ad_type || "ALL",
          bylines: [],
          collationToken: null,
          contentLanguages: searchParams.content_languages || [],
          countries: searchParams.countries || ["ALL"],
          excludedIDs: isLoadingMore ? null : [],
          isTargetedCountry: false,
          location: null,
          mediaType: searchParams.media_type || "ALL",
          multiCountryFilterMode: null,
          pageIDs: [],
          potentialReachInput: isLoadingMore ? null : [],
          publisherPlatforms: searchParams.publisher_platforms || [],
          queryString,
          regions: isLoadingMore ? null : [],
          searchType: searchParams.search_type || "KEYWORD_UNORDERED",
          sortData: searchParams.sort_data || null,
          source: null,
          startDate,
          viewAllPageID: "0",
        };

        // Add specific variables based on fetch type
        const variables = isLoadingMore
          ? {
              ...baseVariables,
              cursor: endCursor,
              first: 30,
            }
          : {
              ...baseVariables,
              audienceTimeframe: "LAST_7_DAYS",
              country: "ALL",
              deeplinkAdID: null,
              fetchPageInfo: false,
              fetchSharedDisclaimers: false,
              hasDeeplinkAdID: false,
              isAboutTab: false,
              isAudienceTab: false,
              isLandingPage: false,
              shouldFetchCount: true,
            };

        const result = await fetchMeta(
          { name: fetchName },
          {
            variables,
            includeRaw: false,
          },
        );

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

        console.log("📊 Load Stats:", {
          total_count: count,
          search_count: searchCount,
          remaining: isLoadingMore
            ? Math.max(0, (remainingCount || 0) - searchCount)
            : Math.max(0, (count || 0) - searchCount),
          has_next_page: has_next_page,
        });
      } catch (searchError) {
        console.error("Search error:", searchError);
        setError("An error occurred while searching. Please try again.");
        if (!isLoadingMore) {
          setSearchResults(null);
          setLastSearchCount(0);
        }
      } finally {
        setIsLoading(false);
        isSearchInProgress.current = false;
      }
    },
    [getSearchParams, searchResults, endCursor, remainingCount],
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

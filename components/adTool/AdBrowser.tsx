// @/components/adTool/AdBrowser.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { META_FILTERS } from "@/configuration/globalFilters";
import { Facebook, LayoutGrid, Star } from "lucide-react";

import type { AdData } from "@/types/ad";
import { fetchMeta } from "@/lib/meta/fetchMeta";

import { ScrollButtons } from "./sharedComponents/ScrollButtons";
import SearchFilters from "./sharedComponents/SearchFilters";
import SearchResults from "./sharedComponents/SearchResults";
import TitleSection from "./sharedComponents/TitleSection";

interface Edge {
  node: { collated_results?: AdData[] };
}
const extractCollatedAds = (rawEdges: Edge[] | Edge | null | undefined) => {
  let totalOriginalAds = 0;
  const edges = Array.isArray(rawEdges) ? rawEdges : rawEdges ? [rawEdges] : [];
  const ads = edges
    .map((edge) => edge.node.collated_results ?? [])
    .filter((group) => group.length > 0)
    .map((group) => {
      totalOriginalAds += group.length;
      const maxOriginal = group.reduce(
        (max, ad) => Math.max(max, ad.collation_count ?? 0),
        0,
      );
      return {
        ...group[0],
        collation_count: Math.max(maxOriginal, group.length, 1),
      };
    });
  return { ads, searchCount: totalOriginalAds };
};

export default function AdBrowser() {
  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [fetchedCount, setFetchedCount] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const endCursorRef = useRef<string | null>(null);
  const lastParamsRef = useRef<URLSearchParams | null>(null);

  const executeSearch = useCallback(
    async (params: URLSearchParams, isLoadMore = false) => {
      setIsLoading(true);
      setError(null);
      lastParamsRef.current = params;

      try {
        const startDateParam = params.get("start_date");
        let endDateParam = params.get("end_date");
        if (endDateParam) {
          const d = new Date(endDateParam);
          d.setDate(d.getDate() + 1);
          endDateParam = d.toISOString().split("T")[0];
        }
        const startDate =
          startDateParam || endDateParam
            ? { min: startDateParam || null, max: endDateParam || null }
            : null;

        const baseVariables = {
          activeStatus: params.get("active_status") || "ACTIVE",
          adType: params.get("ad_type") || "ALL",
          bylines: [],
          collationToken: null,
          contentLanguages: params.getAll("content_languages").length
            ? params.getAll("content_languages")
            : [],
          countries: params.getAll("countries").length
            ? params.getAll("countries")
            : ["ALL"],
          excludedIDs: isLoadMore ? null : [],
          isTargetedCountry: false,
          location: null,
          mediaType: params.get("media_type") || "ALL",
          multiCountryFilterMode: null,
          pageIDs: [],
          potentialReachInput: isLoadMore ? null : [],
          publisherPlatforms: params.getAll("publisher_platforms").length
            ? params.getAll("publisher_platforms")
            : [],
          queryString: params.get("q") || "",
          regions: isLoadMore ? null : [],
          searchType: params.get("search_type") || "KEYWORD_UNORDERED",
          sortData: null,
          source: null,
          startDate,
          viewAllPageID: "0",
        };

        const variables = isLoadMore
          ? { ...baseVariables, cursor: endCursorRef.current, first: 30 }
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
          { name: isLoadMore ? "ad-pagination" : "ad-refetch" },
          { variables, includeRaw: false },
        );

        if (!result.success || !result.extracted)
          throw new Error("Failed to fetch ads from Meta");

        const { edges, end_cursor, has_next_page, count } = result.extracted;
        const { ads: newAds, searchCount } = extractCollatedAds(edges || []);

        if (isLoadMore) {
          setSearchResults((prev) => [...(prev || []), ...newAds]);
          setFetchedCount((prev) => prev + searchCount);
        } else {
          setSearchResults(newAds);
          setTotalCount(count || 0);
          setFetchedCount(searchCount);
        }

        endCursorRef.current = end_cursor || null;
        setHasNextPage(has_next_page || false);
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
        if (!isLoadMore) setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading && lastParamsRef.current) {
      executeSearch(lastParamsRef.current, true);
    }
  }, [hasNextPage, isLoading, executeSearch]);

  const remainingCount =
    totalCount !== null ? Math.max(0, totalCount - fetchedCount) : null;
  const hasSearched = lastParamsRef.current !== null;

  return (
    <div className="min-h-screen space-y-2 bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <TitleSection
        icon={Star}
        iconColor="text-purple-500"
        badgeText="Professional Ad Tools"
        image={Facebook}
        imageColor="text-blue-600"
        highlightedText="Meta Search"
        remainingTitle="Live Ads"
        auroraColors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
      />

      <SearchFilters
        isLoading={isLoading}
        filters={META_FILTERS}
        onSearch={(p) => executeSearch(p, false)}
      />

      <SearchResults
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        hasNextPage={hasNextPage}
        remainingCount={remainingCount}
        handleLoadMore={handleLoadMore}
      />

      <ScrollButtons />
    </div>
  );
}

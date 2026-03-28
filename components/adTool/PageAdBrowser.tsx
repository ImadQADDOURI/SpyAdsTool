// @/components/adTool/PageAdBrowser.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { META_FILTERS } from "@/configuration/globalFilters";
import { Loader2 } from "lucide-react";

import type { AdData } from "@/types/ad";
import { fetchMeta } from "@/lib/meta/fetchMeta";

import PageInfoSection from "./sharedComponents/PageInfoSection";
import { ScrollButtons } from "./sharedComponents/ScrollButtons";
import SearchFilters from "./sharedComponents/SearchFilters";
import SearchResults from "./sharedComponents/SearchResults";

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

export default function PageAdBrowser({ pageId }: { pageId: string }) {
  const [pageInfo, setPageInfo] = useState<any>({});
  const [isInfoLoading, setIsInfoLoading] = useState(true);

  const [searchResults, setSearchResults] = useState<AdData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [fetchedCount, setFetchedCount] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const endCursorRef = useRef<string | null>(null);
  const lastParamsRef = useRef<URLSearchParams | null>(null);

  // 🚀 ISOLATED ON-MOUNT FETCH (Only populates Page Info)
  useEffect(() => {
    let isMounted = true;
    const fetchPageInfo = async () => {
      try {
        const variables = {
          viewAllPageID: pageId,
          activeStatus: "ALL",
          adType: "ALL",
          bylines: [],
          collationToken: null,
          contentLanguages: [],
          countries: ["ALL"],
          mediaType: "ALL",
          multiCountryFilterMode: null,
          pageIDs: [],
          publisherPlatforms: [],
          queryString: "",
          searchType: "PAGE",
          sortData: null,
          source: null,
          startDate: null,
          audienceTimeframe: "LAST_7_DAYS",
          country: "ALL",
          deeplinkAdID: null,
          excludedIDs: [],
          fetchPageInfo: true, // <--- GRABS INFO
          fetchSharedDisclaimers: true,
          hasDeeplinkAdID: false,
          isAboutTab: true, // <--- GRABS INFO
          isAudienceTab: false,
          isLandingPage: false,
          isTargetedCountry: false,
          location: null,
          potentialReachInput: [],
          regions: [],
          shouldFetchCount: true,
        };
        const result = await fetchMeta(
          { name: "ad-refetch" },
          { variables, includeRaw: false },
        );
        if (result.success && result.extracted && isMounted) {
          setPageInfo({
            about_text: result.extracted.about_text,
            admin_country_counts: result.extracted.admin_country_counts,
            history_items: result.extracted.history_items,
            total_spend: result.extracted.total_spend,
            page_info: result.extracted.page_info,
            count: result.extracted.count,
          });
        }
      } catch (err) {
        console.error("Failed to fetch page info", err);
      } finally {
        if (isMounted) setIsInfoLoading(false);
      }
    };
    fetchPageInfo();
    return () => {
      isMounted = false;
    };
  }, [pageId]);

  // 🚀 EVENT-DRIVEN AD SEARCH
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
          mediaType: params.get("media_type") || "ALL",
          multiCountryFilterMode: null,
          pageIDs: [],
          publisherPlatforms: params.getAll("publisher_platforms").length
            ? params.getAll("publisher_platforms")
            : [],
          queryString: params.get("q") || "",
          searchType: "PAGE",
          sortData: null,
          source: null,
          startDate,
          viewAllPageID: pageId,
        };

        const variables = isLoadMore
          ? {
              ...baseVariables,
              cursor: endCursorRef.current,
              excludedIDs: null,
              first: 30,
              isTargetedCountry: false,
              location: null,
              potentialReachInput: null,
              regions: null,
            }
          : {
              ...baseVariables,
              audienceTimeframe: "LAST_7_DAYS",
              country: "ALL",
              deeplinkAdID: null,
              excludedIDs: [],
              fetchPageInfo: false,
              fetchSharedDisclaimers: false,
              hasDeeplinkAdID: false,
              isAboutTab: false,
              isAudienceTab: false,
              isLandingPage: false,
              isTargetedCountry: false,
              location: null,
              potentialReachInput: [],
              regions: [],
              shouldFetchCount: true,
            };

        const result = await fetchMeta(
          { name: isLoadMore ? "ad-pagination" : "ad-refetch" },
          { variables, includeRaw: false },
        );

        if (!result.success || !result.extracted)
          throw new Error("Failed to fetch ads");

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
        setError("An error occurred while searching for ads.");
        if (!isLoadMore) setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [pageId],
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
    <div className="min-h-screen space-y-2 bg-gray-100 pb-8 dark:bg-gray-800">
      <div className="relative">
        {isInfoLoading && (
          <div className="absolute inset-0 z-10 mx-4 mt-4 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px] dark:bg-gray-800/60">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
              Fetching Page Data...
            </span>
          </div>
        )}
        <PageInfoSection
          about_text={pageInfo.about_text}
          admin_country_counts={pageInfo.admin_country_counts}
          history_items={pageInfo.history_items}
          total_spend={pageInfo.total_spend}
          page_info={pageInfo.page_info}
          count={pageInfo.count}
        />
      </div>

      <SearchFilters
        isLoading={isLoading || isInfoLoading} //🛡️ Combine isLoading AND isInfoLoading so filters are disabled until page data is ready
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

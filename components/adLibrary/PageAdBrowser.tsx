"use client";

import { memo, useCallback, useEffect, useReducer, useRef } from "react";
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

// 🚀 Consolidated state interface
interface PageSearchState {
  // Search results
  results: AdData[] | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  remainingCount: number | null;
  endCursor: string | null;
  hasNextPage: boolean;

  // Page info
  pageInfo: any | null;
  page: any | null;
  profilePictureUrl: string | null;
  pageTotalAds: number | null;
  isInitialLoad: boolean;
}

type PageSearchAction =
  | { type: "SEARCH_START" }
  | {
      type: "INITIAL_LOAD_SUCCESS";
      payload: {
        pageInfo: any;
        page: any;
        results: AdData[];
        totalCount: number;
        endCursor: string | null;
        hasNextPage: boolean;
        profilePictureUrl?: string;
      };
    }
  | {
      type: "SEARCH_SUCCESS";
      payload: {
        results: AdData[];
        totalCount: number;
        endCursor: string | null;
        hasNextPage: boolean;
        isLoadingMore: boolean;
      };
    }
  | { type: "SEARCH_ERROR"; payload: string }
  | {
      type: "LOAD_MORE_SUCCESS";
      payload: {
        results: AdData[];
        endCursor: string | null;
        hasNextPage: boolean;
      };
    };

// 🔄 Optimized reducer
const pageSearchReducer = (
  state: PageSearchState,
  action: PageSearchAction,
): PageSearchState => {
  switch (action.type) {
    case "SEARCH_START":
      return { ...state, isLoading: true, error: null };

    case "INITIAL_LOAD_SUCCESS":
      const {
        pageInfo,
        page,
        results,
        totalCount,
        endCursor,
        hasNextPage,
        profilePictureUrl,
      } = action.payload;
      const remainingCount =
        totalCount >= 50001
          ? totalCount
          : Math.max(0, totalCount - results.length);

      return {
        ...state,
        pageInfo,
        page,
        results,
        totalCount,
        endCursor,
        hasNextPage,
        profilePictureUrl: profilePictureUrl || null,
        pageTotalAds: totalCount,
        remainingCount,
        isLoading: false,
        error: null,
        isInitialLoad: false,
      };

    case "SEARCH_SUCCESS":
      const {
        results: searchResults,
        totalCount: searchTotal,
        endCursor: searchCursor,
        hasNextPage: searchHasNext,
        isLoadingMore,
      } = action.payload;
      const newResults = isLoadingMore
        ? [...(state.results ?? []), ...searchResults]
        : searchResults;
      const currentLength = isLoadingMore ? (state.results?.length ?? 0) : 0;
      const newRemainingCount =
        searchTotal >= 50001
          ? searchTotal
          : Math.max(0, searchTotal - currentLength - searchResults.length);

      return {
        ...state,
        results: newResults,
        totalCount: isLoadingMore ? state.totalCount : searchTotal,
        endCursor: searchCursor,
        hasNextPage: searchHasNext,
        remainingCount: newRemainingCount,
        isLoading: false,
        error: null,
      };

    case "SEARCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "LOAD_MORE_SUCCESS":
      return {
        ...state,
        results: [...(state.results ?? []), ...action.payload.results],
        endCursor: action.payload.endCursor,
        hasNextPage: action.payload.hasNextPage,
        isLoading: false,
      };

    default:
      return state;
  }
};

// 🎯 Optimized main component
const PageAdBrowserContent = memo(({ pageId }: { pageId: string }) => {
  const { getSearchParams } = useSearchFilters();

  // 📦 Consolidated state
  const [state, dispatch] = useReducer(pageSearchReducer, {
    results: null,
    isLoading: false,
    error: null,
    totalCount: null,
    remainingCount: null,
    endCursor: null,
    hasNextPage: false,
    pageInfo: null,
    page: null,
    profilePictureUrl: null,
    pageTotalAds: null,
    isInitialLoad: true,
  });

  // 🔄 Single control ref
  const controlRef = useRef({
    infoSectionRef: null as HTMLDivElement | null,
    isSearchInProgress: false,
    initialLoadCompleted: false,
    requestId: 0,
  });

  // 🚀 Optimized scroll effect
  useEffect(() => {
    if (!state.isInitialLoad) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [state.isInitialLoad]);

  // 🔍 Optimized search function
  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      // Prevent concurrent searches
      if (
        !isLoadingMore &&
        controlRef.current.isSearchInProgress &&
        !state.isInitialLoad
      ) {
        return;
      }

      // Race condition protection
      const currentRequestId = ++controlRef.current.requestId;
      controlRef.current.isSearchInProgress = true;
      dispatch({ type: "SEARCH_START" });

      try {
        let results;

        if (state.isInitialLoad) {
          // 🚀 Initial load optimization
          results =
            await AdLibraryMobileFocusedStateProviderRefetchQuery(pageId);

          if (currentRequestId !== controlRef.current.requestId) return;

          const profilePictureUrl =
            results.ads?.[0]?.snapshot?.page_profile_picture_url;

          dispatch({
            type: "INITIAL_LOAD_SUCCESS",
            payload: {
              pageInfo: results.page_info,
              page: results.page,
              results: results.ads,
              totalCount: results.count,
              endCursor: results.end_cursor,
              hasNextPage: results.has_next_page,
              profilePictureUrl,
            },
          });

          controlRef.current.initialLoadCompleted = true;
        } else {
          // 🔍 Subsequent searches
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
            isLoadingMore ? state.endCursor : null,
            pageId,
          );

          if (currentRequestId !== controlRef.current.requestId) return;

          // 📜 Smart scrolling
          // if (!isLoadingMore && controlRef.current.infoSectionRef) {
          //   const sectionTop = controlRef.current.infoSectionRef.offsetTop;
          //   window.scrollTo({ top: sectionTop, behavior: "smooth" });
          // }

          if (isLoadingMore) {
            dispatch({
              type: "LOAD_MORE_SUCCESS",
              payload: {
                results: results.ads,
                endCursor: results.end_cursor,
                hasNextPage: results.has_next_page,
              },
            });
          } else {
            dispatch({
              type: "SEARCH_SUCCESS",
              payload: {
                results: results.ads,
                totalCount: results.count,
                endCursor: results.end_cursor,
                hasNextPage: results.has_next_page,
                isLoadingMore: false,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error searching ads:", error);

        if (currentRequestId !== controlRef.current.requestId) return;

        dispatch({
          type: "SEARCH_ERROR",
          payload:
            "An error occurred while searching for ads. Please try again.",
        });
      } finally {
        if (currentRequestId === controlRef.current.requestId) {
          controlRef.current.isSearchInProgress = false;
        }
      }
    },
    [getSearchParams, state.endCursor, state.isInitialLoad, pageId],
  );

  // 📄 Optimized load more
  const handleLoadMore = useCallback(() => {
    if (
      state.hasNextPage &&
      !state.isLoading &&
      !controlRef.current.isSearchInProgress
    ) {
      executeSearch(true);
    }
  }, [state.hasNextPage, state.isLoading, executeSearch]);

  // 🚀 Initial load effect
  useEffect(() => {
    if (controlRef.current.initialLoadCompleted) return;

    const initializePageData = async () => {
      // Micro delay for mounting completion
      await new Promise((resolve) => setTimeout(resolve, 10));
      executeSearch();
    };

    initializePageData();
  }, [executeSearch]);

  return (
    <div className="page-browser-container">
      {/* 📄 Page Info Section */}
      <div
        ref={(el) => {
          controlRef.current.infoSectionRef = el;
        }}
      >
        {state.pageInfo && (
          <PageInfoSection
            page={state.page}
            pageInfo={state.pageInfo}
            profilePictureUrl={state.profilePictureUrl}
            totalAds={state.pageTotalAds || 0}
          />
        )}
      </div>

      {/* 🔍 Search Filters */}
      <SearchFilters onSearch={executeSearch} isLoading={state.isLoading} />

      {/* 📊 Search Results */}
      <SearchResults
        isLoading={state.isLoading}
        error={state.error}
        totalCount={state.totalCount}
        searchResults={state.results}
        hasNextPage={state.hasNextPage}
        remainingCount={state.remainingCount}
        handleLoadMore={handleLoadMore}
      />

      {/* 📜 Scroll Buttons */}
      <ScrollButtons />

      {/* 🎨 Optimized styles */}
      <style jsx>{`
        .page-browser-container {
          min-height: 100vh;
          gap: 0.5rem;
          display: flex;
          flex-direction: column;
          background-color: rgb(243 244 246);
          padding-bottom: 2rem;
          will-change: transform;
          transform: translateZ(0);
        }

        :global(.dark) .page-browser-container {
          background-color: rgb(31 41 55);
        }

        /* 🚀 Performance optimizations */
        .page-browser-container > * {
          will-change: auto;
        }
      `}</style>
    </div>
  );
});

PageAdBrowserContent.displayName = "PageAdBrowserContent";

/**
 * 🎯 Main PageAdBrowser component with context provider
 */
export const PageAdBrowser = memo(({ pageId }: { pageId: string }) => {
  return (
    <SearchFilterProvider
      defaultValues={{
        status: "ALL",
      }}
    >
      <PageAdBrowserContent pageId={pageId} />
    </SearchFilterProvider>
  );
});

PageAdBrowser.displayName = "PageAdBrowser";

export default PageAdBrowser;

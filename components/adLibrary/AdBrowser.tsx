"use client";

import { memo, useCallback, useEffect, useReducer, useRef } from "react";
import Image from "next/image";
import { AdLibrarySearchPaginationQuery } from "@/actions/Meta-GraphQL-Queries";
import {
  BarChart,
  BrainCircuit,
  Download,
  Filter,
  PieChart,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { AdData } from "@/types/ad";

import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import SearchResults from "./microComponents/SearchResults";
import {
  SearchFilterProvider,
  useSearchFilters,
} from "./search/search-filter-context";
import SearchFilters from "./search/search-filters";

// 🚀 Consolidated state using useReducer for better performance
interface SearchState {
  results: AdData[] | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  remainingCount: number | null;
  endCursor: string | null;
  hasNextPage: boolean;
}

type SearchAction =
  | { type: "SEARCH_START" }
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

const searchReducer = (
  state: SearchState,
  action: SearchAction,
): SearchState => {
  switch (action.type) {
    case "SEARCH_START":
      return { ...state, isLoading: true, error: null };

    case "SEARCH_SUCCESS":
      const { results, totalCount, endCursor, hasNextPage, isLoadingMore } =
        action.payload;
      const newResults = isLoadingMore
        ? [...(state.results ?? []), ...results]
        : results;
      const currentLength = isLoadingMore ? (state.results?.length ?? 0) : 0;
      const newRemainingCount =
        totalCount >= 50001
          ? totalCount
          : Math.max(0, totalCount - currentLength - results.length);

      return {
        ...state,
        results: newResults,
        totalCount,
        endCursor,
        hasNextPage,
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

// 🎨 Memoized feature highlight component
const FeatureHighlight = memo(
  ({
    icon: Icon,
    label,
    color,
  }: {
    icon: any;
    label: string;
    color: string;
  }) => (
    <div className="feature-highlight">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-sm">{label}</span>
      <style jsx>{`
        .feature-highlight {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }

        :global(.dark) .feature-highlight {
          background: rgba(31, 41, 55, 0.5);
        }

        .feature-highlight:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.7);
        }

        :global(.dark) .feature-highlight:hover {
          background: rgba(31, 41, 55, 0.7);
        }
      `}</style>
    </div>
  ),
);

FeatureHighlight.displayName = "FeatureHighlight";

// 🎯 Main optimized component
const AdBrowserContent = () => {
  const { getSearchParams } = useSearchFilters();

  // 📦 Consolidated state with useReducer
  const [state, dispatch] = useReducer(searchReducer, {
    results: null,
    isLoading: false,
    error: null,
    totalCount: null,
    remainingCount: null,
    endCursor: null,
    hasNextPage: false,
  });

  // 🔄 Single ref for search control
  const searchControlRef = useRef({
    isInProgress: false,
    titleSectionRef: null as HTMLDivElement | null,
  });

  // 🚀 Scroll to top on mount (optimized)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // 🔍 Optimized search function
  const executeSearch = useCallback(
    async (isLoadingMore = false) => {
      if (!isLoadingMore && searchControlRef.current.isInProgress) return;

      searchControlRef.current.isInProgress = true;
      dispatch({ type: "SEARCH_START" });

      // 📜 Smart scrolling
      // if (!isLoadingMore && searchControlRef.current.titleSectionRef) {
      //   const element = searchControlRef.current.titleSectionRef;
      //   const sectionBottom = element.offsetTop + element.offsetHeight;
      //   window.scrollTo({ top: sectionBottom, behavior: "smooth" });
      // }

      try {
        const searchParams = getSearchParams();
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
          isLoadingMore ? state.endCursor : null,
        );

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
      } catch (error) {
        console.error("Search error:", error);
        dispatch({
          type: "SEARCH_ERROR",
          payload: "An error occurred while searching. Please try again.",
        });
      } finally {
        searchControlRef.current.isInProgress = false;
      }
    },
    [getSearchParams, state.endCursor],
  );

  // 📄 Optimized load more handler
  const handleLoadMore = useCallback(() => {
    if (
      state.hasNextPage &&
      !state.isLoading &&
      !searchControlRef.current.isInProgress
    ) {
      executeSearch(true);
    }
  }, [state.hasNextPage, state.isLoading, executeSearch]);

  return (
    <div className="min-h-screen space-y-2 bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      {/* 🎨 Optimized header with CSS animations */}
      <div
        ref={(el) => {
          searchControlRef.current.titleSectionRef = el;
        }}
        className="header-section"
      >
        <FirefliesWrapper intensity="high">
          <div className="group relative overflow-hidden py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6566F1]/5 via-transparent to-[#B977F8]/5" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="header-content">
                {/* 🏷️ Badge */}
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-[#B977F8]" />
                  <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                    Professional Ad Tools
                  </span>
                </div>

                {/* 🎯 Main title */}
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                  <span className="facebook-icon-wrapper">
                    <Image
                      src="/facebook.svg"
                      alt="Facebook Icon"
                      className="-mt-4 mr-2 inline-block size-24"
                      width={100}
                      height={100}
                    />
                  </span>
                  <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                    Ad Search
                  </span>{" "}
                  <br className="sm:hidden" />
                  <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-100 dark:to-white">
                    Data & Insights
                  </span>
                </h1>

                <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  Search millions of ads with powerful filters, visual analytics
                  and AI tools
                </p>

                {/* 🎨 Decorative line */}
                <div className="decorative-line-container">
                  <div className="decorative-line" />
                  <div className="decorative-line-glow" />
                </div>

                {/* 🏆 Feature highlights */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <FeatureHighlight
                    icon={Filter}
                    label="Filters"
                    color="text-[#6566F1]"
                  />
                  <FeatureHighlight
                    icon={BarChart}
                    label="Analytics"
                    color="text-[#B977F8]"
                  />
                  <FeatureHighlight
                    icon={TrendingUp}
                    label="Trends"
                    color="text-[#E9A8F2]"
                  />
                  <FeatureHighlight
                    icon={PieChart}
                    label="Charts"
                    color="text-[#6566F1]"
                  />
                  <FeatureHighlight
                    icon={BrainCircuit}
                    label="AI Tools"
                    color="text-[#B977F8]"
                  />
                  <FeatureHighlight
                    icon={Download}
                    label="Media"
                    color="text-[#6566F1]"
                  />
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900" />
          </div>
        </FirefliesWrapper>
      </div>

      <SearchFilters onSearch={executeSearch} isLoading={state.isLoading} />
      <SearchResults
        isLoading={state.isLoading}
        error={state.error}
        totalCount={state.totalCount}
        searchResults={state.results}
        hasNextPage={state.hasNextPage}
        remainingCount={state.remainingCount}
        handleLoadMore={handleLoadMore}
      />

      {/* 🎨 CSS Animations replacing Framer Motion */}
      <style jsx>{`
        .header-section {
          animation: fadeInUp 0.6s ease-out;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .facebook-icon-wrapper {
          display: inline-block;
          transition: transform 0.3s ease;
        }

        .facebook-icon-wrapper:hover {
          transform: scale(1.1);
        }

        .decorative-line-container {
          position: relative;
          padding-top: 1rem;
        }

        .decorative-line {
          height: 4px;
          width: 6rem;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            rgba(101, 102, 241, 0.4),
            rgba(185, 119, 248, 0.4)
          );
          transition: all 0.5s ease-in-out;
        }

        .group:hover .decorative-line {
          width: 8rem;
          background: linear-gradient(
            to right,
            rgba(101, 102, 241, 0.6),
            rgba(185, 119, 248, 0.6)
          );
        }

        .decorative-line-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(101, 102, 241, 0.2),
            rgba(185, 119, 248, 0.2)
          );
          filter: blur(12px);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 🚀 Performance optimizations */
        .header-section {
          will-change: transform;
          transform: translateZ(0);
        }

        .facebook-icon-wrapper {
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
};

/**
 * 🎯 Main AdBrowser component with context provider
 */
export const AdBrowser = () => {
  return (
    <SearchFilterProvider>
      <AdBrowserContent />
    </SearchFilterProvider>
  );
};

export default AdBrowser;

"use client";

import type React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  BarChart,
  CheckCircle,
  ChevronDown,
  Download,
  Filter,
  Globe,
  Languages,
  Search,
  Zap,
} from "lucide-react";
import { Virtuoso } from "react-virtuoso";

import type { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";

import { AdCard } from "../AdCard";
import { SearchParams } from "../search/filter-config";
import { Loading } from "./Loading";

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  searchResults: AdData[] | null;
  hasNextPage: boolean;
  remainingCount: number | null;
  handleLoadMore: () => void;
  // 🎯  Search params for synchronization
  searchParams?: SearchParams;
  // 🎯  Callback when sync issues detected
  onSyncIssue?: (issue: string) => void;
}

// 🎯 Search params synchronization hook - SILENT MODE
const useSearchSync = (
  searchParams?: SearchParams,
  searchResults?: AdData[] | null,
  onSyncIssue?: (issue: string) => void,
) => {
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "out-of-sync" | "unknown"
  >("unknown");
  const lastSearchParamsRef = useRef<SearchParams | undefined>();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!searchParams || !searchResults) {
      setSyncStatus("unknown");
      return;
    }

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      lastSearchParamsRef.current = searchParams;
      setSyncStatus("synced");
      return;
    }

    const paramsChanged =
      JSON.stringify(lastSearchParamsRef.current) !==
      JSON.stringify(searchParams);

    if (paramsChanged && searchResults.length > 0) {
      setSyncStatus("out-of-sync");
      console.debug(
        "🔄 Filter-Data sync: Parameters changed, results updating...",
      );
    } else {
      setSyncStatus("synced");
    }

    lastSearchParamsRef.current = searchParams;
  }, [searchParams, searchResults, onSyncIssue]);

  return syncStatus;
};

const FeaturePill = memo(
  ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="flex transform items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-700">
      <Icon className="h-4 w-4 text-purple-500" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  ),
);
FeaturePill.displayName = "FeaturePill";

const InitialState = memo(() => (
  <div className="mx-auto max-w-7xl animate-fade-in rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
    <div className="flex flex-col items-center gap-8 md:flex-row">
      <div className="flex-1">
        <Image
          src="/search-illustration.svg"
          alt="Search ads"
          width={400}
          height={300}
          priority
          loading="eager"
        />
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Discover High-Performing Ads
        </h2>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          Search across millions of ads with our powerful filters to find
          winning creatives, analyze performance, and get inspiration.
        </p>
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
            <Zap className="h-5 w-5" />
            Quick Start Tips
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
              Try broad searches first, then refine with filters
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
              Use the AI Creative Generator for multilingual variations
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
              Save interesting ads to your boards for later reference
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-3">
          <FeaturePill icon={Filter} text="10+ Filter Types" />
          <FeaturePill icon={BarChart} text="Performance Analytics" />
          <FeaturePill icon={Globe} text="Global Coverage" />
          <FeaturePill icon={Download} text="Media Download" />
        </div>
      </div>
    </div>
  </div>
));
InitialState.displayName = "InitialState";

const EmptyState = memo(
  ({ onResetFilters }: { onResetFilters?: () => void }) => (
    <div className="mx-auto max-w-7xl animate-fade-in rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
      <div className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/no-results.svg"
          alt="No results found"
          width={300}
          height={200}
          loading="lazy"
        />
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            No Ads Found
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Your search didn&apos;t match any ads. Try adjusting your filters or
            searching with different criteria.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <FeaturePill icon={Filter} text="Try fewer filters" />
            <FeaturePill icon={Search} text="Broader search terms" />
            <FeaturePill icon={Globe} text="Different countries" />
            <FeaturePill icon={Languages} text="Other languages" />
          </div>
          {onResetFilters && (
            <Button
              variant="outline"
              className="mt-4 rounded-full border-purple-500 bg-transparent text-purple-600 transition-all duration-150 hover:-translate-y-0.5 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-gray-700"
              onClick={onResetFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

// 🧠 Hook to determine column count based on responsive breakpoints
const useResponsiveColumnCount = () => {
  const getColumnCount = useCallback(() => {
    if (typeof window === "undefined") return 4; // Default for SSR
    if (window.innerWidth >= 1280) return 5; // xl from original CSS
    if (window.innerWidth >= 1024) return 4; // lg
    if (window.innerWidth >= 768) return 3; // md
    if (window.innerWidth >= 640) return 2; // sm
    return 1;
  }, []);

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getColumnCount]);

  return columnCount;
};

// 🧠 NEW: Virtualized grid component using React Virtuoso
const VirtuosoResultsGrid = memo(
  ({ searchResults }: { searchResults: AdData[] }) => {
    const columnCount = useResponsiveColumnCount();

    // Partition data into columns to ensure unique ads per column
    const columnsData = useMemo(() => {
      const columns: AdData[][] = Array.from({ length: columnCount }, () => []);
      searchResults.forEach((ad, index) => {
        columns[index % columnCount].push(ad);
      });
      return columns;
    }, [searchResults, columnCount]);

    return (
      <div className="flex gap-4 p-4">
        {columnsData.map((ads, colIndex) => (
          <div key={colIndex} style={{ flex: 1, minWidth: 0 }}>
            <Virtuoso
              useWindowScroll // Use the main window scrollbar for a seamless UX
              data={ads}
              itemContent={(_index, ad) => (
                // Add padding for vertical spacing between cards
                <div className="pb-4">
                  <AdCard ad={ad} />
                </div>
              )}
            />
          </div>
        ))}
      </div>
    );
  },
);
VirtuosoResultsGrid.displayName = "VirtuosoResultsGrid";

// 🚀 Main SearchResults component (VirtuosoResultsGrid)
export const SearchResults = memo(
  ({
    isLoading,
    error,
    totalCount,
    searchResults,
    hasNextPage,
    remainingCount,
    handleLoadMore,
    searchParams,
    onSyncIssue,
  }: SearchResultsProps) => {
    useSearchSync(searchParams, searchResults, onSyncIssue);

    const showInitialState = useMemo(
      () => !isLoading && searchResults === null,
      [isLoading, searchResults],
    );

    const showEmptyState = useMemo(
      () => !isLoading && searchResults?.length === 0,
      [isLoading, searchResults],
    );

    const showResults = useMemo(
      () => Boolean(searchResults?.length),
      [searchResults],
    );

    const formattedTotalCount = useMemo(() => {
      if (totalCount === null) return null;
      return totalCount > 50000 ? "50,000+" : totalCount.toLocaleString();
    }, [totalCount]);

    // 💡 Memoize the callback to prevent EmptyState from re-rendering unnecessarily.
    const handleResetFilters = useCallback(() => {
      console.log("Reset filters clicked");
      // This function now has a stable reference across renders.
    }, []);

    // ✅ Memoized 'Load More' section
    const loadMoreSection = useMemo(() => {
      return (
        <div className="flex justify-center">
          {hasNextPage ? (
            isLoading ? (
              <Loading size="small" />
            ) : (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 px-6 py-3 font-bold text-purple-800 shadow-md transition-all duration-200 hover:scale-105 hover:from-purple-300 hover:to-pink-300 disabled:opacity-50"
              >
                <ChevronDown className="h-5 w-5" />
                Load More +{remainingCount?.toLocaleString() || "0"} left
              </button>
            )
          ) : (
            <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-md">
              <CheckCircle className="mr-2 h-6 w-6" />
              <span>End of Results</span>
            </div>
          )}
        </div>
      );
    }, [hasNextPage, isLoading, handleLoadMore, remainingCount]);

    return (
      <div className="mx-auto min-h-[50vh] w-full">
        {isLoading && !showResults && <Loading size="large" />}

        {error && (
          <div
            className="animate-slide-in mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}

        {showInitialState && <InitialState />}
        {showEmptyState && <EmptyState onResetFilters={handleResetFilters} />}

        {showResults && formattedTotalCount && (
          <div className="animate-slide-down mb-4 text-center">
            {isLoading ? (
              <Loading size="medium" />
            ) : (
              <span
                className="inline-block rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 text-lg font-bold text-purple-700 shadow-lg dark:from-purple-900/50 dark:to-pink-900/50 dark:text-purple-300"
                aria-live="polite"
              >
                {formattedTotalCount} ads found
              </span>
            )}
          </div>
        )}

        {/* ✅ Results section uses VirtuosoResultsGrid */}
        {showResults && searchResults && (
          <>
            <div className="relative min-h-[50vh] animate-fade-in">
              <VirtuosoResultsGrid searchResults={searchResults} />
            </div>
            {/* 🎯 Load More Section */}
            {loadMoreSection}
          </>
        )}

        <style jsx>{`
          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translate3d(-20px, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translate3d(0, -20px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translate3d(0, 20px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-slide-in,
            .animate-slide-down,
            .animate-fade-in {
              animation: none;
            }
            * {
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    );
  },
);
SearchResults.displayName = "SearchResults";

export default SearchResults;

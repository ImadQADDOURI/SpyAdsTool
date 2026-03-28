"use client";

import type React from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
// import { SearchParams } from "../search/filter-config";
import SubscriptionAccessGuard from "../subscription/SubscriptionAccessGuard";
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
  // searchParams?: SearchParams;
  // 🎯  Callback when sync issues detected
  onSyncIssue?: (issue: string) => void;
}

// Helper hook to determine the number of columns based on screen width.
// This makes the grid responsive.
const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(4); // Default to 4 columns

  useEffect(() => {
    const getColumns = (width: number) => {
      if (width < 700) return 1; // sm
      if (width < 1000) return 2; // md
      if (width < 1200) return 3; // lg
      if (width < 1600) return 4; // 2xl
      return 5; // >2xl
    };

    const handleResize = () => {
      setColumns(getColumns(window.innerWidth));
    };

    // Check if window is defined (for server-side rendering)
    if (typeof window !== "undefined") {
      handleResize(); // Set initial column count
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return columns;
};

// All the static components like InitialState, EmptyState, and FeaturePill remain the same.
// They are memoized to prevent unnecessary re-renders.

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

// Main SearchResults Component
export const SearchResults = memo(
  ({
    isLoading,
    error,
    totalCount,
    searchResults,
    hasNextPage,
    remainingCount,
    handleLoadMore,
    // searchParams and onSyncIssue are kept for potential future use or other logic
    // searchParams,
    onSyncIssue,
  }: SearchResultsProps) => {
    const columns = useResponsiveColumns();

    // Memoize the chunking of search results into rows for Virtuoso.
    // This is the core logic for creating the grid structure.
    const rows = useMemo(() => {
      if (!searchResults) return [];
      // ✅ FIX: Explicitly type newRows as an array of AdData arrays.
      const newRows: AdData[][] = [];
      for (let i = 0; i < searchResults.length; i += columns) {
        newRows.push(searchResults.slice(i, i + columns));
      }
      return newRows;
    }, [searchResults, columns]);

    const showInitialState = !isLoading && searchResults === null;
    const showEmptyState = !isLoading && searchResults?.length === 0;
    const showResults = Boolean(searchResults?.length);

    const formattedTotalCount = useMemo(() => {
      if (totalCount === null) return null;
      return totalCount > 50000 ? "50,000+" : totalCount?.toLocaleString();
    }, [totalCount]);

    // 💡 Memoize the callback to prevent EmptyState from re-rendering unnecessarily.
    const handleResetFilters = useCallback(() => {
      console.log("Reset filters clicked");
    }, []);

    // The Footer component for Virtuoso, which contains the "Load More" button.
    const Footer = useCallback(() => {
      return (
        <div className="mt-2 flex justify-center">
          <SubscriptionAccessGuard>
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
          </SubscriptionAccessGuard>
        </div>
      );
    }, [hasNextPage, isLoading, handleLoadMore, remainingCount, showResults]);

    // This function renders each row in the Virtuoso list.
    const renderRow = useCallback(
      (index: number, row: AdData[]) => {
        return (
          <div className="flex justify-center gap-4 px-4 pb-4" key={index}>
            {row.map((ad, adIndex) => {
              // Calculate global index across all ads (not just in current row)
              const globalIndex = index * columns + adIndex;
              // Show first ad normally, protect every second ad (even indices after 0)
              const shouldProtect = globalIndex > 0 && globalIndex % 2 === 1;

              return (
                <div key={ad.ad_archive_id} className="min-w-0 flex-1">
                  {shouldProtect ? (
                    <SubscriptionAccessGuard hideContent showIcon>
                      <AdCard ad={ad} />
                    </SubscriptionAccessGuard>
                  ) : (
                    <AdCard ad={ad} />
                  )}
                </div>
              );
            })}
            {/* Add placeholder divs to ensure the last row items align correctly */}
            {Array.from({ length: columns - row.length }).map((_, i) => (
              <div key={`placeholder-${i}`} className="min-w-0 flex-1" />
            ))}
          </div>
        );
      },
      [columns],
    );

    return (
      <div className="mx-auto w-full">
        {/* ✅ global style for smooth scrolling */}
        <style jsx global>{`
          html {
            scroll-behavior: smooth;
          }
        `}</style>

        {isLoading && !showResults && <Loading size="large" />}

        {error && (
          <div
            className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}

        {showInitialState && <InitialState />}
        {showEmptyState && <EmptyState onResetFilters={handleResetFilters} />}

        {showResults && formattedTotalCount && (
          <div className="mb-4 text-center">
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

        {/* ✅ React Virtuoso Implementation */}
        {showResults && (
          <Virtuoso
            useWindowScroll
            data={rows}
            itemContent={renderRow}
            components={{ Footer }}
            overscan={200}
          />
        )}
      </div>
    );
  },
);

SearchResults.displayName = "SearchResults";

export default SearchResults;

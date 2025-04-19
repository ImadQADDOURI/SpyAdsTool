import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BarChart,
  Download,
  Filter,
  Globe,
  Languages,
  Loader2,
  Save,
  Search,
  Zap,
} from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";

import { AdCardGrid } from "./AdCardGrid";
import { Loading } from "./Loading";
import LoadingTrigger from "./LoadingTrigger";

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  totalCount: number | null;
  searchResults: AdData[] | null;
  hasNextPage: boolean;
  remainingCount: number | null;
  handleLoadMore: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  isLoading,
  error,
  totalCount,
  searchResults,
  hasNextPage,
  remainingCount,
  handleLoadMore,
}) => {
  const showInitialState = !isLoading && searchResults === null;
  const showEmptyState = !isLoading && searchResults?.length === 0;

  const FeaturePill = ({
    icon: Icon,
    text,
  }: {
    icon: React.ElementType;
    text: string;
  }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm dark:bg-gray-700"
    >
      <Icon className="h-4 w-4 text-purple-500" />
      <span className="text-sm font-medium">{text}</span>
    </motion.div>
  );

  return (
    <div className="mx-auto w-full">
      {/* Initial Loading indicator */}
      {isLoading && <Loading size="large" />}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100"
          role="alert"
        >
          {error}
        </motion.div>
      )}

      {/* Initial State - Before any search */}
      {showInitialState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
        >
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-1">
              <Image
                src="/search-illustration.svg"
                alt="Search ads"
                width={400}
                height={300}
                className="mx-auto"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Discover High-Performing Ads
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Search across millions of ads with our powerful filters to find
                winning creatives, analyze performance, and get inspiration.
              </p>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
                  <Zap className="h-5 w-5" />
                  Quick Start Tips
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-500"></span>
                    Try broad searches first, then refine with filters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-500"></span>
                    Use the AI Creative Generator for multilingual variations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-purple-500"></span>
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
        </motion.div>
      )}

      {/* Empty State - No results found */}
      {showEmptyState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
        >
          <div className="flex flex-col items-center gap-8 text-center">
            <Image
              src="/no-results.svg"
              alt="No results found"
              width={300}
              height={200}
            />
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                No Ads Found
              </h2>
              <p className="mx-auto max-w-lg text-lg text-gray-600 dark:text-gray-300">
                Your search didn&apos;t match any ads. Try adjusting your
                filters or searching with different criteria.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <FeaturePill icon={Filter} text="Try fewer filters" />
                <FeaturePill icon={Search} text="Broader search terms" />
                <FeaturePill icon={Globe} text="Different countries" />
                <FeaturePill icon={Languages} text="Other languages" />
              </div>

              <Button
                variant="outline"
                className="mt-4 rounded-full border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-gray-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      {totalCount !== null && searchResults && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span
            className="inline-block rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 text-lg font-bold text-purple-800 shadow-md dark:from-purple-900 dark:to-pink-900 dark:text-purple-200"
            aria-live="polite"
          >
            {totalCount > 50000 ? "50,000+" : totalCount.toLocaleString()} ads
            found
          </span>
        </motion.div>
      )}

      {/* Ads Grid */}
      {searchResults && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 p-4"
        >
          <AdCardGrid ads={searchResults} />

          {hasNextPage && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingTrigger
                onIntersect={handleLoadMore}
                isLoading={isLoading}
                triggerMargin={1}
              />

              {remainingCount !== null && !isLoading && (
                <p
                  className="rounded-full bg-purple-100 px-4 py-2 text-lg font-semibold text-purple-600 shadow-md dark:bg-purple-900 dark:text-purple-200"
                  aria-live="polite"
                >
                  {remainingCount.toLocaleString()} more ads available
                </p>
              )}

              {!isLoading && (
                <Button
                  onClick={handleLoadMore}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Load More Ads
                </Button>
              )}

              {/* Loading More indicator */}
              {isLoading && <Loading size="large" message="" />}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;

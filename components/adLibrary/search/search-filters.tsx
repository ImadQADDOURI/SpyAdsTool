"use client";

import { useCallback, useEffect, useState } from "react";
import { addDays, isAfter } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getNonSearchFilters, getSearchFilter } from "./filter-config";
import { useSearchFilters } from "./search-filter-context";
import { SearchFilterItem } from "./search-filter-item";

interface SearchFiltersProps {
  onSearch: () => void;
  isLoading: boolean;
}

export default function SearchFilters({
  onSearch,
  isLoading,
}: SearchFiltersProps) {
  const { getValue, clearAllValues, subscribeToCount } = useSearchFilters();

  // Local UI state
  const [areFiltersExpanded, setAreFiltersExpanded] = useState(true);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  // Subscribe to filter count changes
  useEffect(() => {
    const unsubscribe = subscribeToCount(setAppliedFiltersCount);
    return unsubscribe;
  }, [subscribeToCount]);

  // Get filter configurations (computed once)
  const searchFilter = getSearchFilter();
  const nonSearchFilters = getNonSearchFilters();

  const handleSearch = useCallback(() => {
    const startDate = getValue("startDate");
    const endDate = getValue("endDate");

    // Validate date inputs
    if (startDate && isAfter(new Date(startDate), new Date())) {
      toast.warning("Start date cannot be in the future");
      return;
    }

    if (endDate && isAfter(new Date(endDate), new Date())) {
      toast.warning("End date cannot be in the future");
      return;
    }

    if (
      startDate &&
      endDate &&
      isAfter(new Date(startDate), addDays(new Date(endDate), 0))
    ) {
      toast.warning("Start date must be before end date");
      return;
    }

    toast.success("Search executed successfully");
    onSearch();
  }, [getValue, onSearch]);

  const handleClearAllFilters = useCallback(() => {
    clearAllValues();
    toast.success("All filters cleared");
  }, [clearAllValues]);

  const toggleFiltersExpanded = useCallback(() => {
    setAreFiltersExpanded((prev) => !prev);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="z-40 w-full border-b border-purple-200/50 bg-white/95 backdrop-blur-sm dark:border-purple-900/30 dark:bg-gray-900/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
            {/* Search Input */}
            <div className="min-w-0 flex-1">
              {searchFilter && (
                <SearchFilterItem
                  filter={searchFilter}
                  onEnterPress={handleSearch}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                variant="outline"
                onClick={toggleFiltersExpanded}
                className={cn(
                  "border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/30",
                  areFiltersExpanded &&
                    "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30",
                )}
                aria-expanded={areFiltersExpanded}
                aria-controls="advanced-filters"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {appliedFiltersCount > 0 && (
                  <span className="ml-2 rounded-full bg-purple-500 px-2 py-0.5 text-xs font-medium text-white">
                    {appliedFiltersCount}
                  </span>
                )}
                {areFiltersExpanded ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
                {isLoading && (
                  <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div
        id="advanced-filters"
        className={cn(
          "w-full overflow-hidden transition-all duration-300 ease-in-out",
          areFiltersExpanded
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        <Card className="mt-4 w-full overflow-hidden rounded-xl border-purple-200/50 bg-white/90 backdrop-blur-sm dark:border-purple-900/30 dark:bg-gray-900/50">
          <CardContent className="p-5">
            {/* Filter Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                  <SlidersHorizontal className="h-5 w-5 text-purple-500" />
                </div>
                <h2 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                  Advanced Filters
                </h2>
                {appliedFiltersCount > 0 && (
                  <span className="ml-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    {appliedFiltersCount} active
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleClearAllFilters}
                disabled={isLoading || appliedFiltersCount === 0}
                className={cn(
                  "border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/30",
                  appliedFiltersCount === 0 && "opacity-50",
                )}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
              {nonSearchFilters.map((filter) => (
                <SearchFilterItem key={filter.key} filter={filter} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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

import { useNavbarVisibility } from "../navbar/navbar-visibility-context";
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

  // Navbar visibility from context
  const { visible } = useNavbarVisibility();

  // Subscribe to filter count changes
  useEffect(() => {
    const unsubscribe = subscribeToCount(setAppliedFiltersCount);
    return unsubscribe;
  }, [subscribeToCount]);

  // Get filter configurations
  const searchFilter = getSearchFilter();
  const nonSearchFilters = getNonSearchFilters();

  const handleSearch = useCallback(() => {
    // collapse filters after search
    setAreFiltersExpanded(false);

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

    // Scroll to top after search
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [getValue, onSearch]);

  const handleClearAllFilters = useCallback(() => {
    clearAllValues();
    toast.success("All filters cleared");
  }, [clearAllValues]);

  const toggleFiltersExpanded = useCallback(() => {
    setAreFiltersExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4",
        "sticky z-40",
        visible ? "top-[66px]" : "top-[2px]",
      )}
    >
      {/* Main Container */}
      <div className="overflow-hidden rounded-2xl border border-blue-200/60 bg-white/90 shadow-sm shadow-blue-100/50 dark:border-blue-800/40 dark:bg-gray-950/90 dark:shadow-blue-900/20">
        {/* Top Section - Search Bar */}
        <div className="px-2 py-2">
          <div className="flex gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="min-w-0 flex-1">
              {searchFilter && (
                <SearchFilterItem
                  filter={searchFilter}
                  onEnterPress={handleSearch}
                  disabled={isLoading} // disabled when isLoading is true
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                variant="outline"
                onClick={toggleFiltersExpanded}
                size="sm"
                className={cn(
                  "h-9 border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/30",
                  areFiltersExpanded &&
                    "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30",
                )}
                aria-expanded={areFiltersExpanded}
                aria-controls="advanced-filters"
              >
                <Filter className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Filters</span>
                {appliedFiltersCount > 0 && (
                  <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
                    {appliedFiltersCount}
                  </span>
                )}
                {areFiltersExpanded ? (
                  <ChevronUp className="ml-1.5 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1.5 h-4 w-4" />
                )}
              </Button>
              {/* from-[#8b5cf6] via-[#3b82f6] via-[#ec4899] to-[#06b6d4]
              ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]
              */}
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                size="sm"
                className="h-9 bg-gradient-to-r from-[#01bbfc] to-[#8b5cf6] text-white hover:brightness-110 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white sm:mr-1.5" />
                ) : (
                  <Search className="h-4 w-4 sm:mr-1.5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div
          className={cn(
            "transition-opacity duration-300",
            areFiltersExpanded ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-blue-700/50" />
        </div>

        {/* Bottom Section - Advanced Filters */}
        <div
          id="advanced-filters"
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            areFiltersExpanded
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          <div className="px-4 py-4">
            {/* Filter Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                  <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-lg font-semibold text-transparent dark:from-blue-400 dark:to-purple-400">
                  Advanced Filters
                </h2>
                {appliedFiltersCount > 0 && (
                  <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-2 py-0.5 text-xs font-medium text-white">
                    {appliedFiltersCount}{" "}
                    <span className="hidden sm:inline">active</span>
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleClearAllFilters}
                disabled={isLoading || appliedFiltersCount === 0}
                size="sm"
                className={cn(
                  "h-8 border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:border-blue-600 dark:hover:bg-blue-900/30",
                  appliedFiltersCount === 0 && "opacity-40",
                )}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear All
              </Button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
              {nonSearchFilters.map((filter) => (
                <SearchFilterItem key={filter.key} filter={filter} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

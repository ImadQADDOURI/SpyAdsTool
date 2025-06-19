"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addDays, format, isAfter } from "date-fns";
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

import {
  filterConfig,
  getNonSearchFilters,
  getSearchFilter,
} from "./filter-config";
import { SearchFilterItem } from "./search-filter-item";

// 📅 Constants for date validation
const MIN_DATE = "2018-05-07";
const TODAY = format(new Date(), "yyyy-MM-dd");

interface SearchFiltersProps {
  onSearch: () => void; // Callback to trigger search in parent component (*after* URL update)
  isLoading: boolean; // Loading state from parent
}

export default function SearchFilters({
  onSearch,
  isLoading,
}: SearchFiltersProps) {
  // 🧭 Navigation hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🎛️ Component state
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // 🔄 Refs for URL update tracking
  const urlUpdateComplete = useRef(false);

  // 🔄 State to track if we're currently updating the URL
  const isUpdatingUrl = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Get search and non-search filters
  const searchFilter = getSearchFilter();
  const nonSearchFilters = getNonSearchFilters();

  // 🧮 Count of applied filters (excluding search query)
  const appliedFiltersCount = Object.entries(filters).filter(
    ([key, value]) =>
      key !== "q" &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== ""),
  ).length;

  // 📥 Initialize filters from URL
  useEffect(() => {
    // 🛑 Skip if we're currently updating the URL ourselves
    if (isUpdatingUrl.current) return;

    const newFilters: Record<string, any> = {};

    // 🔄 Sync each filter with URL params
    filterConfig.forEach((filter) => {
      const paramValue = searchParams.get(filter.paramKey);

      if (paramValue) {
        if (filter.multiSelect) {
          // 🔀 Handle multi-select values (comma-separated)
          newFilters[filter.key] = paramValue.split(",");
        } else {
          // 🔤 Handle single-select values
          newFilters[filter.key] = paramValue;
        }
      } else {
        // 🚫 No value in URL, set to null
        newFilters[filter.key] = null;
      }
    });

    setFilters(newFilters);

    // ✅ If URL update was triggered by us and is now complete, trigger search
    if (urlUpdateComplete.current) {
      urlUpdateComplete.current = false;
      onSearch();
    }
  }, [searchParams, onSearch]);

  // 🔄 Handle filter change
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 🧹 Handle clearing a single filter
  const handleClearFilter = useCallback((key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: null,
    }));
  }, []);

  // 🧹 Handle clearing all filters
  const handleClearAllFilters = useCallback(() => {
    // 🧹 Clear filter state
    setFilters({});

    // 🧭 Create new URLSearchParams with existing params
    const newParams = new URLSearchParams(searchParams.toString());

    // 🧹 Remove only our filter params
    filterConfig.forEach((filter) => {
      newParams.delete(filter.paramKey);
    });

    // 🚩 Set flag to indicate we're updating the URL
    isUpdatingUrl.current = true;

    // 🧭 Update URL preserving other params
    const newUrl = newParams.toString()
      ? `${pathname}?${newParams.toString()}`
      : pathname;
    router.push(newUrl);

    // ⏱️ Reset updating flag after a short delay
    setTimeout(() => {
      isUpdatingUrl.current = false;
    }, 100);

    toast.success("All filters have been cleared");
  }, [pathname, router, searchParams]);

  // ✅ Handle applying filters
  const handleApplyFilters = useCallback(() => {
    // 📅 Validate dates if present
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    // 📅 Date validation
    if (startDate && isAfter(startDate, new Date())) {
      toast.warning("Start date cannot be in the future");
      return;
    }

    if (endDate && isAfter(endDate, new Date())) {
      toast.warning("End date cannot be in the future");
      return;
    }

    if (
      startDate &&
      endDate &&
      isAfter(startDate, addDays(new Date(endDate), 0))
    ) {
      toast.warning("Start date must be before end date");
      return;
    }

    // 🔄 Create new URLSearchParams
    const newParams = new URLSearchParams(searchParams.toString());

    // 🧹 Remove existing filter params
    filterConfig.forEach((filter) => {
      newParams.delete(filter.paramKey);
    });

    // 📝 Add filters with values
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        return;
      }

      // 🔍 Find the corresponding filter config
      const filterDef = filterConfig.find((f) => f.key === key);
      if (!filterDef) return;
      // 🔀 Handle multi-select values
      if (Array.isArray(value)) {
        newParams.set(filterDef.paramKey, value.join(","));
      } else {
        // 🔤 Handle single values
        newParams.set(filterDef.paramKey, value);
      }
    });

    // 🧭 Update URL
    const newUrl = newParams.toString()
      ? `${pathname}?${newParams.toString()}`
      : pathname;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // If URL hasn't changed, trigger search directly; otherwise, update the URL
    if (newUrl === currentUrl) {
      toast("Search executed successfully");
      onSearch();
    } else {
      // 🚩 Set flag to indicate we're updating the URL
      isUpdatingUrl.current = true;
      urlUpdateComplete.current = true;
      router.push(newUrl);
      toast("Search executed successfully");
      setTimeout(() => {
        isUpdatingUrl.current = false;
      }, 100);
    }
  }, [filters, pathname, router, searchParams, onSearch]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* 📌 Sticky Header */}
      <div
        ref={headerRef}
        className={cn(
          "z-40 w-full border-b border-purple-200/50 bg-white/95 backdrop-blur-sm transition-all duration-300 dark:border-purple-900/30 dark:bg-gray-900/95",
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
            {/* 🔍 Main Search Input */}
            <div className="min-w-0 flex-1">
              {searchFilter && (
                <SearchFilterItem
                  key={searchFilter.key}
                  filter={searchFilter}
                  value={filters[searchFilter.key] || null}
                  onChange={(value) =>
                    handleFilterChange(searchFilter.key, value)
                  }
                  onClear={() => handleClearFilter(searchFilter.key)}
                />
              )}
            </div>

            {/* 🎛️ Action Buttons */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className={cn(
                  "border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/30",
                  filtersExpanded &&
                    "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30",
                )}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {appliedFiltersCount > 0 && (
                  <span className="ml-2 rounded-full bg-purple-500 px-2 py-0.5 text-xs font-medium text-white">
                    {appliedFiltersCount}
                  </span>
                )}
                {filtersExpanded ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={handleApplyFilters}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:from-purple-700 dark:to-pink-700"
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

      {/* 🎛️ Collapsible Filters Grid */}
      <div
        className={cn(
          "w-full overflow-hidden transition-all duration-300 ease-in-out",
          filtersExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Card className="mt-4 w-full overflow-hidden rounded-xl border-purple-200/50 bg-white/90 backdrop-blur-sm dark:border-purple-900/30 dark:bg-gray-900/50">
          <CardContent className="p-5">
            {/* 🎛️ Filter header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                  <SlidersHorizontal className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                  Advanced Filters
                </h3>
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

            {/* 🎛️ Filter grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
              {nonSearchFilters.map((filter) => (
                <SearchFilterItem
                  key={filter.key}
                  filter={filter}
                  value={filters[filter.key] || null}
                  onChange={(value) => handleFilterChange(filter.key, value)}
                  onClear={() => handleClearFilter(filter.key)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

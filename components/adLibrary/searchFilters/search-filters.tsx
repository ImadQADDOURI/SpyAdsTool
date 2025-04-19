"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { Filter, SlidersHorizontal, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import FirefliesWrapper from "../microComponents/FirefliesWrapper";
import { filterConfig } from "./filter-config";
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

  // 🚩 Flag for URL update completion
  const urlUpdateComplete = useRef(false);

  // 🔄 State to track if we're currently updating the URL
  const isUpdatingUrl = useRef(false);

  // 🎛️ Filter state
  const [filters, setFilters] = useState<Record<string, any>>({});

  // 🧮 Count of applied filters
  const appliedFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== ""),
  ).length;

  // 📥 Initialize filters from URL on mount and when URL changes
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
        } else if (filter.key === "startDate" || filter.key === "endDate") {
          // 📅 Handle date values
          newFilters[filter.key] = paramValue;
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
    if (startDate) {
      // 🔍 Check if start date is in the future
      if (isAfter(startDate, new Date())) {
        toast.warning("Start date cannot be in the future");
        return;
      }

      // 🔍 Check if start date is after end date
      if (endDate && isAfter(startDate, addDays(new Date(endDate), 0))) {
        toast.warning("Start date must be before end date");
        return;
      }
    }

    if (endDate) {
      // 🔍 Check if end date is in the future
      if (isAfter(endDate, new Date())) {
        toast.warning("End date cannot be in the future");
        return;
      }

      // 🔍 Check if end date is before start date
      if (startDate && isBefore(endDate, startDate)) {
        toast.warning("End date must be after start date strictly >");
        return;
      }
    }

    // 🔄 Create new URLSearchParams with existing params to preserve them
    const newParams = new URLSearchParams(searchParams.toString());

    // 🧹 First remove our filter params to avoid duplicates
    filterConfig.forEach((filter) => {
      newParams.delete(filter.paramKey);
    });

    // 📝 Add each filter to params if it has a value
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        return;
      }

      // 🔍 Find the corresponding filter config
      const filterDef = filterConfig.find((f) => f.key === key);
      if (!filterDef) return;
      // 🔀 Handle multi-select values
      else if (Array.isArray(value)) {
        newParams.set(filterDef.paramKey, value.join(","));
      }
      // 🔤 Handle single values
      else {
        newParams.set(filterDef.paramKey, value);
      }
    });

    // 🧭 Construct new URL vs current URL derived from searchParams
    const newUrl = newParams.toString()
      ? `${pathname}?${newParams.toString()}`
      : pathname;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // If URL hasn't changed, trigger search directly; otherwise, update the URL
    if (newUrl === currentUrl) {
      toast("Filters applied successfully");
      onSearch();
    } else {
      // 🚩 Set flag to indicate we're updating the URL
      isUpdatingUrl.current = true;
      urlUpdateComplete.current = true;
      router.push(newUrl);
      toast("Filters applied successfully");
      setTimeout(() => {
        isUpdatingUrl.current = false;
      }, 100);
    }
  }, [filters, pathname, router, searchParams, onSearch]);

  return (
    <Card className="w-full overflow-hidden rounded-xl border-purple-200/50 bg-gray-50/90 backdrop-blur-sm transition-all dark:border-purple-900/30 dark:bg-gray-900/90">
      <CardContent className="p-6 backdrop-blur-sm">
        {/* 🎛️ Filter header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
              <SlidersHorizontal className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
              Filters
            </h3>
            {appliedFiltersCount > 0 && (
              <span className="ml-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white">
                {appliedFiltersCount} active
              </span>
            )}
          </div>
        </div>

        {/* 🎛️ Filter grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
          {filterConfig.map((filter) => (
            <SearchFilterItem
              key={filter.key}
              filter={filter}
              value={filters[filter.key] || null}
              onChange={(value) => handleFilterChange(filter.key, value)}
              onClear={() => handleClearFilter(filter.key)}
            />
          ))}
        </div>

        {/* 🔘 Action buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClearAllFilters}
            disabled={isLoading || appliedFiltersCount === 0}
            className={cn(
              "border-purple-200 transition-all hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/30",
              appliedFiltersCount === 0 && "opacity-50",
            )}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>

          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all hover:from-purple-600 hover:to-pink-600 dark:from-purple-700 dark:to-pink-700"
          >
            <span className="relative z-10 flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Apply Filters
              {isLoading && (
                <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
            </span>
            <span className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

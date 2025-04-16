// @/components/adLibrary/searchFilters/SearchBar.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DisplayFilters } from "@/components/adLibrary/searchFilters/DisplayFilters";
import { FilterPanel } from "@/components/adLibrary/searchFilters/FilterPanel";
import {
  SearchTypeKey,
  SearchTypeSelector,
} from "@/components/adLibrary/searchFilters/SearchTypeSelector";

interface SearchBarProps {
  onSearch: (useExistingParams?: boolean) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Initialize with URL param but don't sync afterward to allow user input
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchPending = useRef(false);

  // 🔡 Placeholder state for search input based on search type
  const [placeholder, setPlaceholder] = useState("Search ads...");

  const handleScroll = () => {
    if (ref.current) {
      setIsSticky(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Listen for URL changes and trigger search when needed
  useEffect(() => {
    // If we have a pending search request, execute it now that URL is updated
    if (searchPending.current) {
      searchPending.current = false;
      onSearch(false);
    }
  }, [searchParams, onSearch]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
  };

  // Execute search with URL param update
  const executeSearch = () => {
    if (isLoading) return;

    // Create a new URLSearchParams object to preserve all existing parameters
    const params = new URLSearchParams(searchParams.toString());

    // Only update the 'q' parameter
    params.set("q", searchQuery);

    // Set the pending flag so we know to trigger search after URL update
    searchPending.current = true;

    // Push the updated URL without scrolling
    router.push(`?${params.toString()}`, { scroll: false });

    // The actual search will be triggered by the useEffect that listens for searchParams changes
  };

  // 🔄 Handle search type changes - just updates the placeholder
  const handleSearchTypeChange = (
    _type: SearchTypeKey,
    newPlaceholder: string,
  ) => {
    setPlaceholder(newPlaceholder);
  };

  return (
    <div className="flex justify-center px-4 py-2" ref={ref}>
      <div
        className={`w-full max-w-[600px] transition-all duration-100 ${
          isSticky
            ? "fixed top-16 z-10 animate-in fade-in slide-in-from-top-4"
            : ""
        }`}
      >
        <div className="relative">
          <div className="absolute inset-0 -z-10 h-full w-full rounded-full backdrop-blur-xl">
            <div className="h-full w-full rounded-full bg-background/80" />
          </div>

          <div className="flex h-12 min-h-[48px] w-full items-center gap-1 rounded-full bg-gradient-to-r from-[#6566F1]/25 to-[#B977F8]/25 p-1.5 shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)] transition-all duration-300 ease-in-out hover:scale-[1.01] dark:bg-[#6566F1]/10 dark:shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)] sm:gap-2">
            {/* Search Type Selector */}
            <SearchTypeSelector
              onTypeChange={handleSearchTypeChange}
              disabled={isLoading}
            />

            {/* Search Input */}
            <div className="relative min-w-0 flex-1">
              <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => !isLoading && setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search ads"
                disabled={isLoading}
                className="h-9 w-full rounded-full border-0 bg-white/60 px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#6566F1] disabled:cursor-progress disabled:opacity-50 dark:bg-gray-900/60 dark:text-white dark:placeholder:text-gray-400"
              />

              {/* Clear search button */}
              {searchQuery && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/70"
                  onClick={resetSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Button */}
            <Button
              onClick={executeSearch}
              disabled={isLoading}
              size="icon"
              aria-label="Search"
              className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 disabled:opacity-50 dark:from-[#6566F1] dark:to-[#B977F8] dark:hover:brightness-105"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {/* Filter Panel and Display Filters */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <FilterPanel
                onSearch={onSearch}
                variant="button"
                isLoading={isLoading}
              />
              <DisplayFilters />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Loader2, Search, Settings, X } from "lucide-react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DisplayFilters } from "./DisplayFilters";
import FilterPanel from "./FilterPanel";

interface SearchBarProps {
  onSearch: (query?: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchQuery);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchQuery, router, searchParams]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex justify-center px-4 py-2" ref={ref}>
      <div
        className={`w-full max-w-[600px] transition-all duration-100 ${
          isSticky
            ? "fixed top-16 z-50 animate-in fade-in slide-in-from-top-4"
            : ""
        }`}
      >
        <div className="flex h-12 min-h-[48px] w-full items-center gap-2 rounded-full bg-gradient-to-r from-[#6566F1]/25 to-[#B977F8]/25 p-1.5 shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)] transition-all duration-300 ease-in-out hover:scale-[1.01] dark:from-gray-800/90 dark:to-gray-700/90 dark:shadow-[0_4px_20px_-4px_rgba(101,102,241,0.15)] sm:gap-3">
          {/* Search Input */}
          <div className="relative min-w-0 flex-1">
            <Input
              type="text"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Search ads"
              className="h-9 w-full rounded-full border-0 bg-white/60 px-4 text-[15px] font-medium text-gray-700 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#6566F1] dark:bg-gray-900/60 dark:text-white dark:placeholder:text-gray-400"
            />
            {searchQuery && (
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
            onClick={() => onSearch(searchQuery)}
            disabled={isLoading}
            size="icon"
            aria-label="Search"
            className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-white shadow-md transition-all hover:from-[#5455E0] hover:to-[#A866E7] hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          {/* Filter Panel and Display Filters */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <FilterPanel onSearch={onSearch} variant="button" />
            <DisplayFilters />
          </div>
        </div>
      </div>
    </div>
  );
};

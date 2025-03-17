import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterReset } from "@/utils/useFilterReset";
import { Filter, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Category from "./category";
import CategoryAsKeyword from "./categoryAsKeyword";
import Country from "./country";
import EndDate from "./endDate";
import Language from "./language";
import Media from "./media";
import NicheAsKeyword from "./nicheAsKeyword";
import Platform from "./platform";
import SearchType from "./SearchType";
import Sort from "./sort";
import StartDate from "./startDate";
import Status from "./status";

interface FilterPanelProps {
  onSearch: () => void;
  variant?: "button" | "full";
  isLoading: boolean;
}

type FilterComponentType = React.ComponentType<{
  value?: any;
  onChange?: (value: any) => void;
}>;

const filterComponents: {
  key: string;
  component: FilterComponentType;
  label: string;
  icon: string;
}[] = [
  // {
  //   key: "searchType",
  //   component: SearchType,
  //   label: "Search Type",
  //   icon: "/filters/search.svg",
  // },
  {
    key: "category",
    component: Category,
    label: "Type",
    icon: "/filters/search-demography.svg",
  },
  {
    key: "country",
    component: Country,
    label: "Country",
    icon: "/filters/location.svg",
  },
  // {
  //   key: "nicheAsKeyword",
  //   component: NicheAsKeyword,
  //   label: "Niche",
  //   icon: "/filters/target.svg",
  // },
  {
    key: "categoryAsKeyword",
    component: CategoryAsKeyword,
    label: "Category",
    icon: "/filters/category.svg",
  },

  {
    key: "language",
    component: Language,
    label: "Language",
    icon: "/filters/translate.svg",
  },
  {
    key: "media",
    component: Media,
    label: "Media",
    icon: "/filters/gallery.svg",
  },
  {
    key: "platform",
    component: Platform,
    label: "Platform",
    icon: "/filters/fb.svg",
  },
  {
    key: "status",
    component: Status,
    label: "Status",
    icon: "/filters/active.svg",
  },
  {
    key: "startDate",
    component: StartDate,
    label: "Start Date",
    icon: "/filters/clock-on.svg",
  },
  {
    key: "endDate",
    component: EndDate,
    label: "End Date",
    icon: "/filters/clock-off.svg",
  },
  // {
  //   key: "sort",
  //   component: Sort,
  //   label: "Sort",
  //   icon: "/filters/sort.svg",
  // },
];

const filterParams = [
  "ad_type",
  "category_as_keyword",
  "niche_as_keyword",
  "countries",
  "end_date",
  "content_languages",
  "media_type",
  "publisher_platforms",
  "sort_data",
  "start_date",
  "active_status",
  "search_type",
];

// 🎨 Shared filter card component for consistent styling
const FilterCard = React.memo(({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
    {children}
  </div>
));
FilterCard.displayName = "FilterCard";

// 🔍 Filter Header with consistent styling
const FilterHeader = React.memo(() => (
  <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
    Search Filters
  </h2>
));
FilterHeader.displayName = "FilterHeader";

// 🔘 Shared Filter Actions component
const FilterActions = React.memo(
  ({
    onClear,
    onApply,
    appliedFiltersCount,
    isLoading,
  }: {
    onClear: () => void;
    onApply: () => void;
    appliedFiltersCount: number;
    isLoading: boolean;
  }) => (
    <div className="flex justify-end space-x-3">
      <Button
        onClick={onClear}
        variant="outline"
        size="sm"
        disabled={isLoading}
        className="rounded-full px-4 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-progress dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Clear
      </Button>
      <Button
        onClick={onApply}
        size="sm"
        disabled={isLoading}
        className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-progress dark:focus:ring-offset-gray-800"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Apply
            {appliedFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 flex h-6 items-center rounded-full bg-white text-purple-600"
              >
                {appliedFiltersCount}
              </Badge>
            )}
          </>
        )}
      </Button>
    </div>
  ),
);
FilterActions.displayName = "FilterActions";

export const FilterPanel: React.FC<FilterPanelProps> = React.memo(
  ({ onSearch, variant = "button", isLoading }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [filterStates, setFilterStates] = useState<Record<string, any>>({});
    const { clearFilters } = useFilterReset(filterParams);

    // 🧮 Count applied filters
    const countAppliedFilters = useCallback(() => {
      const params = new URLSearchParams(searchParams.toString());
      return filterParams.filter((key) => params.has(key)).length;
    }, [searchParams]);

    // ✅ Apply filters and close dialog
    const applyFilters = useCallback(() => {
      onSearch();
      setIsOpen(false);
    }, [onSearch]);

    // 🗑️ Clear all filters
    const handleClearFilters = useCallback(() => {
      clearFilters();
      setFilterStates({});
      setIsOpen(false);
    }, [clearFilters]);

    // 🔄 Update filter state
    const updateFilterState = useCallback((key: string, value: any) => {
      setFilterStates((prev) => ({ ...prev, [key]: value }));
    }, []);

    // 🔴 Shared Badge component
    const FilterBadge = useMemo(() => {
      const BadgeComponent: React.FC<{ count: number }> = React.memo(
        ({ count }) =>
          count > 0 ? (
            <Badge
              variant="secondary"
              className="flex h-6 items-center rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-[10px] font-medium text-white"
            >
              {count}
            </Badge>
          ) : null,
      );
      BadgeComponent.displayName = "FilterBadge";
      return BadgeComponent;
    }, []);

    // 🔲 Shared Filter Trigger button
    const FilterTrigger = useMemo(() => {
      const TriggerComponent: React.FC = React.memo(() => {
        const filterCount = countAppliedFilters();
        return (
          <Button
            aria-label="Open Search Filters"
            className="relative h-9 rounded-full bg-white/70 px-2.5 text-gray-700 transition-all duration-300 hover:bg-white/90 hover:shadow-sm dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800/90"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-1">
              <Filter className="h-5 w-5" />
              <FilterBadge count={filterCount} />
            </div>
          </Button>
        );
      });
      TriggerComponent.displayName = "FilterTrigger";
      return TriggerComponent;
    }, [countAppliedFilters, FilterBadge]);

    // 📋 Shared Filter Content
    const FilterContent = useMemo(() => {
      // 🧩 Calculate exactly two rows of filters
      // const getGridColumns = () => {
      //   const totalFilters = filterComponents.length;
      //   return Math.ceil(totalFilters / 2); // Ensure we have exactly 2 rows
      // };

      // const columnsCount = getGridColumns();

      const ContentComponent: React.FC = React.memo(() => (
        // <div
        //   className={`grid sm:grid-cols-2 md:grid-cols-${columnsCount} gap-4`}
        //   style={{
        //     gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`,
        //     gridTemplateRows: "repeat(2, auto)",
        //   }}
        // >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
          {filterComponents.map(
            ({ key, component: Component, label, icon }) => (
              <div key={key} className="flex flex-col space-y-1">
                <label className="flex items-center text-xs font-medium text-gray-700 dark:text-gray-300">
                  <div className="relative mr-1.5 h-5 w-5">
                    <Image
                      src={icon}
                      alt={label}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  {label}
                </label>
                <Component
                  value={filterStates[key]}
                  onChange={(value: any) => updateFilterState(key, value)}
                />
              </div>
            ),
          )}
        </div>
      ));
      ContentComponent.displayName = "FilterContent";
      return ContentComponent;
    }, [filterStates, updateFilterState]);

    // 📱 Full variant (directly in page)
    if (variant === "full") {
      return (
        <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
          <FilterCard>
            <div className="flex items-center justify-between">
              <FilterHeader />
              <FilterTrigger />
            </div>
            <FilterContent />
            <div className="mt-3">
              <FilterActions
                onClear={handleClearFilters}
                onApply={applyFilters}
                appliedFiltersCount={countAppliedFilters()}
                isLoading={isLoading}
              />
            </div>
          </FilterCard>
        </div>
      );
    }

    // 🔘 Button variant (in dialog)
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <FilterTrigger />
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%]">
          <DialogHeader className="space-y-1 pb-2">
            <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
              Search Filters
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Refine your search with these filters
            </DialogDescription>
          </DialogHeader>
          <FilterContent />
          <div className="mt-3 pt-2">
            <FilterActions
              onClear={handleClearFilters}
              onApply={applyFilters}
              appliedFiltersCount={countAppliedFilters()}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

FilterPanel.displayName = "FilterPanel";

export default FilterPanel;

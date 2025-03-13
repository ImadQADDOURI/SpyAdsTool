import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterReset } from "@/utils/useFilterReset";
import { Filter } from "lucide-react";

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

const FilterActions: React.FC<{
  onClear: () => void;
  onApply: () => void;
  appliedFiltersCount: number;
}> = React.memo(({ onClear, onApply, appliedFiltersCount }) => (
  <div className="flex justify-end space-x-4">
    <Button
      onClick={onClear}
      variant="outline"
      className="rounded-full px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      Clear
    </Button>
    <Button
      onClick={onApply}
      className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
    >
      Apply Filters
      {appliedFiltersCount > 0 && (
        <Badge variant="secondary" className="ml-2 bg-white text-purple-600">
          {appliedFiltersCount}
        </Badge>
      )}
    </Button>
  </div>
));
FilterActions.displayName = "FilterActions";

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onSearch,
  variant = "button",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filterStates, setFilterStates] = useState<Record<string, any>>({});

  const { clearFilters } = useFilterReset(filterParams);

  const countAppliedFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    return filterParams.filter((key) => params.has(key)).length;
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    onSearch();
    setIsOpen(false);
  }, [onSearch]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setFilterStates({});
    setIsOpen(false);
  }, [clearFilters]);

  const updateFilterState = useCallback((key: string, value: any) => {
    setFilterStates((prev) => ({ ...prev, [key]: value }));
  }, []);

  const FilterTrigger = useMemo(() => {
    const TriggerComponent: React.FC = () => (
      <Button
        aria-label="Open Search Filters"
        className="relative h-9 rounded-full bg-white/60 px-3 text-gray-700 transition-all duration-300 hover:bg-white/80 hover:shadow-md dark:bg-gray-900/60 dark:text-gray-200 dark:hover:bg-gray-900/80"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {countAppliedFilters() > 0 && (
            <Badge
              variant="secondary"
              className="flex h-5 items-center rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-2 text-[12px] font-medium text-white"
            >
              {countAppliedFilters()}
            </Badge>
          )}
        </div>
      </Button>
    );
    TriggerComponent.displayName = "FilterTrigger";
    return TriggerComponent;
  }, [countAppliedFilters]);

  const FilterContent = useMemo(() => {
    const ContentComponent: React.FC = () => (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filterComponents.map(({ key, component: Component, label, icon }) => (
          <div key={key} className="flex flex-col space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="relative mr-2 h-6 w-6">
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
        ))}
      </div>
    );
    ContentComponent.displayName = "FilterContent";
    return ContentComponent;
  }, [filterStates, updateFilterState]);

  if (variant === "full") {
    return (
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
          <h2 className="mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
            Search Filters
          </h2>
          <FilterContent />
          <div className="mt-4">
            <FilterActions
              onClear={handleClearFilters}
              onApply={applyFilters}
              appliedFiltersCount={countAppliedFilters()}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FilterTrigger />
      </DialogTrigger>
      <DialogContent className="bg-gray-100/70 dark:bg-gray-800/70 sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
            Search Filters
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Refine your search with these filters
          </DialogDescription>
        </DialogHeader>

        <FilterContent />

        <div className="mt-4">
          <FilterActions
            onClear={handleClearFilters}
            onApply={applyFilters}
            appliedFiltersCount={countAppliedFilters()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

FilterPanel.displayName = "FilterPanel";
export default React.memo(FilterPanel);

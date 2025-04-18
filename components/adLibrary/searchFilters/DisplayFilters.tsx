// DisplayFilters.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterReset } from "@/utils/useFilterReset";
import { Settings } from "lucide-react";

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
import { Slider } from "@/components/ui/slider";

// ✨ Array of filter parameters
const filterParams = ["collationCount"];

export const DisplayFilters: React.FC = () => {
  // 🧭 Navigation and parameter handling
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  // 🔢 Get the current collation count from URL params, default to 1, and store it locally
  const initialCount = parseInt(searchParams.get("collationCount") || "1", 10);
  const [collationCount, setCollationCount] = React.useState(initialCount);

  // 🎚️ Update local state when slider value changes
  const handleCollationCountChange = (value: number[]) => {
    setCollationCount(value[0]);
  };

  // 🧮 Count the number of applied filters
  const countAppliedFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    return filterParams.filter((key) => params.has(key)).length;
  };

  // ✅ Apply filters with proper validation (updates URL once)
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("collationCount", collationCount.toString());

    router.push(`?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  // 🧹 Clear all filters
  const { clearFilters } = useFilterReset(filterParams);

  const handleClearFilters = () => {
    clearFilters();
    // Reset local state to default value if needed:
    setCollationCount(1);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Open Display Filters"
          className="relative h-9 rounded-full bg-white/60 px-2.5 text-gray-700 transition-all duration-300 hover:bg-white/80 hover:shadow-md dark:bg-gray-900/60 dark:text-gray-200 dark:hover:bg-gray-900/80"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {countAppliedFilters() > 0 && (
              <Badge
                variant="secondary"
                className="flex h-5 items-center rounded-full bg-gradient-to-r from-[#B977F8] to-[#6566F1] px-2 text-[12px] font-medium text-white"
              >
                {countAppliedFilters()}
              </Badge>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
            Display Filters
          </DialogTitle>
          <DialogDescription>
            Adjust the display filters to refine the results.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Total Ads</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {collationCount}+
            </span>
          </div>
          <Slider
            min={0}
            max={5}
            step={1}
            value={[collationCount]}
            onValueChange={handleCollationCountChange}
            className="w-full"
          />

          <div className="mt-8 flex w-full flex-row space-x-1">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-1/3 rounded-full border-2 border-gray-300 bg-transparent px-6 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="w-2/3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Apply Filters
              {countAppliedFilters() > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white text-purple-500"
                >
                  {countAppliedFilters()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

DisplayFilters.displayName = "DisplayFilters";

export default DisplayFilters;

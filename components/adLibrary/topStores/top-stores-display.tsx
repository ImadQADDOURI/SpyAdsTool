"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import type { TopStore } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUpRight,
  ChevronUp,
  Crosshair,
  DollarSign,
  ExternalLink,
  Filter,
  Globe,
  LocateFixed,
  Medal,
  Rocket,
  Search,
  ShoppingBag,
  Star,
  Store,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

import FirefliesWrapper from "../microComponents/FirefliesWrapper";
import { ScrollButtons } from "../microComponents/ScrollButtons";

interface TopStoresDisplayProps {
  stores: TopStore[];
  isLoading?: boolean;
}

// Sort options type
type SortOption = {
  label: string;
  value: keyof TopStore | "conversionRate" | "aov";
  icon: React.ReactNode;
  direction: "asc" | "desc";
};

// Scroll Buttons Component

// Store Card Skeleton Component
function StoreCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-xl border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <div className="mb-3 flex gap-1.5">
          <Skeleton className="h-5 w-7 rounded-sm" />
          <Skeleton className="h-5 w-7 rounded-sm" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="ml-auto h-3.5 w-14" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="ml-auto h-3.5 w-12" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="ml-auto h-3.5 w-14" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="ml-auto h-3.5 w-12" />
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50 p-3 dark:border-gray-800 dark:from-gray-900/50 dark:to-gray-800/50">
        <Skeleton className="h-8 w-full rounded-full" />
      </CardFooter>
    </Card>
  );
}

export function TopStoresDisplay({
  stores,
  isLoading = false,
}: TopStoresDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    label: "Highest Revenue",
    value: "revenue",
    icon: <DollarSign className="mr-2 h-4 w-4" />,
    direction: "desc",
  });

  // Calculate metrics for a store
  const calculateMetrics = (store: TopStore) => {
    const conversionRate = (store.sales / 10000) * 100;
    const aov = store.revenue / store.sales;
    return {
      conversionRate: conversionRate.toFixed(1),
      aov: aov.toFixed(2),
      visitorValue: (store.revenue / 10000).toFixed(2), // Assuming 10k visitors
    };
  };

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;

    const query = searchQuery.toLowerCase().trim();
    return stores.filter((store) => {
      return (
        store.name.toLowerCase().includes(query) ||
        store.niche.toLowerCase().includes(query) ||
        store.link.toLowerCase().includes(query) ||
        store.CTA.toLowerCase().includes(query)
      );
    });
  }, [stores, searchQuery]);

  // Sort stores based on selected option
  const sortedStores = useMemo(() => {
    return [...filteredStores].sort((a, b) => {
      // Handle special calculated metrics
      if (sortOption.value === "conversionRate") {
        const convRateA = (a.sales / 10000) * 100;
        const convRateB = (b.sales / 10000) * 100;
        return sortOption.direction === "desc"
          ? convRateB - convRateA
          : convRateA - convRateB;
      }

      if (sortOption.value === "aov") {
        const aovA = a.revenue / a.sales;
        const aovB = b.revenue / b.sales;
        return sortOption.direction === "desc" ? aovB - aovA : aovA - aovB;
      }

      // Handle regular properties
      const valueA = a[sortOption.value as keyof TopStore];
      const valueB = b[sortOption.value as keyof TopStore];

      // Handle string values
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOption.direction === "desc"
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      }

      // Handle number values
      return sortOption.direction === "desc"
        ? (valueB as number) - (valueA as number)
        : (valueA as number) - (valueB as number);
    });
  }, [filteredStores, sortOption]);

  // Sort options
  const sortOptions: SortOption[] = [
    {
      label: "Highest Revenue",
      value: "revenue",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Lowest Revenue",
      value: "revenue",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      direction: "asc",
    },
    {
      label: "Highest Sales",
      value: "sales",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Highest Conversion Rate",
      value: "conversionRate",
      icon: <TrendingUp className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Highest AOV",
      value: "aov",
      icon: <ArrowUpRight className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "A-Z",
      value: "name",
      icon: <Globe className="mr-2 h-4 w-4" />,
      direction: "asc",
    },
    {
      label: "Z-A",
      value: "name",
      icon: <Globe className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size="large" message="Loading elite stores..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16 dark:from-gray-900 dark:to-gray-800">
      <FirefliesWrapper intensity="high">
        {/* Premium Header Section */}
        <div className="group relative overflow-hidden py-4">
          {/* <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 dark:opacity-[0.03]" /> */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6566F1]/5 via-transparent to-[#B977F8]/5" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="flex items-center space-x-2">
                <Store className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  Top Stores
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  Elite Stores
                </span>{" "}
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-100 dark:to-white">
                  Driving Results
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Discover the highest performing stores in our network with
                verified metrics and growth strategies
              </p>
              <div className="relative pt-4">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-500 ease-in-out group-hover:w-32 group-hover:from-[#6566F1]/60 group-hover:to-[#B977F8]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-lg" />
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      {/* Stores Grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  $
                  {(
                    stores.reduce((sum, store) => sum + store.revenue, 0) /
                    (stores.length || 1)
                  ).toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-[#6566F1]/10 p-3 dark:bg-[#6566F1]/20">
                <DollarSign className="h-5 w-5 text-[#6566F1]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg Sales
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(
                    stores.reduce((sum, store) => sum + store.sales, 0) /
                    (stores.length || 1)
                  ).toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-[#B977F8]/10 p-3 dark:bg-[#B977F8]/20">
                <ShoppingBag className="h-5 w-5 text-[#B977F8]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg Conversion
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(
                    stores.reduce(
                      (sum, store) => sum + (store.sales / 10000) * 100,
                      0,
                    ) / (stores.length || 1)
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div className="rounded-full bg-emerald-500/10 p-3 dark:bg-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg Order Value
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  $
                  {(
                    stores.reduce(
                      (sum, store) => sum + store.revenue / store.sales,
                      0,
                    ) / (stores.length || 1)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="rounded-full bg-amber-500/10 p-3 dark:bg-amber-500/20">
                <Rocket className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 gap-1 border-0 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white/100 dark:bg-gray-800/90 dark:hover:bg-gray-800/100"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4 text-[#6566F1] dark:text-[#B977F8]" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Sort:{" "}
                  </span>
                  <span className="font-medium text-[#6566F1] dark:text-[#B977F8]">
                    {sortOption.label}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={`${option.value}-${option.direction}`}
                    onClick={() => setSortOption(option)}
                    className="flex items-center"
                  >
                    {option.icon}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="h-10 gap-1 border-0 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white/100 dark:bg-gray-800/90 dark:hover:bg-gray-800/100"
              onClick={() => setSearchQuery("")}
              disabled={!searchQuery}
            >
              <Filter className="mr-2 h-4 w-4 text-[#6566F1] dark:text-[#B977F8]" />
              <span className="text-gray-700 dark:text-gray-300">Filters</span>
              {searchQuery && (
                <Badge className="ml-2 bg-[#6566F1] hover:bg-[#5758E0] dark:bg-[#B977F8] dark:hover:bg-[#A866E7]">
                  <X className="mr-1 h-3 w-3" /> Clear
                </Badge>
              )}
            </Button>
          </motion.div>

          {/* Search input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-xs transition-all duration-300 focus-within:max-w-sm sm:w-auto"
          >
            <div className="group relative flex items-center">
              <Input
                className="h-10 rounded-full border-0 bg-white/90 pl-4 pr-12 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 hover:bg-white/100 focus:ring-2 focus:ring-[#6566F1]/20 dark:bg-gray-800/90 dark:hover:bg-gray-800/100 dark:focus:ring-[#B977F8]/20"
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#6566F1]/10 p-1.5 transition-all duration-300 group-focus-within:bg-[#6566F1]/20 dark:bg-[#B977F8]/10 dark:group-focus-within:bg-[#B977F8]/20">
                <Search className="h-4 w-4 text-[#6566F1] transition-colors duration-200 dark:text-[#B977F8]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Loading stores..."
              : `Showing ${sortedStores.length} ${sortedStores.length === 1 ? "store" : "stores"}${
                  searchQuery ? ` for "${searchQuery}"` : ""
                }`}
          </p>
        </div>

        {/* No results message */}
        {searchQuery && sortedStores.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center rounded-xl bg-white/90 py-16 text-center shadow-sm backdrop-blur-sm dark:bg-gray-800/90"
          >
            <div className="rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 p-5">
              <Search className="h-10 w-10 text-[#B977F8]" />
            </div>
            <h3 className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200">
              No Stores match &quot;{searchQuery}&quot;
            </h3>
            <button
              className="mt-4 text-sm font-medium text-[#6566F1] hover:underline dark:text-[#B977F8]"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* Stores Grid */}
        {(!searchQuery || (searchQuery && sortedStores.length > 0)) && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <StoreCardSkeleton key={index} />
                ))
              : sortedStores.map((store, index) => {
                  const metrics = calculateMetrics(store);
                  return (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="group h-full"
                    >
                      <Card className="h-full overflow-hidden rounded-xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-900/90">
                        {/* Store Image */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                          <img
                            src={store.image || "/placeholder.svg"}
                            alt={store.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Enhanced overlay gradient for better text visibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

                          {/* Hot Store Badge */}
                          {(store.revenue > 50000 || store.sales > 1000) && (
                            <div className="absolute right-3 top-3 z-10">
                              <div className="flex items-center justify-center rounded-full bg-black/60 p-2 text-yellow-300 shadow-md">
                                <Star className="h-4 w-4" />
                              </div>
                            </div>
                          )}

                          {/* niche overlay on image */}
                          <div className="absolute left-3 top-3 rounded-full bg-black/60 py-1 pl-1 pr-2 text-xs font-medium text-white backdrop-blur-sm">
                            <LocateFixed className="mr-1 inline-block h-4 w-4" />
                            {store.niche}
                          </div>

                          {/* Store name  */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="line-clamp-2 text-lg font-semibold leading-tight drop-shadow-md">
                              {store.name}
                            </h3>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Compact metrics grid with highlights */}
                          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                            {/* Revenue */}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                              <span>Revenue</span>
                            </div>
                            <div className="text-right font-medium">
                              <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                                ${(store.revenue / 1000).toFixed(1)}K
                              </span>
                            </div>

                            {/* Sales */}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                              <span>Sales</span>
                            </div>
                            <div className="text-right font-medium">
                              {store.sales.toLocaleString()}
                            </div>

                            {/* Conversion Rate */}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                              <span>Conv. Rate</span>
                            </div>
                            <div className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                              {metrics.conversionRate}%
                            </div>

                            {/* AOV */}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                              <span>Avg. Order</span>
                            </div>
                            <div className="text-right font-medium">
                              ${metrics.aov}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50 p-3 dark:border-gray-800 dark:from-gray-900/50 dark:to-gray-800/50">
                          <a
                            href={store.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:from-[#5758E0] hover:to-[#A866E7] hover:shadow-md"
                          >
                            {store.CTA}
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </a>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
          </div>
        )}

        {/* Empty State - No stores at all */}
        {stores.length === 0 && !isLoading && !searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-xl bg-white/90 py-16 text-center shadow-sm backdrop-blur-sm dark:bg-gray-800/90"
          >
            <div className="rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 p-5">
              <Store className="h-10 w-10 text-[#B977F8]" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-gray-100">
              No elite stores found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              We couldn&apos;t find any top performing stores matching your
              criteria.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-[#6566F1] text-[#6566F1] hover:bg-[#6566F1]/10 dark:border-[#B977F8] dark:text-[#B977F8] dark:hover:bg-[#B977F8]/10"
            >
              Refresh results
            </Button>
          </motion.div>
        )}
      </div>

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

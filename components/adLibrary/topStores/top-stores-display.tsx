"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getTopStores } from "@/actions/top-stores";
import type { TopStore } from "@prisma/client";
import {
  ArrowUpDown,
  ArrowUpRight,
  DollarSign,
  ExternalLink,
  Filter,
  Globe,
  LocateFixed,
  Rocket,
  Search,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Loading } from "../microComponents/Loading";
import TitleSection from "../TitleSection";

// 🔄 Sort Options Type
type SortOption = {
  label: string;
  value: keyof TopStore | "conversionRate" | "aov";
  icon: React.ReactNode;
  direction: "asc" | "desc";
};
// 🧩 Simplified Store Card Component
function StoreCard({ store }: { store: TopStore }) {
  const metrics = useMemo(() => {
    const conversionRate = (store.sales / 10000) * 100;
    const aov = store.revenue / store.sales;
    return {
      conversionRate: conversionRate.toFixed(1),
      aov: aov.toFixed(2),
    };
  }, [store.sales, store.revenue]);

  return (
    <Card className="h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* 🖼️ Store Image - Fits within container, preserves aspect ratio */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
        <Image
          src={store.image || "/placeholder.svg"}
          alt={store.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* 🌟 Hot Store Badge */}
        {(store.revenue > 50000 || store.sales > 1000) && (
          <div className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-yellow-300">
            <Star className="h-4 w-4" />
          </div>
        )}

        {/* 🎯 Niche Badge */}
        <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
          <LocateFixed className="mr-1 inline-block h-3 w-3" />
          {store.niche}
        </div>
      </div>

      <CardContent className="p-4">
        {/* 📝 Store Name - Single row with truncation */}
        <h3 className="mb-3 truncate text-lg font-semibold text-gray-900 dark:text-white">
          {store.name}
        </h3>

        {/* 📊 Store Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          {/* Revenue */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <DollarSign className="mr-1.5 h-3.5 w-3.5" />
            <span>Revenue</span>
          </div>
          <div className="text-right font-medium text-blue-600 dark:text-blue-400">
            ${(store.revenue / 1000).toFixed(1)}K
          </div>

          {/* Sales */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
            <span>Sales</span>
          </div>
          <div className="text-right font-medium">
            {store.sales.toLocaleString()}
          </div>

          {/* Conversion Rate */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            <span>Conv. Rate</span>
          </div>
          <div className="text-right font-medium text-emerald-600 dark:text-emerald-400">
            {metrics.conversionRate}%
          </div>

          {/* AOV */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
            <span>Avg. Order</span>
          </div>
          <div className="text-right font-medium">${metrics.aov}</div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50/50 p-1 dark:border-gray-800 dark:bg-gray-800/50">
        <a
          href={store.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {store.CTA}
          <ExternalLink className="ml-1.5 h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}

// 🧩 Main Component
export function TopStoresDisplay() {
  const [stores, setStores] = useState<TopStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        setIsLoading(true);
        const data = await getTopStores();
        setStores(data);
      } catch (error) {
        console.error("❌ Error loading stores:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    label: "Highest Revenue",
    value: "revenue",
    icon: <DollarSign className="mr-2 h-4 w-4" />,
    direction: "desc",
  });

  // 🔍 Filter stores
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

  // 🔄 Sort stores
  const sortedStores = useMemo(() => {
    return [...filteredStores].sort((a, b) => {
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

      const valueA = a[sortOption.value as keyof TopStore];
      const valueB = b[sortOption.value as keyof TopStore];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOption.direction === "desc"
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      }

      return sortOption.direction === "desc"
        ? (valueB as number) - (valueA as number)
        : (valueA as number) - (valueB as number);
    });
  }, [filteredStores, sortOption]);

  // 🔄 Sort options
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
    return <Loading size="large" message="Loading stores..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-900">
      <TitleSection
        icon={Store}
        badgeText="Top Stores"
        image={Rocket}
        imageColor="text-blue-500 dark:text-blue-400"
        highlightedText="Elite Picks"
        remainingTitle="Max Growth"
        auroraColors={["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD"]}
        description="Discover top-performing stores driving success with verified metrics."
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 📊 Stats Bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/20">
                <Rocket className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 🔍 Search and Sort Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-1 bg-transparent">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort: {sortOption.label}
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

            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="h-10 gap-1"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filter
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="relative w-full max-w-xs sm:w-auto">
            <Input
              className="h-10 pl-4 pr-10"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 📊 Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {sortedStores.length}{" "}
            {sortedStores.length === 1 ? "store" : "stores"}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </p>
        </div>

        {/* 🏪 Stores Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedStores.length > 0 ? (
            sortedStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))
          ) : searchQuery ? (
            <div className="col-span-full rounded-xl bg-white py-12 text-center shadow-sm dark:bg-gray-800">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No stores found matching &quot;{searchQuery}&quot;
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your search terms
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="col-span-full rounded-xl bg-white py-12 text-center shadow-sm dark:bg-gray-800">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">
                No stores found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We couldn&apos;t find any stores matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

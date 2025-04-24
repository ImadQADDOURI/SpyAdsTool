"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/actions/top-products";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  BarChart3,
  Calendar,
  ChevronUp,
  DollarSign,
  ExternalLink,
  Filter,
  LocateFixed,
  Package,
  PackageOpen,
  Search,
  Star,
  Store,
  Trophy,
  X,
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

import FirefliesWrapper from "../microComponents/FirefliesWrapper";
import { ScrollButtons } from "../microComponents/ScrollButtons";
import { countryCodesAlpha2Flag } from "../searchFilters/filter-config";

// ========================================
//        📦 Product Type 📦
// ========================================
type Product = {
  id: string;
  image: string;
  title: string;
  niche: string | null;
  link: string;
  uploadDate: Date | null;
  stars: number | null;
  buyPrice: number | null;
  sellPrice: number | null;
  totalSales: number | null;
  countries: string[];
  createdAt: Date;
  updatedAt: Date;
};

// ========================================
//        🔄 Sort Options 🔄
// ========================================
type SortOption = {
  label: string;
  value: keyof Product | "profit";
  icon: React.ReactNode;
  direction: "asc" | "desc";
};

// ========================================
//        🧩 Product Card Component 🧩
// ========================================
function ProductCard({ product }: { product: Product }) {
  const profit = useMemo(() => {
    if (product.sellPrice && product.buyPrice) {
      return product.sellPrice - product.buyPrice;
    }
    return null;
  }, [product.sellPrice, product.buyPrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <Card className="h-full overflow-hidden rounded-xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-900/90">
        {/* Bigger image with improved aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Enhanced overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

          {/* Rating badge */}
          {product.stars !== null && (
            <div className="absolute right-3 top-3 flex items-center rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              {product.stars.toFixed(1)}
            </div>
          )}

          {/* Niche badge */}
          {product.niche && (
            <div className="absolute left-3 top-3 rounded-full bg-black/60 py-1 pl-1 pr-2 text-xs font-medium text-white backdrop-blur-sm">
              <LocateFixed className="mr-1 inline-block h-4 w-4" />
              {product.niche}
            </div>
          )}

          {/* Title overlay on image for more space efficiency */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight drop-shadow-md">
              {product.title}
            </h3>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Countries row */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {product.countries && product.countries.length > 0 ? (
              product.countries.map((code) => {
                const country = countryCodesAlpha2Flag.find(
                  (c) => c.value === code,
                );
                return (
                  <TooltipProvider key={code}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative h-5 w-5 overflow-hidden rounded-sm shadow-sm transition-transform hover:scale-110">
                          <Image
                            src={country?.icon as string}
                            alt={country?.label || code}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{country?.label || code}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })
            ) : (
              <Badge
                variant="outline"
                className="bg-gray-100 text-xs dark:bg-gray-800"
              >
                Global
              </Badge>
            )}
          </div>

          {/* Compact info grid with highlights */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {(product.buyPrice !== null || product.sellPrice !== null) && (
              <>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                  <span>Price</span>
                </div>
                <div className="text-right font-medium">
                  {product.sellPrice !== null && (
                    <span className="text-gray-900 dark:text-gray-100">
                      ${product.sellPrice.toFixed(2)}
                    </span>
                  )}
                  {product.buyPrice !== null && (
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400">
                      Buy: ${product.buyPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </>
            )}

            {profit !== null && (
              <>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                  <span>Profit</span>
                </div>
                <div className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                  ${profit.toFixed(2)}
                </div>
              </>
            )}

            {product.totalSales !== null && (
              <>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                  <span>Monthly Sales</span>
                </div>
                <div className="text-right font-medium">
                  <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-transparent">
                    {product.totalSales.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {product.uploadDate && (
              <>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <span>Added</span>
                </div>
                <div className="text-right text-xs font-medium">
                  {format(new Date(product.uploadDate), "MMM d, yyyy")}
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50 p-3 dark:border-gray-800 dark:from-gray-900/50 dark:to-gray-800/50">
          <Link
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:from-[#5758E0] hover:to-[#A866E7] hover:shadow-md"
          >
            View Product
            <ExternalLink className="ml-1.5 h-3 w-3" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ========================================
//        🧩 Skeleton Card Component 🧩
// ========================================
function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-xl border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <div className="mb-3 flex gap-1.5">
          <Skeleton className="h-5 w-7 rounded-sm" />
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
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50 p-3 dark:border-gray-800 dark:from-gray-900/50 dark:to-gray-800/50">
        <Skeleton className="h-8 w-full rounded-full" />
      </CardFooter>
    </Card>
  );
}

// ========================================
//        🧩 Main Component 🧩
// ========================================
export default function TopProductsDisplay() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    label: "Newest",
    value: "createdAt",
    icon: <Calendar className="mr-2 h-4 w-4" />,
    direction: "desc",
  });

  // 📥 Fetch products on component mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // 🔍 Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      return (
        product.title.toLowerCase().includes(query) ||
        (product.niche && product.niche.toLowerCase().includes(query)) ||
        product.link.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  // 🔄 Sort products based on selected option
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOption.value === "profit") {
        const profitA =
          a.sellPrice && a.buyPrice ? a.sellPrice - a.buyPrice : 0;
        const profitB =
          b.sellPrice && b.buyPrice ? b.sellPrice - b.buyPrice : 0;
        return sortOption.direction === "desc"
          ? profitB - profitA
          : profitA - profitB;
      }

      const valueA = a[sortOption.value];
      const valueB = b[sortOption.value];

      // Handle null/undefined values
      if (valueA === null || valueA === undefined)
        return sortOption.direction === "desc" ? 1 : -1;
      if (valueB === null || valueB === undefined)
        return sortOption.direction === "desc" ? -1 : 1;

      // Sort dates
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortOption.direction === "desc"
          ? valueB.getTime() - valueA.getTime()
          : valueA.getTime() - valueB.getTime();
      }

      // Sort strings
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOption.direction === "desc"
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      }

      // Sort numbers
      return sortOption.direction === "desc"
        ? (valueB as number) - (valueA as number)
        : (valueA as number) - (valueB as number);
    });
  }, [filteredProducts, sortOption]);

  // 🔄 Sort options
  const sortOptions: SortOption[] = [
    {
      label: "Newest",
      value: "createdAt",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Oldest",
      value: "createdAt",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      direction: "asc",
    },
    {
      label: "Highest Sales",
      value: "totalSales",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Highest Price",
      value: "sellPrice",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Lowest Price",
      value: "sellPrice",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      direction: "asc",
    },
    {
      label: "Highest Profit",
      value: "profit",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
    {
      label: "Highest Rating",
      value: "stars",
      icon: <Star className="mr-2 h-4 w-4" />,
      direction: "desc",
    },
  ];

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
                <PackageOpen className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  Top Products
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  Winning Products
                </span>{" "}
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-100 dark:to-white">
                  Driving Results
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Discover the highest performing Products in our network with
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length}
                </p>
              </div>
              <div className="rounded-full bg-[#6566F1]/10 p-3 dark:bg-[#6566F1]/20">
                <Package className="h-5 w-5 text-[#6566F1]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg. Price
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  $
                  {products.length > 0
                    ? (
                        products.reduce(
                          (sum, p) => sum + (p.sellPrice || 0),
                          0,
                        ) / products.filter((p) => p.sellPrice).length
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="rounded-full bg-[#B977F8]/10 p-3 dark:bg-[#B977F8]/20">
                <DollarSign className="h-5 w-5 text-[#B977F8]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg. Rating
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length > 0
                    ? (
                        products.reduce((sum, p) => sum + (p.stars || 0), 0) /
                        products.filter((p) => p.stars).length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <div className="rounded-full bg-yellow-500/10 p-3 dark:bg-yellow-500/20">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Sales
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products
                    .reduce((sum, p) => sum + (p.totalSales || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="rounded-full bg-emerald-500/10 p-3 dark:bg-emerald-500/20">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
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
                placeholder="Search products..."
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
              ? "Loading products..."
              : `Showing ${sortedProducts.length} ${sortedProducts.length === 1 ? "product" : "products"}${
                  searchQuery ? ` for "${searchQuery}"` : ""
                }`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : sortedProducts.length > 0
              ? sortedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : searchQuery && (
                  <div className="col-span-full rounded-xl bg-white/90 py-12 text-center shadow-sm backdrop-blur-sm dark:bg-gray-800/90">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                      No products found matching "{searchQuery}"
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Try adjusting your search terms
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-[#6566F1] text-[#6566F1] hover:bg-[#6566F1]/10 dark:border-[#B977F8] dark:text-[#B977F8] dark:hover:bg-[#B977F8]/10"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </div>
                )}
        </div>

        {/* Empty State */}
        {!isLoading && products.length === 0 && !searchQuery && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/80 p-12 text-center shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No products yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first product in the admin panel.
            </p>
          </div>
        )}
      </div>

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

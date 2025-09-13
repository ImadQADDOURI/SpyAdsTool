"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/actions/top-products";
import { format } from "date-fns";
import {
  ArrowUpDown,
  BarChart3,
  Calendar,
  DollarSign,
  ExternalLink,
  Filter,
  LocateFixed,
  Package,
  PackageOpen,
  Search,
  Star,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { countryCodesAlpha2Flag } from "../search/filter-config";
import { Loading } from "../sharedComponents/Loading";
import TitleSection from "../sharedComponents/TitleSection";

// 📦 Product Type Definition
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

// 🔄 Sort Options Type
type SortOption = {
  label: string;
  value: keyof Product | "profit";
  icon: React.ReactNode;
  direction: "asc" | "desc";
};

// 🧩 Simplified Product Card Component
function ProductCard({ product }: { product: Product }) {
  const profit = useMemo(() => {
    if (product.sellPrice && product.buyPrice) {
      return product.sellPrice - product.buyPrice;
    }
    return null;
  }, [product.sellPrice, product.buyPrice]);

  return (
    <Card className="h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* 🖼️ Image Container - Fits within container, preserves aspect ratio */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* 🏷️ Rating Badge */}
        {product.stars !== null && (
          <div className="absolute right-2 top-2 flex items-center rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
            <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.stars.toFixed(1)}
          </div>
        )}

        {/* 🎯 Niche Badge */}
        {product.niche && (
          <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
            <LocateFixed className="mr-1 inline-block h-3 w-3" />
            {product.niche}
          </div>
        )}

        {/* 🔗 View Product Badge */}
        <Link
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
        >
          View
          <ExternalLink className="ml-1.5 h-3 w-3" />
        </Link>
      </div>

      <CardContent className="p-4">
        {/* 📝 Title - Single row with truncation */}
        <h3 className="mb-3 truncate text-lg font-semibold text-gray-900 dark:text-white">
          {product.title}
        </h3>

        {/* 🌍 Countries Row */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {product.countries && product.countries.length > 0 ? (
            product.countries.slice(0, 5).map((code) => {
              const country = countryCodesAlpha2Flag.find(
                (c) => c.value === code,
              );
              return (
                <TooltipProvider key={code}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative h-5 w-5 overflow-hidden rounded-sm shadow-sm">
                        <Image
                          src={(country?.icon as string) || "/placeholder.svg"}
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
            <Badge variant="outline" className="text-xs">
              Global
            </Badge>
          )}
          {product.countries && product.countries.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{product.countries.length - 5}
            </Badge>
          )}
        </div>

        {/* 📊 Product Info Grid */}
        <div className="grid grid-cols-2 text-sm">
          {(product.buyPrice !== null || product.sellPrice !== null) && (
            <>
              <div className="flex items-center border-b border-gray-200 py-1 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                <span>Price</span>
              </div>
              <div className="border-b border-gray-200 py-1 text-right font-medium dark:border-gray-700">
                {product.sellPrice !== null && (
                  <span className="text-gray-900 dark:text-gray-100">
                    ${product.sellPrice.toFixed(2)}
                  </span>
                )}
                {product.buyPrice !== null && (
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Buy: ${product.buyPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </>
          )}

          {profit !== null && (
            <>
              <div className="flex items-center border-b border-gray-200 py-1 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                <span>Profit</span>
              </div>
              <div className="border-b border-gray-200 py-1 text-right font-medium text-emerald-600 dark:border-gray-700 dark:text-emerald-400">
                ${profit.toFixed(2)}
              </div>
            </>
          )}

          {product.totalSales !== null && (
            <>
              <div className="flex items-center border-b border-gray-200 py-1 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                <span>Sales</span>
              </div>
              <div className="border-b border-gray-200 py-1 text-right font-medium text-blue-600 dark:border-gray-700 dark:text-blue-400">
                {product.totalSales.toLocaleString()}
              </div>
            </>
          )}

          {product.uploadDate && (
            <>
              <div className="flex items-center py-1 text-gray-500 dark:text-gray-400">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                <span>Added</span>
              </div>
              <div className="py-1 text-right text-sm font-medium">
                {format(new Date(product.uploadDate), "MMM d, yyyy")}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// 🧩 Main Component
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

  // 📥 Fetch products on mount
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

  // 🔍 Filter products
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

  // 🔄 Sort products
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

      if (valueA === null || valueA === undefined)
        return sortOption.direction === "desc" ? 1 : -1;
      if (valueB === null || valueB === undefined)
        return sortOption.direction === "desc" ? -1 : 1;

      if (valueA instanceof Date && valueB instanceof Date) {
        return sortOption.direction === "desc"
          ? valueB.getTime() - valueA.getTime()
          : valueA.getTime() - valueB.getTime();
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOption.direction === "desc"
          ? valueB.localeCompare(valueA)
          : valueA.localeCompare(valueB);
      }

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

  if (isLoading) {
    return <Loading size="large" message=" Loading products... " />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-900">
      <TitleSection
        icon={Package}
        badgeText="Top Products"
        image={PackageOpen}
        imageColor="text-indigo-500 dark:text-indigo-400"
        highlightedText="Winning Products"
        remainingTitle="Driving Results"
        auroraColors={["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"]}
        description="Uncover leading products fueling growth with robust metrics."
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 📊 Stats Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg. Sales
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length > 0
                    ? (
                        products.reduce(
                          (sum, p) => sum + (p.totalSales || 0),
                          0,
                        ) / products.length
                      ).toFixed(0)
                    : "0"}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                <BarChart3 className="h-5 w-5 text-purple-600" />
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
              placeholder="Search products..."
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
            Showing {sortedProducts.length}{" "}
            {sortedProducts.length === 1 ? "product" : "products"}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </p>
        </div>

        {/* 🛍️ Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : searchQuery ? (
            <div className="col-span-full rounded-xl bg-white py-12 text-center shadow-sm dark:bg-gray-800">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No products found matching &quot;{searchQuery}&quot;
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
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
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
      </div>
    </div>
  );
}

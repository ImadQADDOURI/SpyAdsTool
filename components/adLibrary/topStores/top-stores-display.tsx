// @/components/top-stores-display.tsx
"use client";

import { type TopStore } from "@prisma/client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart2,
  ChevronRight,
  DollarSign,
  ExternalLink,
  LocateFixed,
  Rocket,
  Shield,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

import { ScrollButtons } from "../microComponents/ScrollButtons";

interface TopStoresDisplayProps {
  stores: TopStore[];
  isLoading?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function TopStoresDisplay({ stores, isLoading }: TopStoresDisplayProps) {
  const calculateMetrics = (store: TopStore) => {
    const conversionRate = (store.sales / 10000) * 100;
    const aov = store.revenue / store.sales;
    return {
      conversionRate: conversionRate.toFixed(1),
      aov: aov.toFixed(2),
      visitorValue: (store.revenue / 10000).toFixed(2), // Assuming 10k visitors
    };
  };

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
                <Sparkles className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  Premium Collection
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  Elite Stores
                </span>
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
              <div className="mt-8 flex items-center gap-x-4">
                <Button
                  size="lg"
                  className="group rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-6 shadow-lg transition-all hover:shadow-[0_10px_25px_-5px_rgba(101,102,241,0.3)]"
                >
                  Explore Stores
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-gray-900/10 px-6 dark:border-gray-100/10"
                >
                  How we rank
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
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
          className="mb-8 grid grid-cols-2 gap-4 rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-800/50 md:grid-cols-4"
        >
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-[#6566F1]/10 p-3 dark:bg-[#6566F1]/20">
              <DollarSign className="h-6 w-6 text-[#6566F1]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Revenue</p>
              <p className="text-xl font-bold">
                $
                {(
                  stores.reduce((sum, store) => sum + store.revenue, 0) /
                  (stores.length || 1)
                ).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-[#B977F8]/10 p-3 dark:bg-[#B977F8]/20">
              <ShoppingBag className="h-6 w-6 text-[#B977F8]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Sales</p>
              <p className="text-xl font-bold">
                {(
                  stores.reduce((sum, store) => sum + store.sales, 0) /
                  (stores.length || 1)
                ).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-emerald-500/10 p-3 dark:bg-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Conversion</p>
              <p className="text-xl font-bold">
                {(
                  stores.reduce(
                    (sum, store) => sum + (store.sales / 10000) * 100,
                    0,
                  ) / (stores.length || 1)
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/20">
              <Rocket className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-xl font-bold">
                $
                {(
                  stores.reduce(
                    (sum, store) => sum + store.revenue / store.sales,
                    0,
                  ) / (stores.length || 1)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stores.map((store, index) => {
            const metrics = calculateMetrics(store);
            return (
              <motion.div
                key={store.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 * index }}
              >
                <Card className="group relative h-full overflow-hidden border border-gray-200/50 transition-all duration-300 hover:border-[#B977F8]/30 hover:shadow-xl dark:border-gray-700/50 dark:hover:border-[#B977F8]/30 dark:hover:shadow-[#B977F8]/10">
                  {/* Hot Store Badge */}
                  {(store.revenue > 50000 || store.sales > 1000) && (
                    <div className="absolute right-3 top-3 z-10">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center rounded-full bg-amber-500 p-2 text-white">
                              <Zap className="h-4 w-4 fill-white" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hot Store - High Performance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}

                  {/* Store Image */}
                  <CardHeader className="relative p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-xl font-bold text-white">
                          {store.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center space-x-1 rounded-full bg-[#B977F8]/90 px-3 py-1 text-xs font-medium text-white">
                            <LocateFixed className="h-4 w-4" />{" "}
                            {/* Add niche icon */}
                            <span>{store.niche}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Store Metrics */}
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Revenue */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ y: -2 }}
                              className="flex items-center space-x-2 rounded-lg bg-[#6566F1]/10 p-3 dark:bg-[#6566F1]/20"
                            >
                              <DollarSign className="h-5 w-5 text-[#6566F1]" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Revenue
                                </p>
                                <p className="font-bold">
                                  ${(store.revenue / 1000).toFixed(1)}K
                                </p>
                              </div>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              ${store.revenue.toLocaleString()} total revenue
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Sales */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ y: -2 }}
                              className="flex items-center space-x-2 rounded-lg bg-[#B977F8]/10 p-3 dark:bg-[#B977F8]/20"
                            >
                              <ShoppingBag className="h-5 w-5 text-[#B977F8]" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Sales
                                </p>
                                <p className="font-bold">
                                  {store.sales.toLocaleString()}
                                </p>
                              </div>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{store.sales.toLocaleString()} total orders</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Conversion Rate */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ y: -2 }}
                              className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 p-3 dark:bg-emerald-500/20"
                            >
                              <BarChart2 className="h-5 w-5 text-emerald-500" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Conv. Rate
                                </p>
                                <p className="font-bold">
                                  {metrics.conversionRate}%
                                </p>
                              </div>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Estimated from 10,000 visitors</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* AOV */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ y: -2 }}
                              className="flex items-center space-x-2 rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/20"
                            >
                              <ArrowUpRight className="h-5 w-5 text-amber-500" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Avg. Order
                                </p>
                                <p className="font-bold">${metrics.aov}</p>
                              </div>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average order value</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>

                  {/* CTA */}
                  <CardFooter className="p-4 pt-0">
                    <a
                      href={store.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-[#B977F8]/40"
                    >
                      <Zap className="h-4 w-4" />
                      <span>{store.CTA}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {stores.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="rounded-full bg-gray-200 p-8 dark:bg-gray-700">
              <ShoppingBag className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-gray-100">
              No elite stores found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              We couldn&apos;t find any top performing stores matching your
              criteria.
            </p>
            <Button variant="outline" className="mt-6">
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

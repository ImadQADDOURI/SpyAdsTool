// components/adsLibrary/Analytics.tsx
"use client";

import React, { useMemo } from "react";
import { ActivitySquare, CheckCircle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AnalyzeTrends from "./AnalyzeTrends";

interface AnalyticsProps {
  ads: AdData[];
  isComplete?: boolean;
  isLoading?: boolean;
  totalCount?: number | null;
  remainingCount?: number | null;
  onLoadMore?: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({
  ads,
  isComplete = false,
  isLoading = false,
  totalCount = null,
  remainingCount = null,
  onLoadMore,
}) => {
  const { theme } = useTheme();

  const { chartData, activeAdsCount } = useMemo(() => {
    const dataMap = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let activeCount = 0;

    ads.forEach((ad) => {
      if (ad.start_date === undefined) return;
      // // display ads Dates
      // console.log(
      //   `Before : Start Date: ${new Date(ad.startDate * 1000).toLocaleDateString()}, End Date: ${ad.endDate ? new Date(ad.endDate * 1000).toLocaleDateString() : "Ongoing"}, Active: ${ad.isActive}`,
      // );
      const startDate = new Date(ad.start_date * 1000);
      let endDate: Date;

      if (
        // if endDate not a valid date use today as end date
        ad.end_date === undefined ||
        new Date(ad.end_date * 1000) < startDate ||
        new Date(ad.end_date * 1000) >= tomorrow
      ) {
        console.log("🚀🚀🚀🚀 !!! invalid end date !!!", ad.end_date);
        endDate = today;
      } else {
        endDate = new Date(ad.end_date * 1000);
      }

      //Populating the Data Map:For each day between the start and end date of an ad, we increment the count in our dataMap.This gives us a day-by-day count of how many ads were active on each date.
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        dataMap.set(dateString, (dataMap.get(dateString) || 0) + 1);
      }

      // Count current active ads,We increment activeCount for each ad that is currently active.
      if (ad.is_active) {
        activeCount++;
      }
    });

    //// Adding Extra Days:
    // Add a day at the start with value 0 only if all ads are Loaded
    if (dataMap.size > 0 && isComplete) {
      const firstDay = new Date(
        Math.min(
          ...Array.from(dataMap.keys()).map((date) => new Date(date).getTime()),
        ),
      );
      const startDay = new Date(firstDay);
      startDay.setDate(startDay.getDate() - 1);
      const startDayString = startDay.toISOString().split("T")[0];
      dataMap.set(startDayString, 0);
    }

    // Add an extra day at the end
    if (activeCount > 0) {
      const extraDay = new Date(today);
      extraDay.setDate(extraDay.getDate() + 1);
      const extraDayString = extraDay.toISOString().split("T")[0];
      dataMap.set(extraDayString, activeCount);
    } else {
      // If there are no active ads, add an extra day with value 0
      const dates = Array.from(dataMap.keys()).map((date) => new Date(date));
      if (dates.length > 0) {
        const lastDay = new Date(Math.max(...dates.map((d) => d.getTime())));
        const extraDay = new Date(lastDay);
        extraDay.setDate(extraDay.getDate() + 1);
        const extraDayString = extraDay.toISOString().split("T")[0];
        dataMap.set(extraDayString, 0);
      } else {
        // If dataMap is empty, use today's date
        const extraDayString = today.toISOString().split("T")[0];
        dataMap.set(extraDayString, 0);
      }
    }

    //Preparing Chart Data:
    //We convert our dataMap into an array of objects, each containing a date and the count of active ads for that date.
    //We sort this array by date to ensure chronological order.
    const dates = Array.from(dataMap, ([date, activeVersions]) => ({
      date,
      activeVersions,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // log the ( date / active ads ) array
    // for (const date of dates) {
    //   console.log(`  ${date.date}: ${date.activeVersions}`);
    // }
    // console.log("🚀🚀🚀🚀");

    return { chartData: dates, activeAdsCount: activeCount };
  }, [ads]);

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const chartColor = theme === "dark" ? "#FF1493" : "#8B00FF";

  return (
    <Card className="w-full bg-white dark:bg-gray-900">
      <CardHeader className="pb-4">
        {/* Responsive Layout: Single row on large screens, two rows on small screens */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* First Row/Section: Title and Description */}
          <div className="min-w-0 flex-shrink space-y-1.5">
            <CardTitle className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-lg font-bold text-transparent sm:text-xl">
              Ad Scale
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Number of active ad versions over time
            </CardDescription>
          </div>

          {/* Second Row/Section: Button and Active Count */}
          <div className="flex items-center justify-between gap-3 lg:justify-end lg:gap-4">
            {/* Load More Button or Complete Status */}
            <div className="flex flex-shrink-0 items-center">
              {!isComplete ? (
                <Button
                  onClick={onLoadMore}
                  disabled={isLoading || !onLoadMore}
                  className="group relative h-auto min-w-[120px] transform flex-col gap-1.5 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-[#6566F1] via-[#7C6AE8] to-[#B977F8] px-3 py-2.5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#5855E8] hover:via-[#6B5AE5] hover:to-[#A866E5] hover:shadow-2xl active:scale-95 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[160px] sm:px-4 sm:py-3 lg:min-w-[180px]"
                >
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  {/* Button Text */}
                  <div className="relative z-10 flex w-full items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                          Loading...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                          <span className="hidden sm:inline">
                            Load More Versions
                          </span>
                          <span className="sm:hidden">Load More</span>
                        </span>
                        {totalCount !== null &&
                          remainingCount !== null &&
                          remainingCount > 0 && (
                            <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs opacity-90 sm:ml-2">
                              {totalCount - remainingCount}/{totalCount}
                            </span>
                          )}
                      </>
                    )}
                  </div>

                  {/* Enhanced Progress Bar Inside Button */}
                  {totalCount !== null &&
                    remainingCount !== null &&
                    totalCount > 0 && (
                      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 shadow-inner sm:h-1.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-white/80 to-white/60 shadow-sm transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.max(0, Math.min(100, ((totalCount - remainingCount) / totalCount) * 100))}%`,
                          }}
                        />
                        {/* Progress glow effect */}
                        <div
                          className="absolute top-0 h-full rounded-full bg-white/40 blur-sm transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.max(0, Math.min(100, ((totalCount - remainingCount) / totalCount) * 100))}%`,
                          }}
                        />
                      </div>
                    )}
                </Button>
              ) : (
                <div className="group relative flex h-auto min-w-[120px] flex-col gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-3 py-2.5 text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:min-w-[160px] sm:px-4 sm:py-3 lg:min-w-[180px]">
                  {/* Success shimmer effect */}
                  <div className="absolute inset-0 -skew-x-12 transform animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Completed Text */}
                  <div className="relative z-10 flex w-full items-center justify-center">
                    <CheckCircle className="mr-2 h-3 w-3 animate-bounce sm:h-4 sm:w-4" />
                    <span className="text-xs font-semibold tracking-wide sm:text-sm">
                      <span className="hidden sm:inline">All Loaded</span>
                      <span className="sm:hidden">Complete</span>
                    </span>
                    {totalCount !== null && (
                      <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs opacity-90 sm:ml-2">
                        {totalCount}
                      </span>
                    )}
                  </div>

                  {/* Completed Progress Bar with celebration effect */}
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 shadow-inner sm:h-1.5">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-white/80 to-white/60 shadow-sm" />
                    <div className="absolute top-0 h-full w-full animate-pulse rounded-full bg-white/40 blur-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Active Versions Count */}
            <div className="flex flex-shrink-0 items-center rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 px-2 py-1.5 sm:px-4 sm:py-2">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="flex h-1.5 w-1.5 rounded-full bg-[#6566F1] sm:h-2 sm:w-2">
                  <div className="h-1.5 w-1.5 animate-ping rounded-full bg-[#6566F1] sm:h-2 sm:w-2" />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                  <span className="hidden sm:inline">Active Versions</span>
                  <span className="sm:hidden">Active</span>
                </span>
                <span className="text-sm font-bold text-[#6566F1] dark:text-[#B977F8] sm:text-lg">
                  {activeAdsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Content Container */}
        <div className="flex flex-col gap-4">
          {/* Chart Section */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  interval="preserveStartEnd"
                  tickCount={5}
                  stroke={theme === "dark" ? "#888" : "#333"}
                  fontSize={12}
                  dy={10}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  tickCount={5}
                  stroke={theme === "dark" ? "#888" : "#333"}
                  fontSize={12}
                  width={25}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "dark" ? "#333" : "#eee"}
                />
                <Tooltip
                  labelFormatter={(label) => formatTooltipDate(label as string)}
                  contentStyle={{
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(51, 51, 51, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                    border: "1px solid",
                    borderColor:
                      theme === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#fff" : "#333",
                    fontSize: "12px",
                    padding: "2px 0",
                  }}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="activeVersions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: theme === "dark" ? "#fff" : "#333",
                    fill: "#3b82f6",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trends Analysis Section */}
          <div className="">
            <AnalyzeTrends chartData={chartData} periods={[7, 30, 0]} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;

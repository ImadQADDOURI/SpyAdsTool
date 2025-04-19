import React, { useMemo } from "react";
import { BarChart2, DollarSign, Euro, Target, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpendDisplayProps {
  cpm: number;
  totalReach: number;
  className?: string;
}

const SpendDisplay: React.FC<SpendDisplayProps> = ({
  cpm,
  totalReach,
  className,
}) => {
  // Calculate metrics with more precise calculations
  const metrics = useMemo(() => {
    // Precise calculations
    const spend = (cpm * totalReach) / 1000;
    const cpi = spend / totalReach;
    const effectiveCPM = (spend / totalReach) * 1000;

    return {
      spend: Number(spend).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      cpm: Number(cpm).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      cpi: Number(cpi).toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }),
      effectiveCPM: Number(effectiveCPM).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalReach: totalReach.toLocaleString("en-US"),
    };
  }, [cpm, totalReach]);

  // Determine size class based on spend value length
  const valueSize = metrics.spend.length > 5 ? "text-xl" : "text-2xl";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "group flex w-full cursor-pointer flex-col rounded-xl bg-gradient-to-br from-white to-gray-100/80 p-4 transition-all duration-300",
              "hover:shadow-lg dark:from-gray-800/80 dark:to-gray-900/60 dark:hover:shadow-gray-900/30",
              "border-2 border-[#9C5FF5]/60 hover:border-[#9C5FF5] dark:border-[#9C5FF5]/70 dark:hover:border-[#B977F8]", // Thicker, more vibrant border
              "transform hover:-translate-y-1 hover:scale-[1]", // Subtle lift effect
              "relative overflow-hidden shadow-[0_0_15px_rgba(156,95,245,0.15)]", // Base shadow with purple tint
              className,
            )}
          >
            {/*glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#9C5FF5]/20 to-transparent opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-70"></div>

            {/* Pulsing border effect */}
            <div className="absolute inset-0 animate-pulse rounded-xl border-2 border-[#9C5FF5]/30"></div>

            {/* Enhanced Header with Gradient Title and Dynamic Icon */}
            <div className="relative z-10 mb-2 flex flex-row items-center justify-between">
              <span className="text-md font-semibold text-gray-600 transition-colors duration-300 group-hover:text-[#9C5FF5] dark:text-gray-300 dark:group-hover:text-[#B977F8]">
                Spend
              </span>
              <BarChart2
                className={cn(
                  "h-6 w-6 text-[#9C5FF5] transition-all duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110 dark:text-[#B977F8]",
                )}
              />
            </div>

            {/* Enhanced Main Value Display */}
            <div className="relative z-10 flex items-center justify-center rounded-lg border border-[#9C5FF5]/20 bg-white/70 py-3 shadow-sm backdrop-blur-sm transition-colors duration-300 group-hover:border-[#9C5FF5]/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-2">
                <Euro className="h-6 w-6 text-[#8A70FA] transition-colors duration-300 group-hover:text-[#9C5FF5] dark:text-[#A37FF8]" />
                <span
                  className={cn(
                    "font-bold tracking-tight text-gray-800 transition-colors duration-300 group-hover:text-[#6566F1] dark:text-gray-200",
                    valueSize,
                  )}
                >
                  {metrics.spend}
                </span>
              </div>
            </div>

            {/* Detailed Metrics Breakdown */}
            <div className="relative z-10 mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-md border border-[#9C5FF5]/10 bg-gray-100/50 p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-gray-100/80 group-hover:border-[#9C5FF5]/40 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
                <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  CPM
                </span>
                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Target className="h-4 w-4 text-[#6566F1] transition-all duration-300 group-hover:scale-110 group-hover:text-[#6566F1]" />
                  {metrics.cpm} €
                </div>
              </div>
              <div className="rounded-md border border-[#9C5FF5]/10 bg-gray-100/50 p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-gray-100/80 group-hover:border-[#9C5FF5]/40 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
                <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  CPI
                </span>
                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Zap className="h-4 w-4 text-[#B977F8] transition-all duration-300 group-hover:scale-110 group-hover:text-[#B977F8]" />
                  {metrics.cpi} €
                </div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-md">
          <div className="space-y-2 p-2">
            <div className="mb-1 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[#6566F1]" />
              <h3 className="text-sm font-semibold">
                Comprehensive Ad Performance Metrics
              </h3>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="font-medium">Total Spend:</span>
                <span>{metrics.spend} calculated from CPM * Reach</span> €
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cost Per Mille (CPM):</span>
                <span>{metrics.cpm} per 1,000 impressions</span> €
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cost Per Click (cpi):</span>
                <span>{metrics.cpi} per individual interaction</span> €
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Reach:</span>
                <span>{metrics.totalReach} total impressions</span>
              </div>
            </div>
            <div className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
              Insights help optimize your advertising strategy
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SpendDisplay;

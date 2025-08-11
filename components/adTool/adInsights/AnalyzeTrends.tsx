import React, { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  MinusCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataPoint {
  date: string;
  activeVersions: number;
}

interface AnalyzeTrendsProps {
  chartData: DataPoint[];
  periods?: number[];
}

interface TrendAnalysis {
  trend: string;
  changePercentage: number;
}

const DEFAULT_PERIODS = [7, 30, 0];

const AnalyzeTrends: React.FC<AnalyzeTrendsProps> = ({
  chartData,
  periods = DEFAULT_PERIODS,
}) => {
  const trendAnalyses = useMemo(() => {
    return periods.map((period) => ({
      period: period === 0 ? "All" : `${period}d`,
      analysis: analyzeTrendPeriod(chartData.slice(-period || undefined)),
    }));
  }, [chartData, periods]);

  return (
    <div className="flex justify-center gap-2">
      {trendAnalyses.map(({ period, analysis }) => (
        <TooltipProvider key={period}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex w-fit flex-row items-center justify-center overflow-hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-[#6566F1]/5 to-[#B977F8]/5 px-3 py-2 transition-colors hover:from-[#6566F1]/10 hover:to-[#B977F8]/10">
                <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                  {period}
                </span>
                <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-center gap-1">
                  <TrendIcon
                    trend={analysis.trend}
                    className={getTrendColor(analysis.trend)}
                    size={16}
                  />
                  <span
                    className={`text-xs font-semibold ${getTrendColor(
                      analysis.trend,
                    )} hidden truncate sm:inline`}
                  >
                    {getTrendFullName(analysis.trend)}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="flex flex-col gap-1.5 p-3">
              <div className="text-sm font-medium">
                {period === "All" ? "All Time" : `Last ${period} Days`}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Change:</span>
                <span
                  className={`text-sm font-semibold ${getTrendColor(
                    analysis.trend,
                  )}`}
                >
                  {analysis.changePercentage > 0 ? "+" : ""}
                  {analysis.changePercentage.toFixed(1)}%
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

function analyzeTrendPeriod(data: DataPoint[]): TrendAnalysis {
  if (data.length < 2) {
    return { trend: "No Data", changePercentage: 0 };
  }

  const values = data.map((point) => point.activeVersions);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const changePercentage = ((lastValue - firstValue) / firstValue) * 100;

  return { trend: getTrendName(changePercentage), changePercentage };
}

function getTrendName(changePercentage: number): string {
  if (changePercentage > 20) return "RapidGrowth";
  if (changePercentage > 5) return "Growth";
  if (changePercentage < -20) return "SharpDecline";
  if (changePercentage < -5) return "Decline";
  return "Stable";
}

function getTrendFullName(trend: string): string {
  switch (trend) {
    case "RapidGrowth":
      return "Rapid Growth";
    case "Growth":
      return "Growth";
    case "SharpDecline":
      return "Sharp Decline";
    case "Decline":
      return "Decline";
    case "Stable":
      return "Stable";
    default:
      return "No Data";
  }
}

function getTrendColor(trend: string): string {
  switch (trend) {
    case "RapidGrowth":
    case "Growth":
      return "text-emerald-500 dark:text-emerald-400";
    case "SharpDecline":
    case "Decline":
      return "text-rose-500 dark:text-rose-400";
    case "Stable":
      return "text-[#6566F1] dark:text-[#B977F8]";
    default:
      return "text-gray-400 dark:text-gray-500";
  }
}

const TrendIcon: React.FC<{
  trend: string;
  className?: string;
  size?: number;
}> = ({ trend, className = "", size = 20 }) => {
  const iconProps = {
    size,
    className,
    strokeWidth: 2.5,
  };

  switch (trend) {
    case "RapidGrowth":
      return <TrendingUp {...iconProps} />;
    case "Growth":
      return <ArrowUpRight {...iconProps} />;
    case "SharpDecline":
      return <TrendingDown {...iconProps} />;
    case "Decline":
      return <ArrowDownRight {...iconProps} />;
    case "Stable":
      return <ArrowRight {...iconProps} />;
    default:
      return <MinusCircle {...iconProps} />;
  }
};

export default AnalyzeTrends;

import React from "react";
import { Euro } from "lucide-react";

import { cn } from "@/lib/utils";

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
  // Calculate total spend: CPM * Total Reach / 1000
  const totalSpend = (cpm * totalReach) / 1000;

  // Format currency with proper euro formatting
  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format CPM with euro symbol
  const formatCPM = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  return (
    <div
      className={cn(
        // Modern card design with subtle shadows and borders (matching InsightItem)
        "group relative flex w-full cursor-pointer flex-col rounded-xl bg-white/80 p-4",
        "transition-all duration-300 ease-out hover:bg-white hover:shadow-lg hover:shadow-gray-200/50",
        "dark:bg-gray-900/60 dark:hover:bg-gray-900/80 dark:hover:shadow-gray-900/20",
        // Purple border styling
        "border-2 border-[#9C5FF5] hover:border-[#B977F8] dark:border-[#B977F8] dark:hover:border-[#C88AFA]",
        "backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]",
        "hover:shadow-[0_0_20px_rgba(156,95,245,0.15)]",
        className,
      )}
    >
      {/* Header with Euro Icon */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount Spent
        </span>
        <Euro className="h-5 w-5 text-[#9C5FF5] transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[#B977F8] dark:text-[#B977F8] dark:group-hover:text-[#C88AFA]" />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Primary Spend Display */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatEuro(totalSpend)}
          </div>
          {/* Secondary CPM Display */}
          <div className="dark:to-gray-750 inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 dark:border-gray-700/50 dark:from-gray-800">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              CPM:
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatCPM(cpm)}
            </span>
          </div>
        </div>
      </div>

      {/* Subtle hover indicator with purple tint */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-[#9C5FF5]/0 via-[#9C5FF5]/0 to-[#9C5FF5]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

export default SpendDisplay;

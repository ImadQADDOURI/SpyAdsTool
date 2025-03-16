import React from "react";
import {
  BadgeDollarSign,
  CircleDollarSign,
  DollarSign,
  Eye,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CPMDisplayProps {
  value: number;
  className?: string;
}

const CPMDisplay: React.FC<CPMDisplayProps> = ({ value, className }) => {
  const formattedValue = Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Determine size class based on value length
  const valueSize = formattedValue.length > 5 ? "text-xl" : "text-2xl";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              // 📐 Intrinsic Web Design - fill available space
              "group flex w-full cursor-default flex-col rounded-lg bg-gradient-to-br from-white to-gray-100/80 p-3 transition-all duration-200",
              "hover:shadow-md dark:from-gray-800/70 dark:to-gray-900/50 dark:hover:shadow-gray-900/20",
              "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
              className,
            )}
          >
            {/* Enhanced Header with Gradient Title and Interactive Icon */}
            <div className="flex flex-row items-center justify-between">
              <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-sm font-bold text-transparent">
                CPM Rate
              </span>

              <Eye
                className={cn(
                  "h-5 w-5 text-[#9C5FF5] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#B977F8]",
                )}
              />
            </div>

            {/* Value Display with Enhanced Styling */}
            <div className="mt-2 flex items-center justify-center rounded-lg bg-white/70 py-2 dark:bg-gray-800/30">
              <div className="flex items-center gap-1">
                <DollarSign className="h-6 w-6 text-[#8A70FA] dark:text-[#A37FF8]" />
                <span
                  className={cn(
                    "font-bold tracking-tight text-gray-900 dark:text-gray-100",
                    valueSize,
                  )}
                >
                  {formattedValue}
                </span>
              </div>
            </div>

            {/* Enhanced Subtitle */}
            <div className="mt-2 text-center">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Per 1k Impressions
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          <div className="space-y-1.5 p-1">
            <div className="text-sm font-medium">Cost Per Mille (CPM)</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Average cost per thousand ad impressions across all placements
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CPMDisplay;

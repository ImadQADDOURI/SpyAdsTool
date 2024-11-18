import React from "react";
import { DollarSign, Info } from "lucide-react";

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
              "group flex min-w-[160px] max-w-[160px] cursor-default flex-col rounded-lg bg-gray-100/50 p-2 transition-all duration-200",
              "hover:bg-gray-100/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70",
              className,
            )}
          >
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                CPM Rate
              </span>
              <Info className="h-3.5 w-3.5 text-gray-600 transition-colors group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
            </div>

            {/* Value Display */}
            <div className="mt-2 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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

            {/* Subtitle */}
            <div className="mt-1 text-center">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
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

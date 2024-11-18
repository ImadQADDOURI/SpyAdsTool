import React from "react";
import { ChevronRight, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InsightItemProps {
  label: string;
  value: string | string[] | number;
  description?: string;
  className?: string;
}

const InsightItem: React.FC<InsightItemProps> = ({
  label,
  value,
  description,
  className,
}) => {
  // Convert value to array and filter out empty strings
  const values = Array.isArray(value)
    ? value.filter(Boolean)
    : [String(value)].filter(Boolean);

  const hasMore = values.length > 2;
  const displayValues = values.slice(0, 2);
  const remainingCount = values.length - 2;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "group relative flex min-w-[160px] cursor-default flex-col rounded-lg bg-gray-100/50 p-2",
              "transition-all duration-200 hover:bg-gray-100/70 hover:shadow-sm",
              "dark:bg-gray-800/50 dark:hover:bg-gray-800/70",
              "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
              className,
            )}
          >
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {label}
              </span>
              <Info className="h-3.5 w-3.5 text-gray-600 transition-colors group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
            </div>

            {/* Values Display */}
            <div className="mt-2 flex-1 space-y-1">
              {displayValues.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 transition-colors group-hover:text-gray-900 dark:group-hover:text-gray-100"
                >
                  <ChevronRight className="h-3 w-3 text-gray-400/80 transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                  <span className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {item}
                  </span>
                </div>
              ))}

              {hasMore && (
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 opacity-0" />
                  <span className="text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
                    +{remainingCount} more
                  </span>
                </div>
              )}

              {/* Empty State */}
              {values.length === 0 && (
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-gray-400/80" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Not specified
                  </span>
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          <div className="space-y-2 p-1">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">{label}</div>
              {description && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </div>
              )}
            </div>
            <div className="space-y-1">
              {values.length > 0 ? (
                values.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InsightItem;

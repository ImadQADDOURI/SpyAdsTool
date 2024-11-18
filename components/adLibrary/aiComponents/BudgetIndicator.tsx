import React from "react";
import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BudgetIndicatorProps {
  budget: string;
}

const BudgetIndicator: React.FC<BudgetIndicatorProps> = ({ budget }) => {
  const getBudgetInfo = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return {
          progress: 33,
          color: "#4ade80",
          description:
            "Conservative budget suitable for testing and small campaigns",
        };
      case "medium":
        return {
          progress: 66,
          color: "#fbbf24",
          description: "Balanced budget for established market presence",
        };
      case "high":
        return {
          progress: 100,
          color: "#f87171",
          description: "Aggressive budget for market dominance",
        };
      default:
        return {
          progress: 0,
          color: "#94a3b8",
          description: "Budget level not specified",
        };
    }
  };

  const budgetInfo = getBudgetInfo(budget);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex min-w-[160px] max-w-[160px] cursor-default flex-col rounded-lg bg-gray-100/50 p-2 dark:bg-gray-800/50">
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Budget Level
              </span>
              <Info className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            </div>

            {/* Progress Bar Container */}
            <div className="mt-2 space-y-2">
              {/* Budget Label */}
              <div className="flex justify-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {budget || "Not Specified"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${budgetInfo.progress}%`,
                    backgroundColor: budgetInfo.color,
                  }}
                />
              </div>

              {/* Tick Marks */}
              <div className="relative flex justify-between px-0.5 pt-1">
                <div className="h-1 w-0.5 bg-gray-300 dark:bg-gray-600" />
                <div className="h-1 w-0.5 bg-gray-300 dark:bg-gray-600" />
                <div className="h-1 w-0.5 bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* Labels */}
              <div className="flex justify-between px-0.5">
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Low
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Med
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  High
                </span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          <div className="space-y-1.5 p-1 text-sm">
            <div className="font-medium">Budget Analysis</div>
            <div className="text-xs">{budgetInfo.description}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BudgetIndicator;

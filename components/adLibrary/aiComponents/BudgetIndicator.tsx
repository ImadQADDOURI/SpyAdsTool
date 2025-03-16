import React from "react";
import { CreditCard, DollarSign, Info, PiggyBank, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BudgetIndicatorProps {
  budget: string;
  className?: string;
}

const BudgetIndicator: React.FC<BudgetIndicatorProps> = ({
  budget,
  className,
}) => {
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
          <div
            className={cn(
              // 📐 Intrinsic Web Design - fill available space
              "flex w-full cursor-default flex-col rounded-lg bg-gradient-to-br from-white to-gray-100/80 p-3 transition-all duration-200",
              "hover:shadow-md dark:from-gray-800/70 dark:to-gray-900/50 dark:hover:shadow-gray-900/20",
              "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
              className,
            )}
          >
            {/* Enhanced Header with Gradient Title and Interactive Icon */}
            <div className="flex flex-row items-center justify-between">
              <span className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-sm font-bold text-transparent">
                Budget Level
              </span>

              <DollarSign
                className={cn(
                  "h-5 w-5 text-[#9C5FF5] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#B977F8]",
                )}
              />
            </div>
            {/* Progress Bar Container with enhanced styling */}
            <div className="mt-3 space-y-3">
              {/* Budget Label with card-like background */}
              <div className="flex justify-center rounded-lg bg-white/70 py-2 dark:bg-gray-800/30">
                <span
                  className="text-lg font-bold tracking-wide"
                  style={{ color: budgetInfo.color }}
                >
                  {budget || "Not Specified"}
                </span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full shadow-inner transition-all duration-500 ease-out"
                  style={{
                    width: `${budgetInfo.progress}%`,
                    backgroundColor: budgetInfo.color,
                  }}
                />
              </div>

              {/* Enhanced Tick Marks and Labels */}
              <div className="flex justify-between px-1 pt-1">
                <div className="flex flex-col items-center">
                  <div className="h-1.5 w-1 bg-gray-300 dark:bg-gray-600" />
                  <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Low
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-1.5 w-1 bg-gray-300 dark:bg-gray-600" />
                  <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Med
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-1.5 w-1 bg-gray-300 dark:bg-gray-600" />
                  <span className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    High
                  </span>
                </div>
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

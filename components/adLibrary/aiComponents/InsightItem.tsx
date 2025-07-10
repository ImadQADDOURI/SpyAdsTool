import React, { useState } from "react";
import { Check, Copy, Info, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InsightItemProps {
  label: string;
  value: string | string[] | number;
  description?: string;
  className?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

const InsightItem: React.FC<InsightItemProps> = ({
  label,
  value,
  description,
  className,
  icon: IconComponent = Info,
  iconClassName,
}) => {
  // State to manage copy button appearance
  const [copied, setCopied] = useState(false);

  // Convert value to array and filter out empty strings
  const values = Array.isArray(value)
    ? value.filter(Boolean)
    : [String(value)].filter(Boolean);

  const hasMultipleValues = values.length > 1;
  const firstValue = values[0];
  const remainingCount = values.length - 1;

  // Function to copy values to clipboard
  const handleCopy = () => {
    const textToCopy = values.join(", ");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            // Modern card design with subtle shadows and borders - responsive
            "group relative flex w-full cursor-pointer flex-col rounded-xl bg-white/80",
            "p-3 sm:p-4 md:p-5", // Responsive padding
            "transition-all duration-300 ease-out hover:bg-white hover:shadow-lg hover:shadow-gray-200/50",
            "dark:bg-gray-900/60 dark:hover:bg-gray-900/80 dark:hover:shadow-gray-900/20",
            "border border-gray-200/40 hover:border-gray-300/60 dark:border-gray-700/40 dark:hover:border-gray-600/60",
            "backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]",
            "min-w-0", // Prevent flex item from overflowing
            className,
          )}
        >
          {/* Clean Header with Icon - responsive */}
          <div className="mb-2 flex min-w-0 items-center justify-between gap-2 sm:mb-3">
            <span className="flex-1 truncate text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
              {label}
            </span>
            <IconComponent
              className={cn(
                "h-4 w-4 flex-shrink-0 text-violet-500 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-violet-600 dark:text-violet-400 dark:group-hover:text-violet-300 sm:h-5 sm:w-5",
                iconClassName,
              )}
            />
          </div>

          {/* Value Display - responsive */}
          <div className="min-w-0 flex-1">
            {values.length > 0 ? (
              <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="dark:to-gray-750 inline-flex min-w-0 flex-1 items-center gap-1 rounded-full border border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-1.5 dark:border-gray-700/50 dark:from-gray-800 sm:gap-2 sm:px-3 sm:py-2">
                  <span className="min-w-0 truncate text-xs font-semibold text-gray-800 dark:text-gray-200 sm:text-sm">
                    {firstValue}
                  </span>
                </div>
                {hasMultipleValues && (
                  <span className="inline-flex h-4 flex-shrink-0 items-center justify-center rounded-full border border-violet-200/50 bg-violet-100 px-1.5 text-xs font-medium text-violet-700 dark:border-violet-700/50 dark:bg-violet-900/50 dark:text-violet-300 sm:h-5 sm:px-2">
                    +{remainingCount}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 rounded-full border border-gray-200/30 bg-gray-50/50 px-2 py-1.5 dark:border-gray-700/30 dark:bg-gray-800/30 sm:gap-2 sm:px-3 sm:py-2">
                <span className="text-xs italic text-gray-500 dark:text-gray-400 sm:text-sm">
                  Not specified
                </span>
              </div>
            )}
          </div>

          {/* Subtle hover indicator */}
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        className="w-[280px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border-0 bg-white/95 p-0 shadow-xl backdrop-blur-md dark:bg-gray-900/95 sm:w-[320px] md:w-[360px]"
      >
        <div className="space-y-3 p-3 sm:p-4">
          {/* Header - responsive */}
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="flex-1 truncate text-xs font-semibold text-gray-800 dark:text-gray-200 sm:text-sm">
              {label}
            </div>
            {values.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 flex-shrink-0 rounded-full p-0 transition-colors hover:bg-violet-50 dark:hover:bg-violet-900/20 sm:h-7 sm:w-7"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500 sm:h-3.5 sm:w-3.5" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-600 dark:text-gray-400 sm:h-3.5 sm:w-3.5" />
                )}
              </Button>
            )}
          </div>

          {/* Description - responsive */}
          {description && (
            <div className="break-words text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {description}
            </div>
          )}

          {/* All Values - responsive */}
          <div className="min-w-0 space-y-2">
            {values.length > 0 ? (
              <div className="max-h-32 space-y-1.5 overflow-y-auto sm:max-h-40">
                {values.map((item, index) => (
                  <div
                    key={index}
                    className="flex min-w-0 items-start gap-2 rounded-lg border border-gray-200/30 bg-gray-50/50 p-2 dark:border-gray-700/30 dark:bg-gray-800/30"
                  >
                    <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400 dark:bg-violet-500" />
                    <span className="min-w-0 flex-1 break-words text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InsightItem;

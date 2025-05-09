import React, { useState } from "react";
import { Check, ChevronRight, Copy, Info, LucideIcon } from "lucide-react";

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
  icon?: LucideIcon; // 👈 prop for custom icon
  iconClassName?: string; // 👈 Optional styling for the icon
}

const InsightItem: React.FC<InsightItemProps> = ({
  label,
  value,
  description,
  className,
  icon: IconComponent = Info, // 🪄 Default to Info icon if none provided
  iconClassName,
}) => {
  // State to manage copy button appearance
  const [copied, setCopied] = useState(false);

  // Convert value to array and filter out empty strings
  const values = Array.isArray(value)
    ? value.filter(Boolean)
    : [String(value)].filter(Boolean);

  const hasMore = values.length > 2;
  const displayValues = values.slice(0, 2);
  const remainingCount = values.length - 2;

  // Function to copy values to clipboard
  const handleCopy = () => {
    const textToCopy = values.join(", ");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            // 📐 Intrinsic design - fill available space with no fixed width
            "group relative flex w-full cursor-default flex-col rounded-lg bg-gray-100/50 p-3",
            "transition-all duration-200 hover:bg-gray-100/70 hover:shadow-sm",
            "dark:bg-gray-800/50 dark:hover:bg-gray-800/70",
            "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
            className,
          )}
        >
          {/* Enhanced Header with Gradient Title and Interactive Icon */}
          <div className="flex flex-row items-center justify-between">
            <span className="text-md font-semibold text-gray-600 dark:text-gray-300">
              {label}
            </span>

            <IconComponent
              className={cn(
                "h-5 w-5 text-[#9C5FF5] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#B977F8]",
                iconClassName,
              )}
            />
          </div>

          <div className="mt-1 flex-1 space-y-1">
            {displayValues.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 truncate rounded-md bg-white px-2 py-1 text-xs font-semibold transition-colors group-hover:text-gray-900 dark:bg-gray-900 dark:group-hover:text-gray-100"
              >
                <ChevronRight className="h-3 w-3 text-gray-400/80 transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                <span>{item}</span>
              </div>
            ))}
            {hasMore && (
              <div className="flex items-center gap-1 px-2">
                <ChevronRight className="h-3 w-3 opacity-0" />
                <span className="text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
                  +{remainingCount} more
                </span>
              </div>
            )}
            {values.length === 0 && (
              <div className="flex items-center gap-1 rounded-md bg-white/50 px-2 py-1 text-xs italic text-gray-500 dark:bg-gray-900/30 dark:text-gray-400">
                <ChevronRight className="h-3 w-3 text-gray-400/80" />
                <span>Not specified</span>
              </div>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="max-w-xs p-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{label}</div>
            {values.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {description && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
          <div className="space-y-1">
            {values.length > 0 ? (
              values.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
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
      </PopoverContent>
    </Popover>
  );
};

export default InsightItem;

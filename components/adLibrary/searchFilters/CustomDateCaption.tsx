"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDayPicker, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 🎯 CustomDateCaption - Enhanced calendar navigation with intuitive controls
 *
 * Provides a clean, single-row interface with:
 * - Year selector (left)
 * - Month selector (center)
 * - Navigation buttons (right)
 *
 * Features:
 * - Quick month and year selection via dropdowns
 * - Smart boundary detection (fromDate/toDate)
 * - Keyboard accessible
 * - Optimized for mobile and desktop
 */
export function CustomDateCaption(props: React.HTMLAttributes<HTMLDivElement>) {
  const { goToMonth, currentMonth } = useNavigation();
  const { locale, formatters, fromDate, toDate } = useDayPicker();

  // 📅 Get available years based on fromDate/toDate constraints
  const startYear = fromDate?.getFullYear() || 2018;
  const endYear = toDate?.getFullYear() || new Date().getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  ).reverse(); // ⬆️ Most recent years first

  // 📅 Array of month names
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      value: i.toString(),
      label: date.toLocaleString(locale?.code ?? "en-US", { month: "long" }),
    };
  });

  // 🛡️ Check if navigation buttons should be disabled
  const isMinMonth =
    fromDate &&
    currentMonth.getMonth() === fromDate.getMonth() &&
    currentMonth.getFullYear() === fromDate.getFullYear();
  const isMaxMonth =
    toDate &&
    currentMonth.getMonth() === toDate.getMonth() &&
    currentMonth.getFullYear() === toDate.getFullYear();

  // 🎯 Handle year selection
  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);

    // 🔒 Handle edge cases with fromDate/toDate constraints
    if (fromDate && newDate < fromDate) {
      newDate.setMonth(fromDate.getMonth());
      newDate.setDate(fromDate.getDate());
    } else if (toDate && newDate > toDate) {
      newDate.setMonth(toDate.getMonth());
      newDate.setDate(toDate.getDate());
    }

    goToMonth(newDate);
  };

  // 🎯 Handle month selection
  const handleMonthChange = (monthStr: string) => {
    const month = parseInt(monthStr, 10);
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);

    // 🔒 Handle edge cases with fromDate/toDate constraints
    const year = newDate.getFullYear();

    if (
      fromDate &&
      year === fromDate.getFullYear() &&
      month < fromDate.getMonth()
    ) {
      newDate.setDate(fromDate.getDate());
      newDate.setMonth(fromDate.getMonth());
    }

    if (toDate && year === toDate.getFullYear() && month > toDate.getMonth()) {
      newDate.setDate(toDate.getDate());
      newDate.setMonth(toDate.getMonth());
    }

    goToMonth(newDate);
  };

  // 🧭 Navigate to previous month
  const handlePreviousClick = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    goToMonth(previousMonth);
  };

  // 🧭 Navigate to next month
  const handleNextClick = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    goToMonth(nextMonth);
  };

  // 🔄 Check if a specific month should be disabled based on fromDate/toDate
  const isMonthDisabled = (month: number) => {
    if (!fromDate && !toDate) return false;

    const currentYear = currentMonth.getFullYear();

    if (
      fromDate &&
      currentYear === fromDate.getFullYear() &&
      month < fromDate.getMonth()
    ) {
      return true;
    }

    if (
      toDate &&
      currentYear === toDate.getFullYear() &&
      month > toDate.getMonth()
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className={cn("flex flex-col space-y-1", props.className)}>
      <div className="flex w-full items-center space-x-2 px-2">
        <div className="w-1/3">
          {/* Year selector */}
          <Select
            value={currentMonth.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-7 w-full border-none px-2 text-xs focus:ring-1 focus:ring-offset-0">
              <SelectValue placeholder={currentMonth.getFullYear()} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-xs"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          {/* Month selector */}
          <Select
            value={currentMonth.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-7 w-full border-none px-2 text-xs focus:ring-1 focus:ring-offset-0">
              <SelectValue
                placeholder={months[currentMonth.getMonth()].label}
              />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {months.map((month) => (
                <SelectItem
                  key={month.value}
                  value={month.value}
                  className="text-xs"
                  disabled={isMonthDisabled(parseInt(month.value, 10))}
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-1/3 justify-end">
          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-offset-0"
              disabled={isMinMonth}
              onClick={handlePreviousClick}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-offset-0"
              disabled={isMaxMonth}
              onClick={handleNextClick}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Display current month-year label to help with context */}
      {/* <div className="pt-1 text-center text-xs font-medium text-muted-foreground">
            {formatters.formatCaption(currentMonth, { locale })}
        </div> */}
    </div>
  );
}

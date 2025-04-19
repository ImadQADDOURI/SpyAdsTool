// @/components\adLibrary\searchFilters\startDate.tsx

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { Calendar, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const MIN_DATE = "2018-05-07";

export const StartDate: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDate = searchParams.get("start_date") || null;
  const endDate = searchParams.get("end_date") || null;
  const today = new Date().toISOString().split("T")[0];

  // 📅 Date change handler
  const handleDateChange = React.useCallback(
    (newDate: string | null) => {
      if (!newDate) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("start_date");
        router.push(`?${params.toString()}`, { scroll: false });
        setOpen(false);
        return;
      }

      // Validate date is not in the future
      if (new Date(newDate) > new Date(today)) {
        toast.warning("Start date cannot be in the future");
        return;
      }

      // Validate against endDate if it exists
      // Since endDate is stored as the day after, we need to subtract a day for comparison
      if (endDate) {
        const actualEndDate = addDays(new Date(endDate), -1);
        if (new Date(newDate) > actualEndDate) {
          toast.warning("Start date must be before end date");
          return;
        }
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("start_date", newDate);
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, endDate, today],
  );

  // 🧹 Clear date handler
  const clearDate = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("start_date");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 📝 Format display date
  const displayDate = React.useMemo(() => {
    if (!selectedDate) return "mm/dd/yyyy";
    return format(new Date(selectedDate), "MMM d, yyyy");
  }, [selectedDate]);

  // Calculate maximum selectable date
  const maxSelectableDate = React.useMemo(() => {
    if (endDate) {
      // Subtract one day from endDate because endDate is stored as day+1
      return addDays(new Date(endDate), -1).toISOString().split("T")[0];
    }
    return today;
  }, [endDate, today]);

  return (
    <div className="w-full max-w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <div className="flex max-w-full items-center">
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-0 flex-1 justify-between transition-all",
                selectedDate && "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate">{displayDate}</span>
              </div>
              {!selectedDate && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              )}
            </Button>
          </DropdownMenuTrigger>

          {/* ❌ Clear selection button as half-circle extension */}
          {selectedDate && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearDate}
              aria-label="Clear date selection"
              className="h-10 flex-shrink-0 rounded-l-none rounded-r-full border-l-0 bg-background px-2 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          )}
        </div>

        <DropdownMenuContent className="w-[280px] p-0" align="start">
          <div className="p-3">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="start-date-picker"
                    className="text-sm font-medium"
                  >
                    Select Start Date
                  </label>
                  <input
                    id="start-date-picker"
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => handleDateChange(e.target.value || null)}
                    min={MIN_DATE}
                    max={maxSelectableDate}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => handleDateChange(today)}
                  >
                    <span className="truncate">Today</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() - 7);
                      handleDateChange(date.toISOString().split("T")[0]);
                    }}
                  >
                    <span className="truncate">Last 7 days</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() - 30);
                      handleDateChange(date.toISOString().split("T")[0]);
                    }}
                  >
                    <span className="truncate">Last 30 days</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const date = new Date();
                      date.setDate(1);
                      handleDateChange(date.toISOString().split("T")[0]);
                    }}
                  >
                    <span className="truncate">Start of month</span>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StartDate;

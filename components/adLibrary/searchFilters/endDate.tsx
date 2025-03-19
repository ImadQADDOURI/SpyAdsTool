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

export const EndDate: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDate = searchParams.get("end_date") || null;
  const startDate = searchParams.get("start_date") || null;
  const today = new Date().toISOString().split("T")[0];

  // 📅 Date change handler
  const handleDateChange = React.useCallback(
    (newDate: string | null) => {
      if (!newDate) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("end_date");
        router.push(`?${params.toString()}`, { scroll: false });
        setOpen(false);
        return;
      }

      // Validate against startDate
      if (startDate && new Date(newDate) < new Date(startDate)) {
        toast.warning("End date must be after start date");
        return;
      }

      // Validate against today
      if (new Date(newDate) > new Date(today)) {
        toast.warning("End date cannot be in the future");
        return;
      }

      // Add one day to the selected date for inclusive range
      const nextDay = addDays(new Date(newDate), 1).toISOString().split("T")[0];

      const params = new URLSearchParams(searchParams.toString());
      params.set("end_date", nextDay);
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, startDate, today],
  );

  // 🧹 Clear date handler
  const clearDate = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("end_date");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 📝 Format display date
  const displayDate = React.useMemo(() => {
    if (!selectedDate) return "Select end date";

    // Display date is one day before the actual stored date (because we add a day)
    const displayDate = addDays(new Date(selectedDate), -1);
    return format(displayDate, "MMM d, yyyy");
  }, [selectedDate]);

  // Determine minimum selectable date
  const minSelectableDate = React.useMemo(() => {
    return startDate || MIN_DATE;
  }, [startDate]);

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
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
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
                    htmlFor="end-date-picker"
                    className="text-sm font-medium"
                  >
                    Select End Date
                  </label>
                  <input
                    id="end-date-picker"
                    type="date"
                    // When displaying in the picker, use one day before the stored value
                    value={
                      selectedDate
                        ? addDays(new Date(selectedDate), -1)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleDateChange(e.target.value || null)}
                    min={minSelectableDate}
                    max={today}
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
                      const dateStr = date.toISOString().split("T")[0];
                      handleDateChange(dateStr);
                    }}
                  >
                    <span className="truncate">Last 7 days</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - 1);
                      date.setDate(date.getDate() + 1);
                      const dateStr = date.toISOString().split("T")[0];
                      handleDateChange(dateStr);
                    }}
                  >
                    <span className="truncate">Last 30 days</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const date = new Date();
                      date.setDate(0); // Last day of previous month
                      const dateStr = date.toISOString().split("T")[0];
                      handleDateChange(dateStr);
                    }}
                  >
                    <span className="truncate">End of last month</span>
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

export default EndDate;

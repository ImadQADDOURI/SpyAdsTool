"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  CircleCheck,
  CircleDot,
  CircleX,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const statuses = [
  { value: "ALL", label: "Active and Inactive", icon: CircleDot },
  { value: "ACTIVE", label: "Active", icon: CircleCheck },
  { value: "INACTIVE", label: "Inactive", icon: CircleX },
];

export const Status: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();

  // 📌 Selected status from URL params
  const selectedStatus = React.useMemo(
    () => searchParams.get("active_status") || "ALL",
    [searchParams],
  );

  // 🎯 Selection handler
  const handleSelect = React.useCallback(
    (statusValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedStatus === statusValue) {
        params.delete("active_status");
        params.set("active_status", "ALL"); // Default to ALL when deselecting
      } else {
        params.set("active_status", statusValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, selectedStatus],
  );

  // 🧹 Clear selection handler
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.set("active_status", "ALL"); // Reset to default
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 📝 Selected option with icon and label
  const selectedOption = React.useMemo(() => {
    return (
      statuses.find((status) => status.value === selectedStatus) || statuses[0]
    );
  }, [selectedStatus]);

  // 🔍 Check if status is not default
  const hasCustomSelection = selectedStatus !== "ALL";

  return (
    <div className="w-full max-w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <div className="flex max-w-full items-center">
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "min-w-0 flex-1 justify-between transition-all",
                hasCustomSelection && "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex items-center truncate">
                  <selectedOption.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{selectedOption.label}</span>
                </div>
              </div>
              {!hasCustomSelection && (
                <ChevronDown
                  className={cn(
                    "ml-2 h-4 w-4 flex-shrink-0 opacity-50 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              )}
            </Button>
          </DropdownMenuTrigger>

          {/* ❌ Clear selection button as half-circle extension */}
          {hasCustomSelection && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClear}
              aria-label="Reset to default status filter"
              className="h-10 flex-shrink-0 rounded-l-none rounded-r-full border-l-0 bg-background px-2 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          )}
        </div>

        <DropdownMenuContent
          className="w-[250px] max-w-[calc(100vw-2rem)] p-0"
          align="start"
        >
          <ScrollArea className="max-h-[40vh]">
            <div className="py-2">
              {statuses.map((status) => (
                <Button
                  key={status.value}
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
                  onClick={() => handleSelect(status.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      selectedStatus === status.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <status.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{status.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Status;

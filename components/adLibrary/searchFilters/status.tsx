"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronsUpDown,
  CircleCheck,
  CircleDot,
  CircleSlash,
  CircleX,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const statuses = [
  { value: "ALL", label: "Active and Inactive", icon: CircleDot },
  { value: "ACTIVE", label: "Active", icon: CircleCheck },
  { value: "INACTIVE", label: "Inactive", icon: CircleX },
];

export const Status: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStatus = React.useMemo(
    () => searchParams.get("active_status") || "ALL",
    [searchParams],
  );

  const handleSelect = React.useCallback(
    (statusValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedStatus === statusValue) {
        params.delete("active_status");
      } else {
        params.set("active_status", statusValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, selectedStatus],
  );

  const selectedOption = React.useMemo(() => {
    return (
      statuses.find((status) => status.value === selectedStatus) || statuses[1]
    );
  }, [selectedStatus]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex items-center truncate">
              <selectedOption.icon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{selectedOption.label}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {statuses.map((status) => (
            <Button
              key={status.value}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect(status.value)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 flex-shrink-0",
                  selectedStatus === status.value ? "opacity-100" : "opacity-0",
                )}
              />
              <status.icon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{status.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Status;

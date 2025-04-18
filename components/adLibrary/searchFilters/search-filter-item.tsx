// @search-filter-item.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { FilterConfig } from "./filter-config";

interface SearchFilterItemProps {
  filter: FilterConfig;
  value: any;
  onChange: (value: any) => void;
  onClear: () => void;
}

export function SearchFilterItem({
  filter,
  value,
  onChange,
  onClear,
}: SearchFilterItemProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateOpen, setDateOpen] = useState(false);

  // 🎨 Determine if filter has a value
  const hasValue =
    value !== null && (Array.isArray(value) ? value.length > 0 : value !== "");

  // 🔍 Filter options based on search
  const filteredOptions = filter.options
    ? filter.options.filter(
        (option) =>
          option.label.toLowerCase().includes(search.toLowerCase()) ||
          option.value.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  // 📝 Get display value for the dropdown trigger
  const getDisplayValue = () => {
    if (!hasValue) return filter.label;

    if (filter.key === "startDate" || filter.key === "endDate") {
      return `${filter.label}: ${format(new Date(value), "MMM d, yyyy")}`;
    }

    if (Array.isArray(value)) {
      if (value.length === 1) {
        const option = filter.options?.find((o) => o.value === value[0]);
        return `${filter.label}: ${option?.label || value[0]}`;
      }
      return `${filter.label}: ${value.length} selected`;
    }

    const option = filter.options?.find((o) => o.value === value);
    return `${filter.label}: ${option?.label || value}`;
  };

  // Handle date filters
  if (filter.key === "startDate" || filter.key === "endDate") {
    return (
      <div className="relative">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between text-left font-normal",
                hasValue
                  ? "border-purple-300 text-foreground dark:border-purple-700"
                  : "text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {filter.icon && filter.icon.startsWith("/") ? (
                  <Image
                    src={filter.icon || "/placeholder.svg"}
                    alt={filter.label}
                    width={16}
                    height={16}
                  />
                ) : null}
                <span className="truncate">
                  {value
                    ? `${filter.label}: ${format(new Date(value), "MMM d, yyyy")}`
                    : filter.label}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                onChange(date ? format(date, "yyyy-MM-dd") : null);
                setDateOpen(false);
              }}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear button */}
        {hasValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute -right-3 -top-3 h-6 w-6 rounded-full border bg-muted shadow-sm transition-colors hover:bg-muted-foreground hover:text-white"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear {filter.label}</span>
          </Button>
        )}
      </div>
    );
  }

  // Handle other filters with dropdown
  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal transition-all",
              hasValue
                ? "border-purple-300 text-foreground dark:border-purple-700"
                : "text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {/* Filter icon */}
              {filter.icon && filter.icon.startsWith("/") ? (
                <Image
                  src={filter.icon || "/placeholder.svg"}
                  alt={filter.label}
                  width={16}
                  height={16}
                />
              ) : null}

              <span className="truncate">{getDisplayValue()}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[220px] p-2"
          sideOffset={4}
        >
          {/* Search input */}
          <div className="mb-2 flex items-center rounded-md border px-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${filter.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <DropdownMenuSeparator />

          {/* Options */}
          {filteredOptions.length === 0 ? (
            <div className="py-2 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = Array.isArray(value)
                ? value.includes(option.value)
                : value === option.value;

              return filter.multiSelect ? (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isSelected}
                  onCheckedChange={() => {
                    if (Array.isArray(value)) {
                      const newValue = isSelected
                        ? value.filter((v) => v !== option.value)
                        : [...value, option.value];
                      onChange(newValue.length ? newValue : null);
                    } else {
                      onChange(isSelected ? null : [option.value]);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Icon if available */}
                  {option.icon && typeof option.icon === "string" ? (
                    <Image
                      src={option.icon || "/placeholder.svg"}
                      alt={option.label}
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                  ) : option.icon ? (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : null}

                  {option.label}
                </DropdownMenuCheckboxItem>
              ) : (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => {
                    onChange(isSelected ? null : option.value);
                    if (!filter.multiSelect) setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Icon if available */}
                  {option.icon && typeof option.icon === "string" ? (
                    <Image
                      src={option.icon || "/placeholder.svg"}
                      alt={option.label}
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                  ) : option.icon ? (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : null}

                  {option.label}

                  {/* Checkmark for selected items */}
                  {isSelected && (
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear button */}
      {hasValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute -right-3 -top-3 h-6 w-6 rounded-full border bg-muted shadow-sm transition-colors hover:bg-muted-foreground hover:text-white"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear {filter.label}</span>
        </Button>
      )}
    </div>
  );
}

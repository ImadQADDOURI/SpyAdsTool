"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { CustomDateCaption } from "./CustomDateCaption";
import type { FilterConfig } from "./filter-config";
import { useSearchFilters } from "./search-filter-context";

interface SearchFilterItemProps {
  filter: FilterConfig;
  onEnterPress?: () => void;
}

export function SearchFilterItem({
  filter,
  onEnterPress,
}: SearchFilterItemProps) {
  const { getValue, setValue, clearValue, subscribe } = useSearchFilters();

  // Local state for UI interactions only
  const [currentValue, setCurrentValue] = useState(() => getValue(filter.key));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to value changes for this specific filter
  useEffect(() => {
    const unsubscribe = subscribe(filter.key, setCurrentValue);
    return unsubscribe;
  }, [filter.key, subscribe]);

  // Computed values
  const hasValue = useMemo(
    () =>
      currentValue !== null &&
      (Array.isArray(currentValue)
        ? currentValue.length > 0
        : currentValue !== ""),
    [currentValue],
  );

  const displayText = useMemo(() => {
    if (!hasValue) return filter.label;

    if (filter.key === "startDate" || filter.key === "endDate") {
      return `${filter.label}: ${format(new Date(currentValue), "MMM d, yyyy")}`;
    }

    if (Array.isArray(currentValue)) {
      if (currentValue.length === 1) {
        const option = filter.options?.find((o) => o.value === currentValue[0]);
        return `${filter.label}: ${option?.label || currentValue[0]}`;
      }
      return `${filter.label}: ${currentValue.length} selected`;
    }

    const option = filter.options?.find((o) => o.value === currentValue);
    return `${filter.label}: ${option?.label || currentValue}`;
  }, [filter, currentValue, hasValue]);

  const filteredOptions = useMemo(() => {
    if (!filter.options || !searchQuery) return filter.options || [];

    const query = searchQuery.toLowerCase();
    return filter.options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query),
    );
  }, [filter.options, searchQuery]);

  // Event handlers
  const handleValueChange = useCallback(
    (value: any) => {
      setValue(filter.key, value);
    },
    [filter.key, setValue],
  );

  const handleClearValue = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      clearValue(filter.key);
      if (inputRef.current && filter.type === "search") {
        inputRef.current.value = "";
      }
    },
    [filter.key, filter.type, clearValue],
  );

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      if (filter.multiSelect) {
        const isSelected = Array.isArray(currentValue)
          ? currentValue.includes(optionValue)
          : false;
        const newValue = Array.isArray(currentValue)
          ? isSelected
            ? currentValue.filter((v) => v !== optionValue)
            : [...currentValue, optionValue]
          : isSelected
            ? []
            : [optionValue];
        handleValueChange(newValue.length ? newValue : null);
      } else {
        const isSelected = currentValue === optionValue;
        handleValueChange(isSelected ? null : optionValue);
        setIsDropdownOpen(false);
      }
    },
    [filter.multiSelect, currentValue, handleValueChange],
  );

  // Search input type
  if (filter.type === "search") {
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={
            filter.placeholder || `Search ${filter.label.toLowerCase()}...`
          }
          defaultValue={currentValue || ""}
          onChange={(e) => handleValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnterPress) {
              e.preventDefault();
              onEnterPress();
            }
          }}
          className={cn(
            "h-11 w-full rounded-lg border pl-10 pr-10 transition-colors",
            hasValue
              ? "border-purple-300 bg-purple-50/50 text-foreground dark:border-purple-700 dark:bg-purple-900/20"
              : "border-slate-300 hover:border-slate-400 focus:border-purple-500",
          )}
        />
        {hasValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearValue}
            className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Date picker type
  if (filter.key === "startDate" || filter.key === "endDate") {
    return (
      <div className="relative">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between text-left font-normal",
                hasValue
                  ? "border-purple-300 bg-purple-50/50 text-foreground dark:border-purple-700 dark:bg-purple-900/20"
                  : "text-muted-foreground",
              )}
              aria-label={`Select ${filter.label}`}
            >
              <span className="truncate">{displayText}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentValue ? new Date(currentValue) : undefined}
              onSelect={(date) => {
                handleValueChange(date ? format(date, "yyyy-MM-dd") : null);
                setIsDropdownOpen(false);
              }}
              fromDate={new Date("2018-05-07")}
              toDate={new Date()}
              disabled={(date) => date > new Date()}
              components={{ Caption: CustomDateCaption }}
              initialFocus
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {hasValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearValue}
            className="absolute -right-3 -top-3 h-6 w-6 rounded-full border bg-white shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label={`Clear ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Regular dropdown type
  return (
    <div className="relative">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              hasValue
                ? "border-purple-300 bg-purple-50/50 text-foreground dark:border-purple-700 dark:bg-purple-900/20"
                : "text-muted-foreground",
            )}
            aria-label={`Select ${filter.label}`}
          >
            <div className="flex items-center gap-2 truncate">
              {filter.icon && filter.icon.startsWith("/") && (
                <Image
                  src={filter.icon || "/placeholder.svg"}
                  alt=""
                  width={20}
                  height={20}
                  className={cn(
                    "flex-shrink-0",
                    hasValue ? "opacity-100" : "opacity-60",
                  )}
                />
              )}
              <span className="truncate">{displayText}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[220px] p-2">
          {/* Search input for large option lists */}
          {filter.options && filter.options.length > 5 && (
            <div className="mb-2 flex items-center rounded-md border px-2">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 border-0 p-0 focus-visible:ring-0"
              />
            </div>
          )}

          {/* Options list */}
          <div className="max-h-[200px] overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = Array.isArray(currentValue)
                  ? currentValue.includes(option.value)
                  : currentValue === option.value;

                return (
                  <div
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent",
                      isSelected && "bg-accent/40",
                    )}
                    onClick={() => handleOptionSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {filter.multiSelect && (
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    )}

                    {option.icon && typeof option.icon === "string" ? (
                      <Image
                        src={option.icon || "/placeholder.svg"}
                        alt=""
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                      />
                    ) : option.icon ? (
                      <option.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    ) : null}

                    <span className="flex-1 truncate">{option.label}</span>

                    {isSelected && !filter.multiSelect && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Multi-select summary */}
          {filter.multiSelect &&
            Array.isArray(currentValue) &&
            currentValue.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground">
                  <span>
                    {currentValue.length} item
                    {currentValue.length !== 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-blue-500 hover:text-blue-700"
                    onClick={handleClearValue}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearValue}
          className="absolute -right-3 -top-3 h-6 w-6 rounded-full border bg-white shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          aria-label={`Clear ${filter.label}`}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

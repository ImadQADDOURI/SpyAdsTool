"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Check, CheckCircle2, ChevronDown, Search, X } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";

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

import { CustomDateCaption } from "./CustomDateCaption";
import type { FilterConfig } from "./filter-config";

interface SearchFilterItemProps {
  filter: FilterConfig;
  value: any;
  onChange: (value: any) => void;
  onClear: () => void;
}

function SearchFilterItemComponent({
  filter,
  value,
  onChange,
  onClear,
}: SearchFilterItemProps) {
  // Main state
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // Search state - completely isolated from dropdown state
  const [search, setSearch] = useState("");

  // Store dropdown state to detect changes
  const wasOpen = useRef(open);

  // Refs for DOM elements
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Detect when dropdown opens and closes
  useIsomorphicLayoutEffect(() => {
    // When dropdown opens
    if (
      open &&
      !wasOpen.current &&
      filter.options &&
      filter.options.length > 5
    ) {
      // Reset search when opening
      setSearch("");

      // Focus search input after rendering (using RAF for better perf)
      requestAnimationFrame(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
    }

    // Update ref with current state
    wasOpen.current = open;
  }, [open, filter.options]);

  // Prevent dropdown from closing when clicking inside search input
  useIsomorphicLayoutEffect(() => {
    const searchContainer = searchContainerRef.current;

    if (!searchContainer) return;

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
    };

    searchContainer.addEventListener("click", handleClick);
    return () => {
      searchContainer.removeEventListener("click", handleClick);
    };
  }, []);

  // Memoize value checking to prevent unnecessary recalculations
  const hasValue = useMemo(
    () =>
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== ""),
    [value],
  );

  // Memoize filtered options to avoid recalculation on every render
  const filteredOptions = useMemo(() => {
    if (!filter.options) return [];

    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return filter.options;

    return filter.options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower),
    );
  }, [filter.options, search]);

  // Get selected options with their full details for displaying in trigger
  const selectedOptions = useMemo(() => {
    if (!filter.options || !hasValue) return [];

    if (Array.isArray(value)) {
      return value
        .map((val) => filter.options?.find((opt) => opt.value === val))
        .filter(Boolean);
    } else {
      const option = filter.options?.find((opt) => opt.value === value);
      return option ? [option] : [];
    }
  }, [filter.options, value, hasValue]);

  // Enhanced display value calculation with icon support
  const displayValue = useMemo(() => {
    if (!hasValue)
      return <span className="text-muted-foreground">{filter.label}</span>;

    if (filter.key === "startDate" || filter.key === "endDate") {
      return (
        <span className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {filter.label}:
          </span>
          <span>{format(new Date(value), "MMM d, yyyy")}</span>
        </span>
      );
    }

    if (Array.isArray(value)) {
      if (value.length === 1 && selectedOptions[0]) {
        const option = selectedOptions[0];
        return (
          <span className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {filter.label}:
            </span>

            {option.icon && typeof option.icon === "string" ? (
              <Image
                src={option.icon}
                alt={option.label}
                width={16}
                height={16}
                className="flex-shrink-0"
              />
            ) : option.icon ? (
              <option.icon className="mx-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            ) : null}

            <span>{option.label}</span>
          </span>
        );
      }

      return (
        <span className="flex items-center gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {filter.label}:
          </span>

          {/* Display first two option icons */}
          <span className="flex items-center -space-x-1">
            {selectedOptions.slice(0, 3).map(
              (option, idx) =>
                option && (
                  <span
                    key={idx}
                    className="flex-shrink-0 rounded-full border bg-background p-0.5"
                  >
                    {option.icon && typeof option.icon === "string" ? (
                      <Image
                        src={option.icon}
                        alt={option.label}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    ) : option.icon ? (
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                ),
            )}

            {value.length > 2 && (
              <span className="ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                +{value.length - 2}
              </span>
            )}
          </span>
        </span>
      );
    }

    const option = selectedOptions[0];
    if (option) {
      return (
        <span className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {filter.label}:
          </span>

          {option.icon && typeof option.icon === "string" ? (
            <Image
              src={option.icon}
              alt={option.label}
              width={16}
              height={16}
              className="flex-shrink-0"
            />
          ) : option.icon ? (
            <option.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          ) : (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          )}

          <span>{option.label}</span>
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {filter.label}:
        </span>
        <span>{value}</span>
      </span>
    );
  }, [filter.label, filter.key, value, hasValue, selectedOptions]);

  // Handle search - completely separated from dropdown events
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      setSearch(e.target.value);
    },
    [],
  );

  // Handle clearing search
  const handleClearSearch = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSearch("");
    requestAnimationFrame(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    });
  }, []);

  // Handle filter clear
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear();
    },
    [onClear],
  );

  // Handle date selection
  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      onChange(date ? format(date, "yyyy-MM-dd") : null);
      setDateOpen(false);
    },
    [onChange],
  );

  // Handle single option selection
  const handleSingleOptionSelect = useCallback(
    (
      optionValue: string,
      isSelected: boolean,
      e: React.MouseEvent | React.KeyboardEvent,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      onChange(isSelected ? null : optionValue);
      if (!filter.multiSelect) {
        setOpen(false);
      }
    },
    [onChange, filter.multiSelect],
  );

  // Handle multi-option selection
  const handleMultiOptionChange = useCallback(
    (
      optionValue: string,
      isSelected: boolean,
      e: React.MouseEvent | React.KeyboardEvent,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (Array.isArray(value)) {
        const newValue = isSelected
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue];
        onChange(newValue.length ? newValue : null);
      } else {
        onChange(isSelected ? null : [optionValue]);
      }

      // Keep focus on search input after selection
      requestAnimationFrame(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
    },
    [onChange, value],
  );

  // Memoized option render function for virtualization
  const renderOption = useCallback(
    (index: number) => {
      const option = filteredOptions[index];
      if (!option) return null;

      const isSelected = Array.isArray(value)
        ? value.includes(option.value)
        : value === option.value;

      // Common option content
      const optionContent = (
        <>
          {/* Icon if available */}
          {option.icon && typeof option.icon === "string" ? (
            <Image
              src={option.icon || "/placeholder.svg"}
              alt={option.label}
              width={16}
              height={16}
              className="mr-2 flex-shrink-0"
            />
          ) : option.icon ? (
            <option.icon className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
          ) : null}

          <span className="flex-1 truncate">{option.label}</span>

          {/* Checkmark for selected items */}
          {isSelected && !filter.multiSelect && (
            <Check className="ml-2 h-4 w-4 flex-shrink-0 text-emerald-500" />
          )}
        </>
      );

      if (filter.multiSelect) {
        // We need to create a custom checkbox item that doesn't close the dropdown
        return (
          <div
            key={option.value}
            role="menuitem"
            tabIndex={0}
            className={cn(
              "relative flex w-full cursor-default select-none items-center gap-2 truncate rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground",
              isSelected && "bg-accent/40",
            )}
            onClick={(e) =>
              handleMultiOptionChange(option.value, isSelected, e)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleMultiOptionChange(option.value, isSelected, e);
              }
            }}
          >
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-sm border",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary",
              )}
            >
              {isSelected && <Check className="h-4 w-4" />}
            </div>
            {optionContent}
          </div>
        );
      }

      return (
        <div
          key={option.value}
          role="menuitem"
          tabIndex={0}
          className={cn(
            "relative flex w-full cursor-default select-none items-center gap-2 truncate rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:bg-accent focus:text-accent-foreground",
            isSelected && "bg-accent/40",
          )}
          onClick={(e) => handleSingleOptionSelect(option.value, isSelected, e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSingleOptionSelect(option.value, isSelected, e);
            }
          }}
        >
          {optionContent}
        </div>
      );
    },
    [
      filteredOptions,
      value,
      filter.multiSelect,
      handleMultiOptionChange,
      handleSingleOptionSelect,
    ],
  );

  // Clear all selections (for multi-select)
  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClear();
      requestAnimationFrame(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
    },
    [onClear],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
    }
  }, []);

  // Render date filter
  if (filter.key === "startDate" || filter.key === "endDate") {
    return (
      <div className="relative">
        <DropdownMenu open={dateOpen} onOpenChange={setDateOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between text-left font-normal",
                hasValue
                  ? "border-purple-300 bg-purple-50/50 text-foreground dark:border-purple-700 dark:bg-purple-900/20"
                  : "text-muted-foreground",
                "transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-600",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {filter.icon && filter.icon.startsWith("/") ? (
                  <Image
                    src={filter.icon}
                    alt={filter.label}
                    width={16}
                    height={16}
                    className={cn(hasValue ? "opacity-100" : "opacity-60")}
                  />
                ) : null}
                <span className="truncate">
                  {value ? (
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {filter.label}:
                      </span>
                      <span>{format(new Date(value), "MMM d, yyyy")}</span>
                    </span>
                  ) : (
                    filter.label
                  )}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={handleDateSelect}
              fromDate={new Date("2018-05-07")}
              toDate={new Date()}
              disabled={(date) => date > new Date()}
              components={{ Caption: CustomDateCaption }}
              initialFocus
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear button */}
        {hasValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute -right-3 -top-3 h-6 w-6 rounded-full border bg-white shadow-sm transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear {filter.label}</span>
          </Button>
        )}
      </div>
    );
  }

  // Render regular filter dropdown with custom content to fix search issues
  return (
    <div className="relative">
      {/* We're using DropdownMenu for the button, but we'll handle the content ourselves */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              hasValue
                ? "border-purple-300 bg-purple-50/50 text-foreground dark:border-purple-700 dark:bg-purple-900/20"
                : "text-muted-foreground",
              "transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-600",
            )}
          >
            <div className="flex items-center gap-1 truncate">
              {/* Filter icon */}
              {filter.icon && filter.icon.startsWith("/") ? (
                <Image
                  src={filter.icon || "/placeholder.svg"}
                  alt={filter.label}
                  width={24}
                  height={24}
                  className={cn(hasValue ? "opacity-100" : "opacity-60")}
                />
              ) : null}

              <span className="truncate">{displayValue}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        {/* Custom dropdown content to handle search properly */}
        <DropdownMenuContent
          ref={dropdownContentRef}
          align="start"
          className="w-[220px] p-2"
          sideOffset={4}
          onKeyDown={handleKeyDown}
          onInteractOutside={() => setOpen(false)}
        >
          {/* Search input - isolated in its own container */}
          {filter.options && filter.options.length > 5 && (
            <>
              <div
                ref={searchContainerRef}
                className="mb-2 flex items-center rounded-md border px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={`Search ${filter.label.toLowerCase()}...`}
                  value={search}
                  onChange={handleSearchChange}
                  className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      setOpen(false);
                    }
                    // Prevent dropdown events on other keys
                    e.stopPropagation();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSearch}
                    className="h-6 w-6 p-0"
                    tabIndex={-1}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Options with virtualization for long lists */}
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found
              {search && (
                <div className="mt-1">
                  <Button
                    variant="link"
                    onClick={handleClearSearch}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          ) : filteredOptions.length > 10 ? (
            <div style={{ height: Math.min(250, filteredOptions.length * 36) }}>
              <Virtuoso
                style={{ height: "100%" }}
                totalCount={filteredOptions.length}
                itemContent={(index) => renderOption(index)}
                overscan={5}
                tabIndex={0}
                className="focus:outline-none"
                increaseViewportBy={{ top: 80, bottom: 80 }}
                initialTopMostItemIndex={
                  // Find the first selected item's index to scroll to it
                  Array.isArray(value) && value.length > 0
                    ? Math.max(
                        0,
                        filteredOptions.findIndex((o) =>
                          value.includes(o.value),
                        ),
                      )
                    : value
                      ? Math.max(
                          0,
                          filteredOptions.findIndex((o) => o.value === value),
                        )
                      : 0
                }
              />
            </div>
          ) : (
            <div className="max-h-[250px] overflow-auto py-1">
              {filteredOptions.map((_, index) => renderOption(index))}
            </div>
          )}

          {/* Show selection summary for multi-select with many items selected */}
          {filter.multiSelect && Array.isArray(value) && value.length > 0 && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium">{value.length}</span> item
                  {value.length !== 1 ? "s" : ""} selected
                </span>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-blue-500 hover:text-blue-700"
                  onClick={handleClearAll}
                >
                  Clear all
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear button */}
      {hasValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute -right-3 -top-3 h-6 w-6 rounded-full border bg-white shadow-sm transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear {filter.label}</span>
        </Button>
      )}
    </div>
  );
}

// Export memoized component with display name for better debugging
const SearchFilterItem = memo(SearchFilterItemComponent);
SearchFilterItem.displayName = "SearchFilterItem";

export { SearchFilterItem };

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const searchTypes = [
  { value: "KEYWORD_UNORDERED", label: "Keyword Unordered" },
  { value: "KEYWORD_EXACT_PHRASE", label: "Keyword Exact Phrase" },
];

export const SearchType: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSearchType = searchParams.get("search_type") || null;

  // 🎯 Selection handler
  const handleSelect = React.useCallback(
    (searchTypeValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedSearchType === searchTypeValue) {
        params.delete("search_type");
      } else {
        params.set("search_type", searchTypeValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, selectedSearchType],
  );

  // 🧹 Clear selection handler
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search_type");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 📝 Selected search type label
  const selectedTypeLabel = React.useMemo(
    () =>
      searchTypes.find((type) => type.value === selectedSearchType)?.label ||
      "Search Type",
    [selectedSearchType],
  );

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
                selectedSearchType && "rounded-r-none border-r-0 pr-3",
              )}
            >
              <span className="mr-1 truncate">{selectedTypeLabel}</span>
              {!selectedSearchType && (
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
          {selectedSearchType && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClear}
              aria-label="Clear search type selection"
              className="h-10 flex-shrink-0 rounded-l-none rounded-r-full border-l-0 bg-background px-2 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          )}
        </div>

        <DropdownMenuContent
          className="w-[300px] max-w-[calc(100vw-2rem)] p-0"
          align="start"
        >
          <ScrollArea className="max-h-[40vh]">
            <div className="py-2">
              {searchTypes.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No search type found.
                </p>
              ) : (
                searchTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
                    onClick={() => handleSelect(type.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        selectedSearchType === type.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="truncate">{type.label}</span>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchType;

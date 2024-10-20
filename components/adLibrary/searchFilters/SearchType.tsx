// @/components/adsLibrary/searchType.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const searchTypes = [
  { value: "KEYWORD_UNORDERED", label: "Keyword Unordered" },
  { value: "KEYWORD_EXACT_PHRASE", label: "Keyword Exact Phrase" },
];

export const SearchType: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSearchType = searchParams.get("search_type") || null;

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSearchType
            ? searchTypes.find((type) => type.value === selectedSearchType)
                ?.label
            : "Search Type"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {searchTypes.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">
              No search type found.
            </p>
          ) : (
            searchTypes.map((type) => (
              <Button
                key={type.value}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSelect(type.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSearchType === type.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {type.label}
              </Button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchType;

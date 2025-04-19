// @/components\adLibrary\searchFilters\categoryAsKeyword.tsx

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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "@/components/adLibrary/searchFilters/old-filter/Categories";

export const CategoryAsKeyword: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams.get("category_as_keyword") || null;

  // 🎯 Selection handler
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (currentValue === value) {
        params.delete("category_as_keyword");
      } else {
        params.set("category_as_keyword", currentValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, value],
  );

  // 🧹 Clear selection handler
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category_as_keyword");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 🔍 Filter categories based on search term
  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) =>
      category.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  // 📝 Selected category label
  const selectedCategory = React.useMemo(
    () =>
      categories.find((category) => category.value === value)?.label ||
      "All Categories",
    [value],
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
                value && "rounded-r-none border-r-0 pr-3",
              )}
            >
              <span className="mr-1 truncate">{selectedCategory}</span>
              {!value && (
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
          {value && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClear}
              aria-label="Clear selection"
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
          <div className="border-b p-3">
            <Input
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              aria-label="Search categories"
            />
          </div>

          <ScrollArea className="h-[300px] max-h-[40vh]">
            <div className="py-2">
              {filteredCategories.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No category found.
                </p>
              ) : (
                filteredCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
                    onClick={() => handleSelect(category.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        value === category.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate">{category.label}</span>
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

export default CategoryAsKeyword;

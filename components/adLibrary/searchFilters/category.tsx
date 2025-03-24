"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Check,
  ChevronDown,
  CircleDollarSign,
  Home,
  LayoutGrid,
  MegaphoneIcon,
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

const categories = [
  { value: "ALL", label: "All Ads", icon: LayoutGrid },
  {
    value: "CREDIT_ADS",
    label: "Financial, Credit & Services ",
    icon: CircleDollarSign,
  },
  {
    value: "EMPLOYMENT_ADS",
    label: "Jobs, Career & Employment",
    icon: Briefcase,
  },
  {
    value: "HOUSING_ADS",
    label: "Properties & Real Estate",
    icon: Home,
  },
  {
    value: "POLITICAL_AND_ISSUE_ADS",
    label: "Politics, Elections & Issues",
    icon: MegaphoneIcon,
  },
];

export const Category: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = React.useMemo(
    () => searchParams.get("ad_type") || "ALL",
    [searchParams],
  );

  // 🎯 Selection handler
  const handleSelect = React.useCallback(
    (categoryValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryValue === "ALL") {
        params.delete("ad_type");
      } else {
        params.set("ad_type", categoryValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams],
  );

  // 🧹 Clear selection handler
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("ad_type");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 📝 Selected item with icon
  const selectedItem = React.useMemo(() => {
    return (
      categories.find((category) => category.value === selectedCategory) ||
      categories[0]
    );
  }, [selectedCategory]);

  // 🔍 Check if a non-default category is selected
  const hasSelection = selectedCategory !== "ALL";

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
                hasSelection && "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex items-center truncate">
                  {React.createElement(selectedItem.icon, {
                    className: "mr-2 h-4 w-4 flex-shrink-0",
                  })}
                  <span className="truncate">{selectedItem.label}</span>
                </div>
              </div>
              {!hasSelection && (
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
          {hasSelection && (
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
          <ScrollArea className="max-h-[40vh]">
            <div className="py-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
                  onClick={() => handleSelect(category.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      selectedCategory === category.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {React.createElement(category.icon, {
                    className: "mr-2 h-4 w-4 flex-shrink-0",
                  })}
                  <span className="truncate">{category.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Category;

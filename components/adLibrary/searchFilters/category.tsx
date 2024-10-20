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

const categories = [
  { value: "ALL", label: "All" },
  { value: "CREDIT_ADS", label: "Credit Ads" },
  { value: "EMPLOYMENT_ADS", label: "Employment Ads" },
  { value: "HOUSING_ADS", label: "Housing Ads" },
  { value: "POLITICAL_AND_ISSUE_ADS", label: "Political and Issue Ads" },
];

export const Category: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = React.useMemo(
    () => searchParams.get("ad_type") || "ALL",
    [searchParams],
  );

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

  const selectedLabel = React.useMemo(() => {
    return (
      categories.find((category) => category.value === selectedCategory)
        ?.label || "All Types"
    );
  }, [selectedCategory]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect(category.value)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedCategory === category.value
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
              {category.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Category;

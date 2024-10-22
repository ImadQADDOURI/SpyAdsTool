"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Check,
  ChevronsUpDown,
  CircleDollarSign,
  Home,
  LayoutGrid,
  MegaphoneIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const selectedItem = React.useMemo(() => {
    return (
      categories.find((category) => category.value === selectedCategory) ||
      categories[0]
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
          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex items-center truncate">
              {React.createElement(selectedItem.icon, {
                className: "mr-2 h-4 w-4 flex-shrink-0",
              })}
              <span className="truncate">{selectedItem.label}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
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
      </PopoverContent>
    </Popover>
  );
};

export default Category;

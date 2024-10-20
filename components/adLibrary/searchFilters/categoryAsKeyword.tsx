"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/utils/Categories";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const CategoryAsKeyword: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get("category_as_keyword") || null;

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

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) =>
      category.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? categories.find((category) => category.value === value)?.label
            : "All Categories"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
            aria-label="Search categories"
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                No category found.
              </p>
            ) : (
              filteredCategories.map((category) => (
                <Button
                  key={category.value}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelect(category.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {category.label}
                </Button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryAsKeyword;

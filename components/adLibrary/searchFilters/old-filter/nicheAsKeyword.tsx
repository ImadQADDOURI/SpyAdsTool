"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { niches } from "@/components/adLibrary/searchFilters/old-filter/Niches";

export const NicheAsKeyword: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get("niche_as_keyword") || null;

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (currentValue === value) {
        params.delete("niche_as_keyword");
      } else {
        params.set("niche_as_keyword", currentValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, value],
  );

  const filteredNiches = React.useMemo(() => {
    return niches.filter((niche) =>
      niche.label.toLowerCase().includes(searchTerm.toLowerCase()),
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
            ? niches.find((niche) => niche.value === value)?.label
            : "All Niches"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search niche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
            aria-label="Search niches"
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredNiches.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                No niche found.
              </p>
            ) : (
              filteredNiches.map((niche) => (
                <Button
                  key={niche.value}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelect(niche.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === niche.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {niche.label}
                </Button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NicheAsKeyword;

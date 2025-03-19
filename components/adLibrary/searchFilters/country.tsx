"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { countryCodesAlpha2Flag } from "@/utils/countryCodesAlpha2Flag";
import { Check, ChevronDown, X } from "lucide-react";
import { FixedSizeList } from "react-window"; // 🚀 Virtualization library

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// 🔄 Country Item renderer for virtualized list
type CountryItemProps = {
  index: number;
  style: React.CSSProperties;
  data: {
    items: typeof countryCodesAlpha2Flag;
    selectedCountries: string[];
    handleSelect: (countryCode: string) => void;
  };
};

// ✨ Memoized country item component for virtualized rendering
const CountryItem = React.memo(({ index, style, data }: CountryItemProps) => {
  const country = data.items[index];
  const isSelected = data.selectedCountries.includes(country.value);

  return (
    <Button
      key={country.value}
      variant="ghost"
      className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
      style={style}
      onClick={() => data.handleSelect(country.value)}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4 flex-shrink-0",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
      <img
        src={country.icon}
        alt={`${country.label} flag`}
        className="mr-2 inline-block h-5 w-5 flex-shrink-0 rounded-sm"
        loading="lazy" // 🖼️ Lazy load images
      />
      <span className="truncate">{country.label}</span>
    </Button>
  );
});
CountryItem.displayName = "CountryItem";

export const Country: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔍 Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // ⏱️ Debounce delay

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // 🌐 Parse selected countries from URL only when needed
  const selectedCountries = React.useMemo(() => {
    return searchParams.get("countries")?.split(",").filter(Boolean) || [];
  }, [searchParams]);

  // 🔄 URL update with request batching
  const updateURL = React.useCallback(
    (newCountries: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newCountries.length === 0) {
        params.delete("countries");
      } else {
        params.set("countries", newCountries.join(","));
      }

      // 🛑 Use non-blocking navigation with scroll prevention
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSelect = React.useCallback(
    (countryCode: string) => {
      const newSelection = selectedCountries.includes(countryCode)
        ? selectedCountries.filter((code) => code !== countryCode)
        : [...selectedCountries, countryCode];
      updateURL(newSelection);
    },
    [selectedCountries, updateURL],
  );

  const handleRemove = React.useCallback(
    (countryCode: string) => {
      const newSelection = selectedCountries.filter(
        (code) => code !== countryCode,
      );
      updateURL(newSelection);
    },
    [selectedCountries, updateURL],
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateURL([]);
    },
    [updateURL],
  );

  // 🧠 Memoized filtered countries with debounced search term
  const filteredCountries = React.useMemo(() => {
    if (!debouncedSearchTerm) return countryCodesAlpha2Flag;

    return countryCodesAlpha2Flag.filter((country) =>
      country.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm]);

  // 📊 Calculate visible selections only when needed
  const visibleSelections = React.useMemo(
    () => selectedCountries.slice(0, 1),
    [selectedCountries],
  );

  const remainingCount = selectedCountries.length - visibleSelections.length;

  // 📝 Keep track of list ref for scrolling
  const listRef = React.useRef<FixedSizeList>(null);

  // 🔄 Reset scroll position when search changes
  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [debouncedSearchTerm]);

  // 🧩 Memoize item data to prevent unnecessary re-renders
  const itemData = React.useMemo(
    () => ({
      items: filteredCountries,
      selectedCountries,
      handleSelect,
    }),
    [filteredCountries, selectedCountries, handleSelect],
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
                "h-auto min-h-[2.5rem] min-w-0 flex-1 justify-between py-2 transition-all",
                selectedCountries.length > 0 &&
                  "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="mr-2 flex flex-wrap items-center gap-1 overflow-hidden">
                {selectedCountries.length > 0 ? (
                  <>
                    {visibleSelections.map((code) => {
                      // 🧠 Cache lookup for better performance
                      const country = countryCodesAlpha2Flag.find(
                        (c) => c.value === code,
                      );
                      return (
                        <Badge
                          key={code}
                          variant="secondary"
                          className="mr-0 flex-shrink-0 p-0 pl-0.5"
                        >
                          <img
                            src={country?.icon}
                            alt={`${country?.label} flag`}
                            className="mr-0 inline-block h-5 w-5 rounded-sm"
                            loading="lazy" // 🖼️ Lazy load images
                          />
                          <button
                            className="ml-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRemove(code);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(code);
                            }}
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      );
                    })}
                    {remainingCount > 0 && (
                      <Badge
                        className="flex-shrink-0 p-0.5"
                        variant="secondary"
                      >
                        +{remainingCount}
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="truncate text-muted-foreground">
                    All Countries
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </Button>
          </DropdownMenuTrigger>

          {/* ❌ Clear selection button as half-circle extension */}
          {selectedCountries.length > 0 && (
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
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              aria-label="Search countries"
            />
          </div>

          <ScrollArea className="h-[300px] max-h-[40vh]">
            <div className="py-2">
              {filteredCountries.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No country found.
                </p>
              ) : (
                <div>
                  {/* 🚀 Virtualized list for better performance */}
                  <FixedSizeList
                    ref={listRef}
                    height={300}
                    width="100%"
                    itemCount={filteredCountries.length}
                    itemSize={36} // Height of each item
                    itemData={itemData}
                    className="scrollbar-hide" // Hide default scrollbar to use ScrollArea's
                  >
                    {CountryItem}
                  </FixedSizeList>
                </div>
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Country;

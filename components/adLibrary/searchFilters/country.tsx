"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { countryCodesAlpha2Flag } from "@/utils/countryCodesAlpha2Flag";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { FixedSizeList } from "react-window"; // 🚀 Virtualization library

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      className="w-full justify-start"
      style={style}
      onClick={() => data.handleSelect(country.value)}
    >
      <Check
        className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      <img
        src={country.icon}
        alt={`${country.label} flag`}
        className="mr-2 inline-block h-5 w-5 rounded-sm"
        loading="lazy" // 🖼️ Lazy load images
      />
      {country.label}
    </Button>
  );
});
CountryItem.displayName = "CountryItem";

export const Country: React.FC = () => {
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
    return searchParams.get("countries")?.split(",") || [];
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

  const handleDeselectAll = React.useCallback(
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
    () => selectedCountries.slice(0, 2),
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-[2.5rem] w-full justify-between py-2"
        >
          <div className="mr-0 flex flex-wrap items-center gap-1">
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
                      className="mr-0 p-0 pl-0.5"
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
                  <Badge className="p-0.5" variant="secondary">
                    +{remainingCount}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">All Countries</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {selectedCountries.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 rounded-full p-0"
                onClick={handleDeselectAll}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
            aria-label="Search countries"
          />
          <div>
            {filteredCountries.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                No country found.
              </p>
            ) : (
              <div className="h-[300px]">
                {/* 🚀 Virtualized list for better performance */}
                <FixedSizeList
                  ref={listRef}
                  height={300}
                  width="100%"
                  itemCount={filteredCountries.length}
                  itemSize={36} // Height of each item
                  itemData={itemData}
                >
                  {CountryItem}
                </FixedSizeList>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Country;

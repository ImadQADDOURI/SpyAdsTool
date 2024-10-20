"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { countryCodesAlpha2Flag } from "@/utils/countryCodesAlpha2Flag";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Country: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCountries = searchParams.get("countries")?.split(",") || [];

  const updateURL = React.useCallback(
    (newCountries: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newCountries.length === 0) {
        params.delete("countries");
      } else {
        params.set("countries", newCountries.join(","));
      }
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

  const filteredCountries = React.useMemo(() => {
    return countryCodesAlpha2Flag.filter((country) =>
      country.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const visibleSelections = selectedCountries.slice(0, 2);
  const remainingCount = selectedCountries.length - visibleSelections.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-[2.5rem] w-full justify-between py-2"
        >
          <div className="mr-2 flex flex-wrap items-center gap-1">
            {selectedCountries.length > 0 ? (
              <>
                {visibleSelections.map((code) => {
                  const country = countryCodesAlpha2Flag.find(
                    (c) => c.value === code,
                  );
                  return (
                    <Badge key={code} variant="secondary" className="mr-1">
                      <img
                        src={country?.icon}
                        alt={`${country?.label} flag`}
                        className="mr-1 inline-block h-5 w-5 rounded-sm"
                      />
                      {country?.value}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
                {remainingCount > 0 && (
                  <Badge variant="secondary">+{remainingCount}</Badge>
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
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                No country found.
              </p>
            ) : (
              filteredCountries.map((country) => (
                <Button
                  key={country.value}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelect(country.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountries.includes(country.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <img
                    src={country.icon}
                    alt={`${country.label} flag`}
                    className="mr-2 inline-block h-5 w-5 rounded-sm"
                  />
                  {country.label}
                </Button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Country;

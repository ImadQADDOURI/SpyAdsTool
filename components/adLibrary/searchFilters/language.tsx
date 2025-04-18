// @/components\adLibrary\searchFilters\language.tsx

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { languages } from "@/utils/languages";
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

// 🔄 Language Item renderer for virtualized list
type LanguageItemProps = {
  index: number;
  style: React.CSSProperties;
  data: {
    items: typeof languages;
    selectedLanguages: string[];
    handleSelect: (languageCode: string) => void;
  };
};

// ✨ Memoized language item component
const LanguageItem = React.memo(({ index, style, data }: LanguageItemProps) => {
  const language = data.items[index];
  const isSelected = data.selectedLanguages.includes(language.value);

  return (
    <Button
      key={language.value}
      variant="ghost"
      className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
      style={style}
      onClick={() => data.handleSelect(language.value)}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4 flex-shrink-0",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="truncate">{language.label}</span>
    </Button>
  );
});
LanguageItem.displayName = "LanguageItem";

export const Language: React.FC = () => {
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

  // 🌐 Parse selected languages from URL only when needed
  const selectedLanguages = React.useMemo(() => {
    return searchParams.get("content_languages")?.split(",") || [];
  }, [searchParams]);

  // 🔄 URL update with request batching
  const updateURL = React.useCallback(
    (newLanguages: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newLanguages.length === 0) {
        params.delete("content_languages");
      } else {
        params.set("content_languages", newLanguages.join(","));
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSelect = React.useCallback(
    (languageCode: string) => {
      const newSelection = selectedLanguages.includes(languageCode)
        ? selectedLanguages.filter((code) => code !== languageCode)
        : [...selectedLanguages, languageCode];
      updateURL(newSelection);
    },
    [selectedLanguages, updateURL],
  );

  const handleRemove = React.useCallback(
    (languageCode: string) => {
      const newSelection = selectedLanguages.filter(
        (code) => code !== languageCode,
      );
      updateURL(newSelection);
    },
    [selectedLanguages, updateURL],
  );

  const handleDeselectAll = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateURL([]);
    },
    [updateURL],
  );

  // 🧠 Memoized filtered languages with debounced search term
  const filteredLanguages = React.useMemo(() => {
    if (!debouncedSearchTerm) return languages;

    return languages.filter((language) =>
      language.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm]);

  // 📊 Calculate visible selections only when needed
  const visibleSelections = React.useMemo(
    () => selectedLanguages.slice(0, 1),
    [selectedLanguages],
  );

  const remainingCount = selectedLanguages.length - visibleSelections.length;

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
      items: filteredLanguages,
      selectedLanguages,
      handleSelect,
    }),
    [filteredLanguages, selectedLanguages, handleSelect],
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
                selectedLanguages.length > 0 &&
                  "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="mr-2 flex flex-wrap items-center gap-1 overflow-hidden">
                {selectedLanguages.length > 0 ? (
                  <>
                    {visibleSelections.map((code) => {
                      // 🧠 Cache lookup for performance
                      const language = languages.find(
                        (lang) => lang.value === code,
                      );
                      return (
                        <Badge
                          key={code}
                          variant="secondary"
                          className="mr-1 flex-shrink-0 p-0 pl-0.5"
                        >
                          <span className="max-w-16 truncate">
                            {language?.value}
                          </span>
                          <button
                            type="button"
                            style={{ pointerEvents: "all" }} // ensure the button is clickable
                            className="ml-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRemove(code);
                              }
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
                    All Languages
                  </span>
                )}
              </div>{" "}
              {selectedLanguages.length === 0 && (
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              )}
            </Button>
          </DropdownMenuTrigger>

          {/* ❌ Clear selection button as half-circle extension */}
          {selectedLanguages.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDeselectAll}
              aria-label="Clear all selections"
              className="h-10 flex-shrink-0 rounded-l-none rounded-r-full border-l-0 bg-background px-2 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          )}
        </div>

        <DropdownMenuContent
          className="w-[250px] max-w-[calc(100vw-2rem)] p-0"
          align="start"
        >
          <div className="border-b p-3">
            <Input
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              aria-label="Search languages"
            />
          </div>

          <ScrollArea className="h-[300px] max-h-[40vh]">
            <div className="py-2">
              {filteredLanguages.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No language found.
                </p>
              ) : (
                // 🚀 Keep the virtualized list for better performance
                <FixedSizeList
                  ref={listRef}
                  height={300}
                  width="100%"
                  itemCount={filteredLanguages.length}
                  itemSize={36} // Height of each item
                  itemData={itemData}
                  className="scrollbar-none" // Hide default scrollbar
                >
                  {LanguageItem}
                </FixedSizeList>
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Language;

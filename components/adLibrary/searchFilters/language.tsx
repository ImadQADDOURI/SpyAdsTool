"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { languages } from "@/utils/languages";
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
  const isSelected = data.selectedLanguages.includes(language.code);

  return (
    <Button
      key={language.code}
      variant="ghost"
      className="w-full justify-start"
      style={style}
      onClick={() => data.handleSelect(language.code)}
    >
      <Check
        className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      {language.name}
    </Button>
  );
});
LanguageItem.displayName = "LanguageItem";

export const Language: React.FC = () => {
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
      language.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm]);

  // 📊 Calculate visible selections only when needed
  const visibleSelections = React.useMemo(
    () => selectedLanguages.slice(0, 2),
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-[2.5rem] w-full justify-between py-2"
        >
          <div className="mr-2 flex flex-wrap items-center gap-1">
            {selectedLanguages.length > 0 ? (
              <>
                {visibleSelections.map((code) => {
                  // 🧠 Cache lookup for performance
                  const language = languages.find((lang) => lang.code === code);
                  return (
                    <Badge
                      key={code}
                      variant="secondary"
                      className="mr-1 p-0 pl-0.5"
                    >
                      {language?.code}
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
              <span className="text-muted-foreground">All Languages</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {selectedLanguages.length > 0 && (
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
      <PopoverContent className="w-[200px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
            aria-label="Search languages"
          />
          <div>
            {filteredLanguages.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                No language found.
              </p>
            ) : (
              <div className="h-[300px]">
                {/* 🚀 Virtualized list for better performance */}
                <FixedSizeList
                  ref={listRef}
                  height={300}
                  width="100%"
                  itemCount={filteredLanguages.length}
                  itemSize={36} // Height of each item
                  itemData={itemData}
                >
                  {LanguageItem}
                </FixedSizeList>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Language;

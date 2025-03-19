import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, FileText, Link, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 🔍 Search type constants
export const KEYWORD_UNORDERED = "KEYWORD_UNORDERED";
export const KEYWORD_EXACT_PHRASE = "KEYWORD_EXACT_PHRASE";

// 🔍 Search source constants
export const SOURCE_URL = "url";
export const SOURCE_PAGE = "page";

// 📋 Search type configuration with icons and descriptions
export const SEARCH_TYPES = {
  KEYWORD: {
    label: "Keyword",
    value: KEYWORD_UNORDERED,
    placeholder: "Search keywords in any order...",
    icon: Search,
    description: "Find results containing words in any order",
    color: "#6566F1", // Purple from the primary gradient
    sourceType: null,
  },
  URL: {
    label: "URL",
    value: KEYWORD_EXACT_PHRASE,
    placeholder: "Search for exact URL matches...",
    icon: Link,
    description: "Find exact URL matches",
    color: "#B977F8", // Purple from the secondary gradient
    sourceType: SOURCE_URL,
  },
  PAGE: {
    label: "Page",
    value: KEYWORD_EXACT_PHRASE,
    placeholder: "Search for exact page content...",
    icon: FileText,
    description: "Find exact page content matches",
    color: "#9E67F0", // Mid-point between primary and secondary
    sourceType: SOURCE_PAGE,
  },
};

export type SearchTypeKey = keyof typeof SEARCH_TYPES;

interface SearchTypeSelectorProps {
  onTypeChange: (type: SearchTypeKey, placeholder: string) => void;
  disabled?: boolean;
}

export const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({
  onTypeChange,
  disabled = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔍 State for active search type
  const [activeType, setActiveType] = useState<SearchTypeKey>("KEYWORD");

  // 🔄 Initialize search type from URL params on component mount and when params change
  useEffect(() => {
    const searchType = searchParams.get("search_type");
    const sourceType = searchParams.get("source_type");
    let initialType: SearchTypeKey = "KEYWORD";

    if (searchType === KEYWORD_EXACT_PHRASE) {
      if (sourceType === SOURCE_URL) {
        initialType = "URL";
      } else if (sourceType === SOURCE_PAGE) {
        initialType = "PAGE";
      } else if (searchParams.get("q")?.startsWith("http")) {
        // Fallback auto-detection for URL-like queries
        initialType = "URL";
      }
    }

    setActiveType(initialType);
    // Notify parent on initial load
    onTypeChange(initialType, SEARCH_TYPES[initialType].placeholder);
  }, [searchParams, onTypeChange]);

  const handleTypeChange = (type: SearchTypeKey) => {
    if (type === activeType) return;

    setActiveType(type);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());

    if (type === "KEYWORD") {
      // Remove search_type and source_type parameters if they exist
      params.delete("search_type");
      params.delete("source_type");
    } else {
      // Set search_type parameter for URL and PAGE types
      params.set("search_type", SEARCH_TYPES[type].value);

      // Set source_type parameter to distinguish between URL and PAGE
      if (SEARCH_TYPES[type].sourceType) {
        params.set("source_type", SEARCH_TYPES[type].sourceType!);
      } else {
        params.delete("source_type");
      }
    }

    router.push(`?${params.toString()}`, { scroll: false });

    // Notify parent component to update placeholder
    onTypeChange(type, SEARCH_TYPES[type].placeholder);
  };

  // 🎨 Determine the active icon based on the current search type
  const ActiveIcon = SEARCH_TYPES[activeType].icon;
  const activeColor = SEARCH_TYPES[activeType].color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1 rounded-full bg-white/80 px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/90 disabled:opacity-50 dark:bg-gray-900/80 dark:text-white dark:hover:bg-gray-800/90"
          aria-label="Select search type"
        >
          <ActiveIcon className="h-5 w-5" style={{ color: activeColor }} />
          <span className="hidden sm:inline">
            {SEARCH_TYPES[activeType].label}
          </span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-full rounded-xl border-0 bg-white/95 p-1 shadow-lg backdrop-blur-sm dark:bg-gray-900/95 dark:text-white"
      >
        {Object.entries(SEARCH_TYPES).map(([key, config]) => {
          const TypeIcon = config.icon;
          const isActive = key === activeType;
          return (
            <DropdownMenuItem
              key={key}
              className={`flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3 transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 text-[#6566F1] dark:from-[#6566F1]/20 dark:to-[#B977F8]/20"
                  : "hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
              }`}
              onClick={() => handleTypeChange(key as SearchTypeKey)}
            >
              <div className="flex w-full items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <TypeIcon
                    className="h-4 w-4"
                    style={{ color: config.color }}
                  />
                </div>
                <span className="font-medium">{config.label}</span>
              </div>
              <span className="pl-10 text-xs text-gray-500 dark:text-gray-400">
                {config.description}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

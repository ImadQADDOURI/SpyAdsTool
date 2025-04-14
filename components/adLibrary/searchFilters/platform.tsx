"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  Facebook,
  Instagram,
  MessageCircle,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// 📋 Define platforms outside component to prevent recreation on render
const platforms = [
  { value: "FACEBOOK", label: "Facebook", icon: Facebook },
  { value: "INSTAGRAM", label: "Instagram", icon: Instagram },
  { value: "AUDIENCE_NETWORK", label: "Audience Network", icon: Users },
  { value: "MESSENGER", label: "Messenger", icon: MessageCircle },
];

// 🔍 Create a lookup map for faster platform retrieval
const platformMap = platforms.reduce(
  (acc, platform) => {
    acc[platform.value] = platform;
    return acc;
  },
  {} as Record<string, (typeof platforms)[0]>,
);

// ✨ Create memoized platform item component
const PlatformItem = React.memo(
  ({
    platform,
    isSelected,
    onSelect,
  }: {
    platform: (typeof platforms)[0];
    isSelected: boolean;
    onSelect: (value: string) => void;
  }) => {
    const Icon = platform.icon;

    return (
      <Button
        key={platform.value}
        variant="ghost"
        className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
        onClick={() => onSelect(platform.value)}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4 flex-shrink-0",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{platform.label}</span>
      </Button>
    );
  },
);
PlatformItem.displayName = "PlatformItem";

export const Platform: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  // 🌐 Parse selected platforms from URL only when needed
  const selectedPlatforms = React.useMemo(
    () => searchParams.get("publisher_platforms")?.split(",") || [],
    [searchParams],
  );

  // 🔄 URL update with request batching
  const updateURL = React.useCallback(
    (newPlatforms: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPlatforms.length === 0) {
        params.delete("publisher_platforms");
      } else {
        params.set("publisher_platforms", newPlatforms.join(","));
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSelect = React.useCallback(
    (platformValue: string) => {
      const newSelection = selectedPlatforms.includes(platformValue)
        ? selectedPlatforms.filter((value) => value !== platformValue)
        : [...selectedPlatforms, platformValue];
      updateURL(newSelection);
    },
    [selectedPlatforms, updateURL],
  );

  const handleRemove = React.useCallback(
    (platformValue: string) => {
      const newSelection = selectedPlatforms.filter(
        (value) => value !== platformValue,
      );
      updateURL(newSelection);
    },
    [selectedPlatforms, updateURL],
  );

  const handleDeselectAll = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateURL([]);
      setOpen(false);
    },
    [updateURL],
  );

  // 📊 Calculate visible selections only when needed
  const visibleSelections = React.useMemo(
    () => selectedPlatforms.slice(0, 1),
    [selectedPlatforms],
  );

  const remainingCount = selectedPlatforms.length - visibleSelections.length;

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
                selectedPlatforms.length > 0 &&
                  "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="m-0 flex max-h-[2.5rem] flex-wrap items-center gap-1">
                {selectedPlatforms.length > 0 ? (
                  <>
                    {visibleSelections.map((value) => {
                      // 🧠 Use map lookup instead of find for better performance
                      const platform = platformMap[value];
                      if (!platform) return null;
                      const Icon = platform.icon;
                      return (
                        <Badge
                          key={value}
                          variant="secondary"
                          className="mr-0 inline-flex max-w-[150px] items-center p-0 pl-0.5"
                        >
                          <Icon className="mr-0 h-4 w-4 flex-shrink-0" />
                          {/* <span className="mr-1 truncate">
                            {platform.label}
                          </span> */}
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
                                handleRemove(value);
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(value);
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
                  <span className="text-muted-foreground">All Platforms</span>
                )}
              </div>
              {selectedPlatforms.length === 0 && (
                <ChevronDown
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              )}
            </Button>
          </DropdownMenuTrigger>

          {/* ❌ Clear selection button as half-circle extension */}
          {selectedPlatforms.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDeselectAll}
              aria-label="Clear selection"
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
          <ScrollArea className="max-h-[40vh]">
            <div className="py-2">
              {platforms.map((platform) => (
                <PlatformItem
                  key={platform.value}
                  platform={platform}
                  isSelected={selectedPlatforms.includes(platform.value)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Platform;

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronsUpDown,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const platforms = [
  { value: "FACEBOOK", label: "Facebook", icon: Facebook },
  { value: "INSTAGRAM", label: "Instagram", icon: Instagram },
  { value: "AUDIENCE_NETWORK", label: "Audience Network", icon: Users },
  { value: "MESSENGER", label: "Messenger", icon: MessageCircle },
];

export const Platform: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const selectedPlatforms = React.useMemo(
    () => searchParams.get("publisher_platforms")?.split(",") || [],
    [searchParams],
  );

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
    },
    [updateURL],
  );

  const visibleSelections = selectedPlatforms.slice(0, 2);
  const remainingCount = selectedPlatforms.length - visibleSelections.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-[2.5rem] w-full justify-between py-2"
        >
          <div className="m-0 flex flex-wrap items-center gap-1">
            {selectedPlatforms.length > 0 ? (
              <>
                {visibleSelections.map((value) => {
                  const platform = platforms.find((p) => p.value === value);
                  if (!platform) return null;
                  const Icon = platform.icon;
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mr-0 inline-flex max-w-[150px] items-center p-0 pl-0.5"
                    >
                      <Icon className="mr-0 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{/* {platform.label} */}</span>
                      <button
                        className="ml-1 flex-shrink-0 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(value);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
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
          <div className="ml-auto flex items-center gap-1">
            {selectedPlatforms.length > 0 && (
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
        <div className="max-h-[300px] overflow-y-auto">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.value}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSelect(platform.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 flex-shrink-0",
                    selectedPlatforms.includes(platform.value)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{platform.label}</span>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Platform;

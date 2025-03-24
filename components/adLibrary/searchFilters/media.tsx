"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Ban,
  Check,
  ChevronDown,
  Image,
  Images,
  Laugh,
  Video,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const mediaTypes = [
  { value: "IMAGE", label: "Images", icon: Image },
  { value: "MEME", label: "Memes", icon: Laugh },
  { value: "IMAGE_AND_MEME", label: "Images and memes", icon: Images },
  { value: "VIDEO", label: "Videos", icon: Video },
  { value: "NONE", label: "No image or video", icon: Ban },
];

export const Media: React.FC = () => {
  // 🔄 State management
  const [open, setOpen] = React.useState(false);

  // 🧭 Navigation and URL handling
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMedia = searchParams.get("media_type") || null;

  // 🎯 Selection handler
  const handleSelect = React.useCallback(
    (mediaValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedMedia === mediaValue) {
        params.delete("media_type");
      } else {
        params.set("media_type", mediaValue);
      }
      router.push(`?${params.toString()}`, { scroll: false });
      setOpen(false);
    },
    [router, searchParams, selectedMedia],
  );

  // 🧹 Clear selection handler
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("media_type");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 📝 Selected option details
  const selectedOption = React.useMemo(() => {
    return selectedMedia
      ? mediaTypes.find((media) => media.value === selectedMedia)
      : null;
  }, [selectedMedia]);

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
                "min-w-0 flex-1 justify-between transition-all",
                selectedMedia && "rounded-r-none border-r-0 pr-3",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex items-center truncate">
                  {selectedOption ? (
                    <>
                      <selectedOption.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{selectedOption.label}</span>
                    </>
                  ) : (
                    "All Media Types"
                  )}
                </div>
              </div>
              {!selectedMedia && (
                <ChevronDown
                  className={cn(
                    "ml-2 h-4 w-4 flex-shrink-0 opacity-50 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              )}
            </Button>
          </DropdownMenuTrigger>

          {/* ❌ Clear selection button as half-circle extension */}
          {selectedMedia && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClear}
              aria-label="Clear media type selection"
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
          <ScrollArea className="max-h-[40vh]">
            <div className="py-2">
              {mediaTypes.map((media) => (
                <Button
                  key={media.value}
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-3 py-2 text-left"
                  onClick={() => handleSelect(media.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      selectedMedia === media.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <media.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{media.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Media;

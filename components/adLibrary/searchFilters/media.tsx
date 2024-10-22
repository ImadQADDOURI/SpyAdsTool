"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Ban,
  Check,
  ChevronsUpDown,
  Image,
  Images,
  Laugh,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mediaTypes = [
  { value: "IMAGE", label: "Images", icon: Image },
  { value: "MEME", label: "Memes", icon: Laugh },
  { value: "IMAGE_AND_MEME", label: "Images and memes", icon: Images },
  { value: "VIDEO", label: "Videos", icon: Video },
  { value: "NONE", label: "No image or video", icon: Ban },
];

export const Media: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedMedia = searchParams.get("media_type") || null;

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

  const selectedOption = React.useMemo(() => {
    return selectedMedia
      ? mediaTypes.find((media) => media.value === selectedMedia)
      : null;
  }, [selectedMedia]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
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
          <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {mediaTypes.map((media) => (
            <Button
              key={media.value}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect(media.value)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 flex-shrink-0",
                  selectedMedia === media.value ? "opacity-100" : "opacity-0",
                )}
              />
              <media.icon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{media.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Media;

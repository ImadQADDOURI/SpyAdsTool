"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mediaTypes = [
  { value: "IMAGE", label: "Images" },
  { value: "MEME", label: "Memes" },
  { value: "IMAGE_AND_MEME", label: "Images and memes" },
  { value: "VIDEO", label: "Videos" },
  { value: "NONE", label: "No image or video" },
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

  const selectedLabel = React.useMemo(() => {
    return selectedMedia
      ? mediaTypes.find((media) => media.value === selectedMedia)?.label
      : "All Media Types";
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
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                  "mr-2 h-4 w-4",
                  selectedMedia === media.value ? "opacity-100" : "opacity-0",
                )}
              />
              {media.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Media;

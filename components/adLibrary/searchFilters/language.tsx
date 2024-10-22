"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { languages } from "@/utils/languages";
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

export const Language: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedLanguages =
    searchParams.get("content_languages")?.split(",") || [];

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

  const filteredLanguages = React.useMemo(() => {
    return languages.filter((language) =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const visibleSelections = selectedLanguages.slice(0, 2);
  const remainingCount = selectedLanguages.length - visibleSelections.length;

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
                  const language = languages.find((lang) => lang.code === code);
                  return (
                    <Badge key={code} variant="secondary" className="mr-1">
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
                  <Badge variant="secondary">+{remainingCount}</Badge>
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
          <div className="max-h-[300px] overflow-y-auto">
            {filteredLanguages.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">
                No language found.
              </p>
            ) : (
              filteredLanguages.map((language) => (
                <Button
                  key={language.code}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelect(language.code)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLanguages.includes(language.code)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {language.name}
                </Button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Language;

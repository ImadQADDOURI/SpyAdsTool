import React, { useState } from "react";
import { generateAdCreative } from "@/actions/geminiAiService";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Copy,
  Globe2,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
  XCircle,
} from "lucide-react";

import { AdData } from "@/types/ad";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { aiSupportedLanguages } from "@/components/adLibrary/aiComponents/AiSupportedLanguages";

interface AdCreative {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

const AdCreativeGenerator: React.FC<{ ad: AdData }> = ({ ad }) => {
  const [adCreative, setAdCreative] = useState<AdCreative | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerateCreative = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const creative = await generateAdCreative(ad, language);
      setAdCreative(creative);
    } catch (err) {
      setError("Failed to generate ad creative copy. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-2xl dark:shadow-gray-900/50 dark:ring-gray-800/50">
      {/* Rest of the component remains exactly the same */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6566F1]/5 to-[#B977F8]/5" />
      <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-[#6566F1]/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-16 w-16 -translate-x-8 translate-y-8 rounded-full bg-[#B977F8]/10 blur-2xl" />

      <div className="relative space-y-2 p-4">
        {/* Title Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-[#6566F1] to-[#B977F8] p-2 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-xl font-bold text-transparent">
                AI Creative Generation
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generate ad copy in multiple languages
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-9 gap-2 border-gray-200 bg-white px-3 hover:border-[#6566F1]/50 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#B977F8]/50 dark:hover:bg-gray-800"
              >
                <Globe2 className="h-4 w-4 text-[#6566F1] dark:text-[#B977F8]" />
                {language}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] border-gray-200/50 bg-white/95 p-0 shadow-xl backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/95">
              <div className="max-h-[300px] overflow-y-auto">
                {aiSupportedLanguages.map((lang) => (
                  <div
                    key={lang}
                    className={cn(
                      "flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-[#6566F1]/5 dark:hover:bg-[#B977F8]/5",
                      language === lang &&
                        "bg-[#6566F1]/10 dark:bg-[#B977F8]/10",
                    )}
                    onClick={() => {
                      setLanguage(lang);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-[#6566F1] dark:text-[#B977F8]",
                        language === lang ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {lang}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleGenerateCreative}
            disabled={isLoading}
            className="h-9 bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-4 text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[#6566F1]/20"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500 shadow-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Generated Content */}
        {adCreative && (
          <div className="mt-6 space-y-4 rounded-lg border border-gray-200/50 bg-gray-50/50 p-4 shadow-lg backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-800/50">
            {[
              { title: "Primary Text", content: adCreative.primaryText },
              { title: "Headline", content: adCreative.headline },
              { title: "Description", content: adCreative.description },
              { title: "Call to Action", content: adCreative.callToAction },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-900/50"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#6566F1]/5 to-transparent opacity-0 group-hover:translate-x-full group-hover:opacity-100 dark:via-[#B977F8]/5" />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-[#6566F1]/10 dark:hover:bg-[#B977F8]/10"
                      onClick={() => handleCopy(item.content, item.title)}
                    >
                      {copiedField === item.title ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-[#6566F1] dark:text-[#B977F8]" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCreativeGenerator;

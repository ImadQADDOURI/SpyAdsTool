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
    <div className="mx-auto w-full max-w-4xl">
      {/* Header Card */}
      <Card className="mb-2 border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  AI Creative Generator
                </CardTitle>
                <p className="truncate text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  Generate compelling ad copy in multiple languages
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-10 w-full justify-between border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-400 dark:hover:bg-purple-900/20 sm:w-auto sm:min-w-[140px]"
                  >
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 flex-shrink-0 text-blue-500 dark:text-purple-400" />
                      <span className="truncate text-sm font-medium">
                        {language}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 flex-shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="max-h-[300px] overflow-y-auto">
                    {aiSupportedLanguages.map((lang) => (
                      <div
                        key={lang}
                        className={cn(
                          "flex cursor-pointer items-center px-3 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-purple-900/20",
                          language === lang &&
                            "bg-blue-50 text-blue-700 dark:bg-purple-900/30 dark:text-purple-300",
                        )}
                        onClick={() => {
                          setLanguage(lang);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 flex-shrink-0 text-blue-500 dark:text-purple-400",
                            language === lang ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="truncate">{lang}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleGenerateCreative}
                disabled={isLoading}
                className="h-10 w-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-xl disabled:opacity-50 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 flex-shrink-0 animate-spin" />
                    <span className="truncate">Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Generate</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Content - All fields in one beautiful card */}
      {adCreative && (
        <Card className="overflow-hidden border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              {[
                {
                  title: "Primary Text",
                  content: adCreative.primaryText,
                  icon: "📝",
                  description: "Main ad copy content",
                },
                {
                  title: "Headline",
                  content: adCreative.headline,
                  icon: "🎯",
                  description: "Attention-grabbing headline",
                },
                {
                  title: "Description",
                  content: adCreative.description,
                  icon: "📋",
                  description: "Supporting description",
                },
                {
                  title: "Call to Action",
                  content: adCreative.callToAction,
                  icon: "🚀",
                  description: "Action button text",
                },
              ].map((item, index) => (
                <div key={item.title} className="group relative">
                  {/* Separator line (except for last item) */}
                  {index < 3 && (
                    <div className="absolute left-4 top-full h-6 w-px bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-600 sm:left-6" />
                  )}

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-base shadow-sm dark:from-blue-950/30 dark:to-purple-950/30 sm:h-12 sm:w-12 sm:text-lg">
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <h4 className="truncate font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                          • {item.description}
                        </span>
                      </div>

                      <div className="group/content relative rounded-lg border border-gray-200 bg-gray-50/50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:border-gray-600 dark:bg-gray-900/30 dark:hover:border-purple-400/50 dark:hover:bg-purple-950/20 sm:p-4">
                        <p className="break-words pr-10 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {item.content}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 flex-shrink-0 bg-blue-100 p-0 dark:bg-purple-900/30"
                          onClick={() => handleCopy(item.content, item.title)}
                        >
                          {copiedField === item.title ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-blue-500 dark:text-purple-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!adCreative && !isLoading && (
        <Card className="border-dashed border-gray-300 bg-gray-50/50 dark:border-gray-600 dark:bg-gray-800/50">
          <CardContent className="py-12 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Ready to Generate
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Select your preferred language and click Generate to create
              compelling ad copy
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdCreativeGenerator;

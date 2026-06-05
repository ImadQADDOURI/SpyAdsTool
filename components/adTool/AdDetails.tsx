/**
 * AdDetails Component
 *
 * 🚀 This enhanced dialog component displays detailed ad information using a clean, tab-based layout.
 * It's designed for a modern, minimalist aesthetic with a focus on performance and user experience.
 * Data for each tab is lazy-loaded on demand to reduce initial API calls and improve efficiency.
 *
 * @package components/adLibrary
 */
import React, { useCallback, useRef, useState } from "react";
import { fetchMeta } from "@/actions/fetchMeta";
import { analyzeKeywords } from "@/actions/geminiAiService";
import {
  BarChart3,
  CheckCircle,
  ChevronRight,
  Euro,
  Globe,
  Lightbulb,
  Palette,
  Search,
} from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AdCard } from "./AdCard";
import Analytics from "./adInsights/Analytics";
import { EuAdStatistic } from "./adInsights/EuAdStatistic";
import AdCreativeGenerator from "./aiComponents/AdCreativeGenerator";
import KeywordAnalysisTable from "./aiComponents/KeywordAnalysisTable";
import WorldwideAdStatistics from "./aiComponents/WorldwideAdStatistics";
import AdOptionsCard from "./sharedComponents/AdOptionsCard";

interface AdDetailsProps {
  /** The advertisement data to display */
  ad: AdData;
  /** Optional custom trigger element */
  trigger?: React.ReactNode;
}

export const AdDetails = ({ ad, trigger }: AdDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  // 📦 State Management for different data sections
  const [detailedAds, setDetailedAds] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forwardCursor, setForwardCursor] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  const [adDetails, setAdDetails] = useState<any>(null);
  const [isLoadingEuStats, setIsLoadingEuStats] = useState(false);
  const [euStatsError, setEuStatsError] = useState<string | null>(null);

  const [keywordAnalysis, setKeywordAnalysis] = useState<any>(null);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  // 🔒 Simple flags to prevent duplicate API calls
  const keywordAnalysisInProgress = useRef(false);
  const euStatsInProgress = useRef(false);
  const adDetailsInProgress = useRef(false);

  // 🔄 Fetching collation details (ad versions)
  const fetchAdDetails = useCallback(async () => {
    if (isComplete || isLoading || adDetailsInProgress.current) return;

    adDetailsInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      if (!ad.collation_id || !ad.collation_count) {
        setDetailedAds([ad]);
        setIsComplete(true);
        setTotalCount(1);
        setRemainingCount(0);
        return;
      }

      const result = await fetchMeta(
        { name: "ad-collation" },
        {
          variables: {
            collationGroupID: ad.collation_id,
            forwardCursor: forwardCursor,
            backwardCursor: null,
            activeStatus: "ALL",
            adType: "ALL",

            bylines: [],
            countries: ["ALL"],
            location: null,
            potentialReach: [],
            publisherPlatforms: [],
            regions: [],
            // sessionID: "bbd54e31-9c73-49d2-a611-40e566fb4eae",
            startDate: null,
          },
          includeRaw: false,
        },
      );
      // Log diagnostics in browser console
      console.log("🩺 Diagnostic:", result.diagnostics, "\n", {
        name: result.name,
      });

      if (!result.success || !result.extracted) {
        console.error("❌ FetchMeta failed or no data extracted");
        return;
      }

      // ✅ Access the extracted object
      const results = result.extracted;

      // Normalize the Data
      const adCardsToAdd = Array.isArray(results.ad_cards)
        ? results.ad_cards
        : [results.ad_cards];

      setDetailedAds((prev) => [...prev, ...adCardsToAdd]);
      setForwardCursor(results.forward_cursor);
      setIsComplete(results.is_complete);
      setTotalCount((prev) => prev || results.total_count);
      setRemainingCount((prev) =>
        (prev || results.total_count) - adCardsToAdd.length > 0
          ? (prev || results.total_count) - adCardsToAdd.length
          : 0,
      );
    } catch (error) {
      console.error("❌ Error fetching ad details:", error);
      setError("An error occurred while fetching ad details.");
    } finally {
      setIsLoading(false);
      adDetailsInProgress.current = false;
    }
  }, [ad, forwardCursor, isComplete, isLoading]);

  // 🇪🇺 Fetching EU-specific ad statistics
  const fetchEuAdStats = useCallback(async () => {
    if (adDetails || isLoadingEuStats || euStatsInProgress.current) return;

    euStatsInProgress.current = true;
    setIsLoadingEuStats(true);
    setEuStatsError(null);

    try {
      const result = await fetchMeta(
        { name: "ad-details" },
        {
          variables: {
            adArchiveID: ad.ad_archive_id,
            pageID: ad.page_id,
            country: "ALL",

            isAdNonPolitical: true,
            isAdNotAAAEligible: false,
            // sessionID: "bbd54e31-9c73-49d2-a611-40e566fb4eae",
            source: null,
          },
          includeRaw: false,
        },
      );

      // Log diagnostics in browser console
      console.log("🩺 Diagnostic:", result.diagnostics, "\n", {
        name: result.name,
      });

      if (!result.success || !result.extracted) {
        console.error("❌ FetchMeta failed or no data extracted");
        return;
      }

      // ✅ Access the extracted object
      const data = result.extracted.transparency_by_location.eu_transparency;

      setAdDetails(data);
    } catch (err) {
      console.error("❌ Error fetching EU ad stats:", err);
      setEuStatsError("Failed to fetch EU ad statistics.");
    } finally {
      setIsLoadingEuStats(false);
      euStatsInProgress.current = false;
    }
  }, [
    ad.ad_archive_id,
    ad.page_id,
    ad.is_aaa_eligible,
    adDetails,
    isLoadingEuStats,
  ]);

  // 🔍 Fetching keyword analysis from AI service
  const fetchKeywordAnalysis = useCallback(async () => {
    if (
      keywordAnalysis ||
      isLoadingKeywords ||
      keywordAnalysisInProgress.current
    )
      return;

    keywordAnalysisInProgress.current = true;
    setIsLoadingKeywords(true);
    setKeywordError(null);

    try {
      const result = await analyzeKeywords(ad);
      setKeywordAnalysis(result);
    } catch (error) {
      console.error("❌ Error fetching keyword analysis:", error);
      setKeywordError("Failed to fetch keyword analysis.");
      setKeywordAnalysis((prev: any) => ({ ...prev, cpmEurope: 0 })); // Fallback
    } finally {
      setIsLoadingKeywords(false);
      keywordAnalysisInProgress.current = false;
    }
  }, [ad, keywordAnalysis, isLoadingKeywords]);

  // 🚪 Handles opening the dialog and fetching initial data
  const handleDialogOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && detailedAds.length === 0) {
      fetchAdDetails();
    }
  };

  // 👆 Handles tab changes and triggers data fetching
  const handleTabChange = async (value: string) => {
    setActiveTab(value);

    try {
      switch (value) {
        case "eu-stats":
          // 🇪🇺 EU stats tab: ensure keyword analysis is done first
          await fetchKeywordAnalysis();
          await fetchEuAdStats();
          break;
        case "keywords":
        case "worldwide":
          // 🌍 Keywords or Worldwide tab: requires keyword analysis data
          await fetchKeywordAnalysis();
          break;
        // 🤖 AI and Analytics tabs don't require extra data loading on tab change
        case "ai-creative":
        case "analytics":
        default:
          break;
      }
    } catch (error) {
      console.error("❌ Error in tab change:", error);
    }
  };

  // 🧹 Cleanup function to reset flags when component unmounts
  React.useEffect(() => {
    return () => {
      keywordAnalysisInProgress.current = false;
      euStatsInProgress.current = false;
      adDetailsInProgress.current = false;
    };
  }, []);

  const getCpmEurope = () => keywordAnalysis?.cpmEurope ?? 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          // from-[#ec4899] via-[#06b6d4] via-[#8b5cf6] to-[#3b82f6]
          <Button
            variant="outline"
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-md border-0 bg-gradient-to-r from-[#01bbfc] to-[#8b5cf6] px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5cf6]/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50"
          >
            <div className="absolute inset-0 bg-white opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-10" />
            <BarChart3 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative font-semibold tracking-wide">
              View Analytics
            </span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex h-[95svh] max-h-[95svh] w-full max-w-[95vw] flex-col bg-gray-50/95 p-0 backdrop-blur-sm dark:bg-gray-900/95">
        <DialogHeader className="flex-shrink-0 border-b border-gray-200 p-4 dark:border-gray-800">
          <DialogTitle className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
            Ad Details & Analytics
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex w-full flex-grow flex-col overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-transparent px-4 py-1 dark:border-gray-800">
            <div className="mx-auto flex max-w-screen-md justify-center gap-2">
              <TabsList className="flex gap-2 bg-transparent">
                <TabsTrigger
                  value="analytics"
                  className="group flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 shadow-md transition-all hover:bg-blue-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>

                <TabsTrigger
                  value="worldwide"
                  className="group flex items-center gap-2 rounded-md bg-purple-50 px-3 py-2 text-sm font-medium text-purple-600 shadow-md transition-all hover:bg-purple-100 data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">World Stats</span>
                </TabsTrigger>

                <TabsTrigger
                  value="eu-stats"
                  className="group flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 shadow-md transition-all hover:bg-indigo-100 data-[state=active]:bg-indigo-500 data-[state=active]:text-white dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white"
                >
                  <Euro className="h-4 w-4" />
                  <span className="hidden sm:inline">EU Stats</span>
                </TabsTrigger>

                <TabsTrigger
                  value="ai-creative"
                  className="group flex items-center gap-2 rounded-md bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 shadow-md transition-all hover:bg-pink-100 data-[state=active]:bg-pink-500 data-[state=active]:text-white dark:bg-pink-900/20 dark:text-pink-300 dark:hover:bg-pink-900/30 dark:data-[state=active]:bg-pink-600 dark:data-[state=active]:text-white"
                >
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Creative</span>
                </TabsTrigger>

                <TabsTrigger
                  value="keywords"
                  className="group flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-600 shadow-md transition-all hover:bg-green-100 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Keywords</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent
            value="analytics"
            className="flex-grow overflow-y-auto p-4"
          >
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* 👈 Left Column: Ad Card & Options */}
              <div className="w-full space-y-4 lg:w-3/12">
                <div className="hidden sm:block">
                  <AdCard ad={ad} compact />
                </div>
              </div>
              {/* 👉 Right Column: Analytics & Versions */}
              <div className="w-full space-y-3 lg:w-9/12">
                <div className="min-h-[400px]">
                  <Analytics
                    ads={detailedAds}
                    isComplete={isComplete}
                    isLoading={isLoading}
                    totalCount={totalCount}
                    remainingCount={remainingCount}
                    onLoadMore={fetchAdDetails}
                  />
                </div>
                <AdOptionsCard ad={ad} />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="worldwide"
            className="flex-grow overflow-y-auto p-4"
          >
            <WorldwideAdStatistics
              data={keywordAnalysis}
              isLoading={isLoadingKeywords}
              error={keywordError}
            />
          </TabsContent>

          <TabsContent
            value="eu-stats"
            className="flex-grow overflow-y-auto p-4"
          >
            <EuAdStatistic
              data={adDetails}
              isLoading={isLoadingEuStats || isLoadingKeywords}
              error={euStatsError}
              cpmEurope={getCpmEurope()}
            />
          </TabsContent>

          <TabsContent
            value="ai-creative"
            className="flex-grow overflow-y-auto p-4"
          >
            <AdCreativeGenerator ad={ad} />
          </TabsContent>

          <TabsContent
            value="keywords"
            className="flex-grow overflow-y-auto p-4"
          >
            <KeywordAnalysisTable
              data={keywordAnalysis}
              isLoading={isLoadingKeywords}
              error={keywordError}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

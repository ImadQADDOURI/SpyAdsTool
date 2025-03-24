/**
 * AdDetails Component
 *
 * A dialog component that displays detailed information about an advertisement,
 * including analytics, EU statistics, and keyword analysis. Data is lazy-loaded
 * when the dialog is opened.
 *
 * @package components/adLibrary
 */
import React, { useCallback, useState } from "react";
import { analyzeKeywords } from "@/actions/geminiAiService";
import {
  AdLibraryAdCollationDetailsQuery,
  AdLibraryAdDetailsV2Query,
  getAdLibraryAdCollationVariables,
  getAdLibraryAdDetailsV2Variables,
} from "@/utils/MetaGraphQLConstsAndFunctions";
import {
  BarChart3,
  CheckCircle,
  ChevronRight,
  Info,
  RefreshCw,
  X,
} from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Analytics from "@/components/adLibrary/adInsights/Analytics";
import { EuAdStatistic } from "@/components/adLibrary/adInsights/EuAdStatistic";
import AdCreativeGenerator from "@/components/adLibrary/aiComponents/AdCreativeGenerator";
import KeywordAnalysisTable from "@/components/adLibrary/aiComponents/KeywordAnalysisTable";

import { AdCard } from "./AdCard";
import AdCardGrid from "./microComponents/AdCardGrid";

interface AdDetailsProps {
  /** The advertisement data to display */
  ad: AdData;
  /** Optional custom trigger element */
  trigger?: React.ReactNode;
}

export const AdDetails = ({ ad, trigger }: AdDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [detailedAds, setDetailedAds] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forwardCursor, setForwardCursor] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  // EU ADs
  const [adDetails, setAdDetails] = useState<any>(null);
  const [isLoadingEuStats, setIsLoadingEuStats] = useState(false);
  const [euStatsError, setEuStatsError] = useState<string | null>(null);

  // Keyword Analysis
  const [keywordAnalysis, setKeywordAnalysis] = useState<any>(null);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const fetchAdDetails = useCallback(async () => {
    if (isComplete || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      if (!ad.collation_id || !ad.collation_count || ad.collation_count <= 1) {
        setDetailedAds([ad]);
        setIsComplete(true);
        setTotalCount(1);
        setRemainingCount(0);
        return;
      }

      const variables = getAdLibraryAdCollationVariables(
        ad.collation_id,
        forwardCursor,
        "ALL",
      );
      const results = await AdLibraryAdCollationDetailsQuery(variables);

      setDetailedAds((prev) => [...prev, ...results.ads]);
      setForwardCursor(results.forward_cursor);
      setIsComplete(results.is_complete);
      setTotalCount((prev) => prev || results.total_count);
      setRemainingCount((prev) => {
        const newCount = (prev || results.total_count) - results.ads.length;
        return newCount > 0 ? newCount : 0;
      });
    } catch (error) {
      console.error("Error fetching ad details:", error);
      setError(
        "An error occurred while fetching ad details. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [ad, forwardCursor, isComplete, isLoading]);

  // Function to get EU ad stats
  const fetchEuAdStats = useCallback(async () => {
    setIsLoadingEuStats(true);
    try {
      const variables = getAdLibraryAdDetailsV2Variables(
        ad.ad_archive_id,
        ad.page_id,
        ad.is_aaa_eligible,
      );
      const result = await AdLibraryAdDetailsV2Query(variables);
      setAdDetails(result);
    } catch (err) {
      setEuStatsError("Failed to fetch EU ad statistics");
    } finally {
      setIsLoadingEuStats(false);
    }
  }, [ad.ad_archive_id, ad.page_id, ad.is_aaa_eligible]);

  // Function to fetch keyword analysis
  const fetchKeywordAnalysis = useCallback(async () => {
    setIsLoadingKeywords(true);
    try {
      const result = await analyzeKeywords(ad);
      setKeywordAnalysis(result);
    } catch (error) {
      setKeywordError("Failed to analyze keywords");
      // Initialize with a fallback value so EuAdStatistic can still render
      setKeywordAnalysis((prev) => ({
        ...prev,
        cpmEurope: 0, // Fallback value
      }));
    } finally {
      setIsLoadingKeywords(false);
    }
  }, [ad]);

  const handleDialogOpen = async (open: boolean) => {
    setOpen(open);
    if (open && detailedAds.length === 0) {
      await Promise.all([
        fetchAdDetails(),
        fetchEuAdStats(),
        fetchKeywordAnalysis(),
      ]);
    }
  };

  // Safe access to cpmEurope with fallback
  const getCpmEurope = () => {
    if (!keywordAnalysis) return 0;
    return keywordAnalysis.cpmEurope ?? 0;
  };

  const handleLoadMore = () => {
    if (!isComplete && !isLoading) {
      fetchAdDetails();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-md border-0 bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-pink-400 hover:shadow-xl hover:shadow-pink-500/20 focus:border-0 focus:bg-gradient-to-r focus:from-purple-600 focus:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 dark:text-white dark:shadow-purple-600/20"
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

      {/* 📌 Updated DialogContent with fixed header and custom close button */}
      <DialogContent className="flex h-[95dvh] max-h-[95dvh] w-full max-w-[95vw] flex-col bg-gray-100/20 p-0 dark:bg-gray-800/20">
        {/* 🧠 Fixed header with custom close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/30 bg-gray-100/90 p-3 backdrop-blur-sm dark:border-gray-700/30 dark:bg-gray-800/90">
          <DialogTitle className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-2xl font-bold text-transparent">
            Ad Analytics
          </DialogTitle>

          {/* 🔄 Custom close button - repositioned to avoid URL bar overlap on mobile */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        {/* 📦 Main Container using ScrollArea for controlled scrolling */}
        <ScrollArea className="w-full flex-1">
          <div className="flex h-full flex-col gap-1 p-3 lg:flex-row">
            {/* 📱 Left Panel */}
            <div className="w-full lg:w-3/12 lg:pr-2">
              <div className="space-y-2">
                <AdCreativeGenerator ad={ad} />
                <AdCardGrid ads={ad} />
              </div>
            </div>

            {/* 📊 Right Panel */}
            <div className="mt-2 w-full lg:mt-0 lg:w-9/12">
              <div className="space-y-2">
                {/* Analytics Section with Controls */}
                <div className="rounded-lg border border-gray-200/30 dark:border-gray-700/30">
                  {/* Analytics Header */}
                  <div className="rounded-t-lg border bg-white p-3 shadow-sm dark:border-gray-700/30 dark:bg-gray-900">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      {/* Load More Controls */}
                      {!isComplete ? (
                        <Button
                          onClick={handleLoadMore}
                          disabled={isLoading}
                          className="flex h-9 items-center gap-2 bg-gradient-to-r from-[#34D399] to-[#10B981] text-sm font-medium text-white transition-all hover:from-[#2EBC89] hover:to-[#0EA572] focus:ring-2 focus:ring-green-500/30"
                        >
                          {isLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span>
                            {isLoading ? "Loading..." : "Load More Ad versions"}
                          </span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium">
                            All Ad Versions loaded
                          </span>
                        </div>
                      )}

                      {/* Total Count */}
                      {totalCount !== null && (
                        <div className="flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          <span className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            {remainingCount !== null && remainingCount > 0 ? (
                              <span>{`${remainingCount} of ${totalCount} ads remaining`}</span>
                            ) : (
                              <span>{`${totalCount} total ads`}</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analytics Content */}
                  <div className="min-h-[250px]">
                    <Analytics ads={detailedAds} />
                  </div>
                </div>

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <KeywordAnalysisTable
                    data={keywordAnalysis}
                    isLoading={isLoadingKeywords}
                    error={keywordError}
                  />
                  <EuAdStatistic
                    data={adDetails}
                    isLoading={
                      isLoadingEuStats ||
                      (isLoadingKeywords && !keywordAnalysis)
                    }
                    error={euStatsError}
                    cpmEurope={getCpmEurope()}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

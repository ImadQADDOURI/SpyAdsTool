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
} from "@/actions/Meta-GraphQL-Queries";
import {
  getAdLibraryAdCollationVariables,
  getAdLibraryAdDetailsV2Variables,
} from "@/utils/adSearchVariables";
import {
  BarChart3,
  CheckCircle,
  ChevronRight,
  Info,
  RefreshCw,
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
import Analytics from "@/components/adLibrary/adInsights/Analytics";
import { EuAdStatistic } from "@/components/adLibrary/adInsights/EuAdStatistic";
import AdCreativeGenerator from "@/components/adLibrary/aiComponents/AdCreativeGenerator";
import KeywordAnalysisTable from "@/components/adLibrary/aiComponents/KeywordAnalysisTable";

import { AdCard } from "./AdCard";

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
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-md border-2 border-[#6566F1]/30 bg-gradient-to-r from-[#6566F1]/15 to-[#B977F8]/15 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-md transition-all duration-300 hover:border-[#6566F1]/50 hover:from-[#6566F1]/25 hover:to-[#B977F8]/25 hover:shadow-lg hover:shadow-[#6566F1]/10 dark:border-[#6566F1]/30 dark:bg-gradient-to-r dark:from-[#6566F1]/20 dark:to-[#B977F8]/20 dark:text-gray-200 dark:hover:border-[#B977F8]/50 dark:hover:from-[#6566F1]/30 dark:hover:to-[#B977F8]/30 dark:hover:shadow-[#B977F8]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <BarChart3 className="h-4.5 w-4.5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#8485FF]" />
            <span className="relative font-medium">View Analytics</span>
            <ChevronRight className="h-4 w-4 text-[#6566F1]/70 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-[#8485FF]/70" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-y-auto bg-gray-100/20 dark:bg-gray-800/20 lg:overflow-hidden">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-2xl font-bold text-transparent">
            Ad Analytics
          </DialogTitle>
        </DialogHeader>

        {/* Main Container */}
        <div className="flex min-h-[calc(90vh-6rem)] flex-col gap-1 lg:h-[calc(90vh-6rem)] lg:flex-row lg:overflow-hidden">
          {/* Left Panel */}
          <div className="w-full px-1 py-2 lg:w-3/12 lg:overflow-y-auto">
            <div className="space-y-1">
              <AdCreativeGenerator ad={ad} />
              <AdCard ad={ad} />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full py-2 lg:w-9/12 lg:overflow-y-auto">
            <div className="space-y-1">
              {/* Analytics Section with Controls */}
              <div className="rounded-lg border border-gray-200/30 dark:border-gray-700/30">
                {/* Analytics Header */}
                <div className="rounded-lg border bg-white px-2 py-1 dark:border-gray-700/30 dark:bg-gray-900">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {/* Load More Controls */}
                    {!isComplete ? (
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="flex h-9 items-center gap-2 bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-sm font-medium text-white transition-colors hover:from-[#5859D9] hover:to-[#A66ADF]"
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
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          All Ad Versions loaded
                        </span>
                      </div>
                    )}

                    {/* Total Count */}
                    {totalCount !== null && (
                      <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
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
                <div className="min-h-[300px]">
                  <Analytics ads={detailedAds} />
                </div>
              </div>

              {/* Bottom Stats Grid */}
              <div className="grid min-h-[200px] grid-cols-1 gap-1 lg:grid-cols-2">
                <EuAdStatistic
                  data={adDetails}
                  isLoading={isLoadingEuStats}
                  error={euStatsError}
                />
                <KeywordAnalysisTable
                  data={keywordAnalysis}
                  isLoading={isLoadingKeywords}
                  error={keywordError}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
import { CheckCircle, ChevronRight, RefreshCw } from "lucide-react";

import { AdData } from "@/types/ad";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
            className="w-full bg-gradient-to-r from-purple-600/10 to-pink-500/10 hover:from-purple-600/20 hover:to-pink-500/20"
          >
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-hidden p-6">
        <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
          Ad Details
        </h2>
        <div className="flex h-[calc(100%-3rem)] flex-col gap-6 lg:flex-row">
          <AdCard ad={ad} />
          <div className="h-1/2 w-full overflow-hidden rounded-lg bg-gray-50 shadow-inner dark:bg-gray-900 lg:h-full lg:w-1/2">
            <AdCreativeGenerator ad={ad} />
          </div>
          <div className="h-1/2 w-full overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-inner dark:bg-gray-900 lg:h-full lg:w-1/2">
            <div className="mb-4 flex items-center justify-between">
              {!isComplete ? (
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>{isLoading ? "Loading..." : "Load More Ads"}</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">All ads loaded</span>
                </div>
              )}
              {totalCount !== null && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {remainingCount !== null && remainingCount > 0 ? (
                    <span>{`${remainingCount} of ${totalCount} ads remaining`}</span>
                  ) : (
                    <span>{`${totalCount} total ads`}</span>
                  )}
                </div>
              )}
            </div>
            <Analytics ads={detailedAds} />
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
      </DialogContent>
    </Dialog>
  );
};

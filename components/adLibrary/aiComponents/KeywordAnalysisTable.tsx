import React, { useState } from "react";
import { AdAnalysis } from "@/actions/geminiAiService";
import { Check, ChevronDown, ChevronUp, Copy, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ExpandableText from "../microComponents/expandableText";
import { Loading } from "../microComponents/Loading";

interface KeywordAnalysisTableProps {
  data: AdAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

const KeywordAnalysisTable: React.FC<KeywordAnalysisTableProps> = ({
  data,
  isLoading,
  error,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copyingTop, setCopyingTop] = useState(false);
  const [copyingLong, setCopyingLong] = useState(false);

  const handleCopyKeywords = async (type: "top" | "long") => {
    const keywords =
      type === "top"
        ? data?.topKeywords.map((k) => k.word).join(", ")
        : data?.longTailKeywords.map((k) => k.phrase).join(", ");

    if (keywords) {
      try {
        await navigator.clipboard.writeText(keywords);
        if (type === "top") {
          setCopyingTop(true);
          setTimeout(() => setCopyingTop(false), 1000);
        } else {
          setCopyingLong(true);
          setTimeout(() => setCopyingLong(false), 1000);
        }
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  if (isLoading) {
    return <Loading message="Analyzing keywords..." size="small" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-100/50 p-3 text-red-700 dark:bg-red-900/50 dark:text-red-300">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        No keyword data available
      </div>
    );
  }

  const displayCount = expanded
    ? Math.max(data.topKeywords.length, data.longTailKeywords.length)
    : 5;

  const InsightItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | string[] | number;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex min-w-[80px] max-w-[200px] cursor-default flex-col gap-0.5 rounded-lg bg-gray-100/50 p-2 text-center dark:bg-gray-800/50">
            <div className="flex flex-row items-center justify-between gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {label}
              </span>
              <Info className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            </div>

            <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {Array.isArray(value)
                ? value.length > 0
                  ? value[0]
                  : "Not specified"
                : value || "Not specified"}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          <div className="space-y-1.5 p-1 text-sm">
            <div className="font-medium">{label}</div>
            {Array.isArray(value)
              ? value.length > 0
                ? value.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      {item}
                    </div>
                  ))
                : "Not specified"
              : value || "Not specified"}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 dark:bg-gray-900">
      <div className="space-y-3 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-lg font-semibold text-transparent">
            AI-Powered Ad Insights
          </h3>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="max-w-xs p-2"
              >
                <p className="text-xs">
                  AI-generated insights from ad content analysis
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* First Row of Insights */}
        <div className="flex flex-wrap gap-1">
          <InsightItem label="Gender" value={data.genderTarget} />
          <InsightItem label="Age" value={data.ageTarget} />
          <InsightItem label="Season" value={data.seasonTarget} />
          <InsightItem label="CPM" value={`$${data.cpm}`} />
          <InsightItem label="Competition" value={`${data.competition}%`} />
          <InsightItem label="Budget" value={data.estimatedBudget} />
        </div>

        {/* Second Row of Insights */}
        <div className="flex flex-wrap gap-1">
          <InsightItem label="Audience" value={data.targetAudience} />
          <InsightItem label="Category" value={data.adCategories} />
          <InsightItem label="Marketing" value={data.marketingStrategies} />
        </div>
      </div>

      {/* Keywords Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="max-w-[300px] bg-gray-50 py-2 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    Top Focus Keywords
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyKeywords("top")}
                  >
                    {copyingTop ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </TableHead>
              <TableHead className="max-w-[300px] bg-gray-50 py-2 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    Long-Tail Keywords
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyKeywords("long")}
                  >
                    {copyingLong ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: displayCount }).map((_, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="max-w-[300px] py-1.5">
                  {data.topKeywords[index] && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <ExpandableText
                          text={data.topKeywords[index].word}
                          maxLength={20}
                          singleLine
                        />
                      </div>
                      <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        ({data.topKeywords[index].count})
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="max-w-[300px] py-1.5">
                  {data.longTailKeywords[index] && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <ExpandableText
                          text={data.longTailKeywords[index].phrase}
                          maxLength={20}
                          singleLine
                        />
                      </div>
                      <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        ({data.longTailKeywords[index].count})
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {Math.max(data.topKeywords.length, data.longTailKeywords.length) > 5 && (
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          size="sm"
          className="w-full bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default KeywordAnalysisTable;

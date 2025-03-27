import React, { useState } from "react";
import { AdAnalysis } from "@/actions/geminiAiService";
import {
  Baby,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Info,
  Megaphone,
  OctagonAlert,
  Snowflake,
  SunSnow,
  Tags,
  UserRound,
  VenusAndMars,
} from "lucide-react";

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
import BudgetIndicator from "./BudgetIndicator";
import CompetitionRadialChart from "./CompetitionRadialChart";
import CPMDisplay from "./CPMDisplay";
import InsightItem from "./InsightItem";

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
    return <Loading message="Loading Worldwide Statistics..." size="small" />;
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
      <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <OctagonAlert className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          No Worldwide Statistics available.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          this ad is not targeted worldwide.
        </p>
      </div>
    );
  }

  const displayCount = expanded
    ? Math.max(data.topKeywords.length, data.longTailKeywords.length)
    : 5;

  return (
    <div className="w-full space-y-2 rounded-lg bg-white px-2 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700">
        <h3 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-lg font-semibold text-transparent">
          Worldwide Statistics
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="max-w-xs p-2">
              <p className="text-xs">
                Detailed audience insights and Statistics
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Insights Grid Container */}
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {/* Demographics Insights */}
        <InsightItem
          label="Gender"
          value={data.genderTarget}
          description="Target audience gender distribution"
          icon={VenusAndMars}
        />
        <InsightItem
          label="Age"
          value={data.ageTarget}
          description="Primary age groups for targeting"
          icon={Baby}
        />
        <InsightItem
          label="Season"
          value={data.seasonTarget}
          description="Optimal seasonal timing"
          icon={Snowflake}
        />

        {/* Performance Metrics */}
        <CompetitionRadialChart competition={data.competition} />
        <CPMDisplay value={data.cpm} />
        <BudgetIndicator budget={data.estimatedBudget} />

        {/* Additional Insights */}
        <InsightItem
          label="Target"
          value={data.targetAudience}
          description="Target audience characteristics and preferences"
          icon={UserRound}
        />
        <InsightItem
          label="Category"
          value={data.adCategories}
          description="Primary advertising categories"
          icon={Tags}
        />
        <InsightItem
          label="Marketing"
          value={data.marketingStrategies}
          description="Recommended marketing approaches"
          icon={Megaphone}
        />
      </div>
      {/* Keywords Table - Container with responsive design */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {/* 👇 Use a responsive container with horizontal scroll for small screens */}
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {/* 🎯 Header cells with minimum width and flexible growth */}
                <TableHead className="w-1/2 bg-gray-50 py-2 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-medium">
                      Top Focus Keywords
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
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
                <TableHead className="w-1/2 bg-gray-50 py-2 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-medium">
                      Long-Tail Keywords
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
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
                  {/* ✨ Cell styling for responsive content */}
                  <TableCell className="w-1/2 py-1.5">
                    {data.topKeywords[index] && (
                      <div className="flex items-center justify-between gap-2">
                        {/* 📏 Ensure text has minimum width of 0 to enable proper truncation */}
                        <div className="min-w-0 flex-1">
                          <ExpandableText
                            text={data.topKeywords[index].word}
                            singleLine
                            showIcon={false}
                          />
                        </div>
                        <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                          ({data.topKeywords[index].count})
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="w-1/2 py-1.5">
                    {data.longTailKeywords[index] && (
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <ExpandableText
                            text={data.longTailKeywords[index].phrase}
                            singleLine
                            showIcon={false}
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
      </div>

      {/* 🔽 Show More/Less button - full width with proper spacing */}
      {Math.max(data.topKeywords.length, data.longTailKeywords.length) > 5 && (
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          size="sm"
          className="w-full bg-transparent text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
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

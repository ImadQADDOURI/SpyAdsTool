import React, { useState } from "react";
import { AdAnalysis } from "@/actions/geminiAiService";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Flame,
  Hash,
  Search,
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

import ExpandableText from "../sharedComponents/expandableText";
import { Loading } from "../sharedComponents/Loading";

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

  if (isLoading) {
    return <Loading message="Loading Keyword Analysis Table..." size="small" />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/80 p-4 shadow-sm dark:border-red-800 dark:from-red-900/20 dark:to-red-800/20">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <p className="font-medium">Error</p>
        </div>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

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
          setTimeout(() => setCopyingTop(false), 1500);
        } else {
          setCopyingLong(true);
          setTimeout(() => setCopyingLong(false), 1500);
        }
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  if (!data) {
    return null;
  }

  const displayCount = expanded
    ? Math.max(data.topKeywords.length, data.longTailKeywords.length)
    : 5;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
          <Search className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Keyword Analysis
        </h3>
      </div>

      {/* Keywords Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-900/50">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent dark:border-gray-800">
                <TableHead className="w-1/2 bg-gradient-to-r from-emerald-50 to-green-50 py-3 dark:from-emerald-900/20 dark:to-green-900/20">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Focus Keywords
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                      onClick={() => handleCopyKeywords("top")}
                      title="Copy all top keywords"
                    >
                      {copyingTop ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400" />
                      )}
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="w-1/2 bg-gradient-to-r from-green-50 to-emerald-50 py-3 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Long Keywords
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30"
                      onClick={() => handleCopyKeywords("long")}
                      title="Copy all long-tail keywords"
                    >
                      {copyingLong ? (
                        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400" />
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
                  className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                >
                  <TableCell className="w-1/2 py-3">
                    {data.topKeywords[index] && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <ExpandableText
                            text={data.topKeywords[index].word}
                            singleLine
                            showIcon={false}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {data.topKeywords[index].count}
                          </span>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="w-1/2 py-3">
                    {data.longTailKeywords[index] && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <ExpandableText
                            text={data.longTailKeywords[index].phrase}
                            singleLine
                            showIcon={false}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {data.longTailKeywords[index].count}
                          </span>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      {Math.max(data.topKeywords.length, data.longTailKeywords.length) > 5 && (
        <div className="flex justify-center">
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="outline"
            size="sm"
            className="group border-gray-200 bg-white text-gray-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </>
            ) : (
              <>
                Show More
                <ChevronDown className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default KeywordAnalysisTable;

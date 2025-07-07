import React, { useState } from "react";
import { AdAnalysis } from "@/actions/geminiAiService";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  if (isLoading) {
    return <Loading message="Loading Keyword Analysis Table..." size="small" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-100/50 p-3 text-red-700 dark:bg-red-900/50 dark:text-red-300">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
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

  if (!data) {
    return null;
  }

  const displayCount = expanded
    ? Math.max(data.topKeywords.length, data.longTailKeywords.length)
    : 5;

  return (
    <div className="w-full space-y-2">
      {/* Keywords Table - Container with responsive design */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
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
                  <TableCell className="w-1/2 py-1.5">
                    {data.topKeywords[index] && (
                      <div className="flex items-center justify-between gap-2">
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

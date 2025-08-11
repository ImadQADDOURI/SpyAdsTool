import React, { useCallback, useEffect, useRef, useState } from "react";
import parse, {
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import { Check, ChevronDown, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpandableTextProps {
  text: string | null | undefined;
  className?: string;
  singleLine?: boolean;
  showIcon?: boolean;
}

/**
 * ExpandableText - A flexible component for displaying text with truncation
 */
const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  className,
  singleLine = false,
  showIcon = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process text content safely
  const { parsedText, textContent } = useCallback(() => {
    if (!text || text.trim() === "" || text === "{{product.description}}") {
      return { parsedText: null, textContent: "" };
    }

    try {
      // Simple sanitization - replace problematic characters
      const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      // Simple parsing without complex options
      const parsed = parse(sanitizedText);

      // Extract text content safely
      let content = "";
      if (typeof parsed === "string") {
        content = parsed;
      } else {
        content = text.replace(/<[^>]*>/g, ""); // Fallback: strip HTML tags
      }

      return { parsedText: parsed, textContent: content };
    } catch (err) {
      // Fallback to plain text
      return { parsedText: text, textContent: text };
    }
  }, [text])();

  // Check if text is truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current && containerRef.current) {
        if (singleLine) {
          setIsTruncated(
            textRef.current.scrollWidth > textRef.current.clientWidth,
          );
        } else {
          setIsTruncated(
            textRef.current.scrollHeight > textRef.current.clientHeight,
          );
        }
      }
    };

    const timeoutId = setTimeout(checkTruncation, 10);
    window.addEventListener("resize", checkTruncation);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [parsedText, singleLine]);

  // Handle copy to clipboard
  const handleCopy = useCallback(() => {
    if (!textContent) return;

    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        // Silent fail - no need to show errors to users for copy actions
      });
  }, [textContent]);

  // Return null if no valid text
  if (!parsedText) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative inline-flex items-center gap-1.5",
        singleLine && "w-full",
        className,
      )}
    >
      <span
        ref={textRef}
        className={cn(
          "transition-all duration-300 ease-in-out",
          singleLine ? "w-full truncate" : "line-clamp-2",
        )}
      >
        {parsedText}
      </span>

      {/* Show chevron icon when needed */}
      {(showIcon || isTruncated) && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-6 flex-shrink-0 rounded-full bg-gray-100 p-0",
                "text-gray-500 hover:bg-gray-200 hover:text-gray-700",
                "focus:ring-2 focus:ring-gray-300 focus-visible:outline-none",
                "dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
                isOpen && "bg-gray-200 text-gray-700 dark:bg-gray-600",
              )}
              aria-label="Show full text"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  isOpen && "rotate-180 transform",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-80 max-w-[90vw] rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-3 max-h-64 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
              {parsedText}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full border-0 bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-xs text-white shadow-sm hover:opacity-90"
              onClick={handleCopy}
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ExpandableText;

import React, { useCallback, useMemo, useState } from "react";
import parse from "html-react-parser";
import { Check, Copy, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpandableTextProps {
  text: string | null | undefined;
  maxLength: number;
  className?: string;
  singleLine?: boolean;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxLength,
  className,
  singleLine = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const { parsedText, textContent, isTextLong, displayText } = useMemo(() => {
    if (!text || text.trim() === "") {
      return {
        parsedText: null,
        textContent: "",
        isTextLong: false,
        displayText: "",
      };
    }

    const parsed = parse(text);
    const content =
      typeof parsed === "string"
        ? parsed
        : React.Children.toArray(parsed)
            .map((child) => {
              if (typeof child === "string") return child;
              if (
                React.isValidElement(child) &&
                typeof child.props.children === "string"
              )
                return child.props.children;
              return "";
            })
            .join(" ");

    const long = content.length > maxLength;
    const display = singleLine
      ? content
      : long
        ? content.slice(0, maxLength) + "..."
        : content;

    return {
      parsedText: parsed,
      textContent: content,
      isTextLong: long,
      displayText: display,
    };
  }, [text, maxLength, singleLine]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [textContent]);

  if (!parsedText) {
    return null;
  }

  return (
    <div
      className={cn(
        "group relative inline-flex items-center",
        singleLine && "w-full",
        className,
      )}
    >
      <span
        className={cn(
          "transition-all duration-300 ease-in-out",
          singleLine && "flex-grow truncate",
        )}
      >
        {parse(displayText)}
      </span>
      {(isTextLong || singleLine) && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-6 flex-shrink-0 rounded-full bg-gray-100 p-0 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100 dark:focus:ring-gray-600",
                singleLine ? "ml-1" : "ml-1",
              )}
              aria-label="Show more text"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 max-h-60 overflow-y-auto text-sm text-gray-700 dark:text-gray-300">
              {parsedText}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full text-xs"
              onClick={handleCopy}
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-5 w-5" />
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

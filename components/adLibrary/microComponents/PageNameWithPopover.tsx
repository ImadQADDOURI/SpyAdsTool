import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Eye, Globe, ThumbsUp } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PageNameWithPopoverProps {
  snapshot: {
    page_name: string;
    page_categories?: Record<string, string>;
    page_like_count?: number;
    link_url?: string;
    page_profile_uri?: string;
    page_profile_picture_url?: string;
    page_id: string;
  };
}

const PageNameWithPopover: React.FC<PageNameWithPopoverProps> = ({
  snapshot,
}) => {
  const {
    page_name,
    page_categories,
    page_like_count,
    link_url,
    page_profile_uri,
    page_profile_picture_url,
    page_id,
  } = snapshot;

  const categories = page_categories
    ? Object.values(page_categories).join(", ")
    : "";
  const domain = link_url ? new URL(link_url).hostname : "";

  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 300); // Close after 300ms
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !triggerRef.current?.contains(event.target as Node) &&
        !contentRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="inline-flex items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            className="inline-flex items-center space-x-2 rounded-full bg-gray-50 pr-2 transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {page_profile_picture_url && (
              <Image
                src={page_profile_picture_url}
                alt={page_name || "Page profile"}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium text-gray-800 hover:underline dark:text-gray-200">
              {page_name || "Unknown Page"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          ref={contentRef}
          className="w-80 rounded-lg border-none bg-white p-4 shadow-lg dark:bg-gray-800"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-start space-x-4">
            {page_profile_picture_url && (
              <Image
                src={page_profile_picture_url}
                alt={page_name || "Page profile"}
                width={60}
                height={60}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {page_name}
              </h3>
              {categories && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {categories}
                </p>
              )}
              {page_like_count !== undefined && (
                <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {page_like_count.toLocaleString()} likes
                </p>
              )}
              {domain && (
                <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Globe className="mr-1 h-4 w-4" />
                  <a
                    href={link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {domain}
                  </a>
                </p>
              )}
            </div>
          </div>
          {page_profile_uri && (
            <div className="mt-4 flex justify-end space-x-2">
              <Link
                href={`/adlibrary/${page_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <Eye className="mr-1 h-3 w-3" />
                View Ads
              </Link>
              <a
                href={page_profile_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Go to Page
              </a>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PageNameWithPopover;

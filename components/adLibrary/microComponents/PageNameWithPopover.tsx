import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Eye, Globe, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageNameWithHoverCardProps {
  snapshot: any;
}

const PageNameWithHoverCard: React.FC<PageNameWithHoverCardProps> = ({
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

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button className="duration-50 group flex min-w-0 items-center space-x-2 rounded-full pr-2 transition-all ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
          {page_profile_picture_url ? (
            <Image
              src={page_profile_picture_url}
              alt={page_name || "Page profile"}
              width={32}
              height={32}
              className="shrink-0 rounded-full border border-gray-200 transition-transform duration-200 group-hover:scale-110 dark:border-gray-700"
            />
          ) : (
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          )}
          <span className="min-w-0 flex-1 truncate font-medium text-gray-800 transition-colors duration-200 group-hover:text-purple-600 dark:text-gray-200 dark:group-hover:text-purple-400">
            {page_name || "Unknown Page"}
          </span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 rounded-lg border border-gray-200 bg-white/85 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/85">
        <div className="flex items-start space-x-4">
          {page_profile_picture_url ? (
            <Image
              src={page_profile_picture_url}
              alt={page_name || "Page profile"}
              width={60}
              height={60}
              className="rounded-full border-2 border-gray-200 shadow-md dark:border-gray-600"
            />
          ) : (
            <Skeleton className="h-16 w-16 rounded-full" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-gray-800 dark:text-gray-200">
              {page_name}
            </h3>
            {categories && (
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                {categories}
              </p>
            )}
            {page_like_count !== undefined && (
              <p className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <ThumbsUp className="mr-1 h-4 w-4 text-blue-500" />
                {page_like_count?.toLocaleString()} likes
              </p>
            )}
            {domain && (
              <p className="mt-1 flex items-center truncate text-sm text-gray-600 dark:text-gray-300">
                <Globe className="mr-1 h-4 w-4 text-green-500" />
                <a
                  href={link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 transition-colors duration-200 hover:text-blue-600 hover:underline"
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
              href={{
                pathname: `/adlibrary/${page_id}`,
                query: { page_id: page_id, active_status: "ALL" },
              }}
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
              <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                <Eye className="mr-2 h-4 w-4" />
                View Ads
              </button>
            </Link>
            <a
              href={page_profile_uri}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="rounded-full shadow-sm transition-shadow duration-200 hover:shadow"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Page
              </Button>
            </a>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default PageNameWithHoverCard;

// @/components/adLibrary/AdCard.tsx
import React, { memo, useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  CircleCheck,
  CircleX,
  Facebook,
  Flame,
  Instagram,
  MessageCircle,
} from "lucide-react";

import { AdData } from "@/types/ad";
import SaveAdButton from "@/components/adTool/favorites/SaveAdButton";

import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AdDetails } from "./AdDetails";
import AdminTrendButton from "./favorites/AdminTrendButton";
import { AdOptions } from "./sharedComponents/AdOptions";
import DisplayPixelPlatformPayment from "./sharedComponents/DisplayPixelPlatformPayment";
import PageNameWithPopover from "./sharedComponents/PageNameWithPopover";
import RenderMedia from "./sharedComponents/renderMedia";
import SubscriptionAccessGuard from "./subscription/SubscriptionAccessGuard";

interface AdCardProps {
  ad: AdData | undefined; // 🎯 Explicitly handle undefined
  compact?: boolean;
}

// 🚀 Memoized platform icons to prevent re-creation on every render
const PLATFORM_ICONS = {
  facebook: <Facebook className="h-5 w-5" color="#0866FF" />,
  instagram: <Instagram className="h-5 w-5" color="#D915DA" />,
  messenger: <MessageCircle className="h-5 w-5" color="#0084FF" />,
  audience_network: (
    <Image
      src="/icons/audience_network_facebook.svg"
      alt="Audience Network Facebook"
      width={24}
      height={24}
      className="h-5 w-5"
      unoptimized
    />
  ),
} as const;

// 🎯 Memoized date formatter for better performance
const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// 📊 Pre-computed date references to avoid recreating on every render
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const YESTERDAY = new Date(TODAY);
YESTERDAY.setDate(YESTERDAY.getDate() - 1);

const AdCard: React.FC<AdCardProps> = memo(({ ad, compact = false }) => {
  // 🎯 Safe destructuring with fallback values - hooks must be called first!
  const {
    start_date,
    end_date,
    publisher_platform,
    is_active,
    snapshot,
    collation_count,
    is_aaa_eligible,
  } = ad || {};

  // 🎨 Memoized platform icons rendering
  const platformIcons = useMemo(() => {
    if (!publisher_platform?.length) return null;

    return publisher_platform.map((platform) => (
      <span key={platform} className="mr-1" title={platform}>
        {PLATFORM_ICONS[platform.toLowerCase() as keyof typeof PLATFORM_ICONS]}
      </span>
    ));
  }, [publisher_platform]);

  // 📅 Memoized date rendering logic
  const dateDisplay = useMemo(() => {
    const startDateObj = start_date ? new Date(start_date * 1000) : null;
    const endDateObj = end_date ? new Date(end_date * 1000) : null;

    if (!startDateObj || !endDateObj) {
      return "N/A";
    }

    if (endDateObj < startDateObj || endDateObj >= YESTERDAY) {
      return `Started on ${formatDate(start_date)}`;
    }

    return `${formatDate(start_date)} - ${formatDate(end_date)}`;
  }, [start_date, end_date]);

  // 🎭 Memoized status styles
  const statusStyles = useMemo(
    () => ({
      className: `flex h-7 items-center gap-1.5 rounded-full px-2 transition-colors duration-300 ${
        is_active
          ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300"
          : "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300"
      }`,
      icon: is_active ? (
        <CircleCheck className="h-4 w-4" />
      ) : (
        <CircleX className="h-4 w-4" />
      ),
      text: is_active ? "Active" : "Inactive",
    }),
    [is_active],
  );

  // 🔥 Memoized hot indicator
  const isHotAd = useMemo(
    () => collation_count && collation_count >= 5,
    [collation_count],
  );

  // 🛡️ Conditional rendering after all hooks are called
  if (!ad) {
    return;
  }

  return (
    <Card
      className={`relative flex h-fit w-full max-w-lg flex-col overflow-hidden transition-shadow duration-300 ${
        isHotAd
          ? "shadow-[0_0_10px_1px_rgba(148,0,211,0.5)] dark:shadow-[0_0_10px_1px_rgba(148,0,211,0.85)]"
          : "shadow-lg hover:shadow-xl"
      }`}
    >
      {!compact && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute left-0 top-0 flex items-center gap-1 rounded-br-3xl rounded-tr-lg border border-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1.5 text-[#3B82F6] shadow-md ring-1 ring-inset ring-white/20 backdrop-blur-lg transition-all duration-300 hover:border-[#3B82F6]/80 hover:bg-[#3B82F6]/20 dark:border-[#3B82F6]/70 dark:bg-[#3B82F6]/15 dark:ring-[#3B82F6]/30">
                <span
                  className={clsx(
                    "text-sm font-semibold tracking-tight",
                    isHotAd
                      ? "text-[#FF5252] dark:text-red-400"
                      : "text-[#3B82F6] dark:text-[#3B82F6]",
                  )}
                >
                  {collation_count || 0}
                </span>

                <span className="text-xs font-medium text-[#3B82F6] dark:text-[#3B82F6]">
                  ADS
                </span>

                {isHotAd && (
                  <Flame
                    size={16}
                    className="scale-110 animate-pulse text-[#FF5252] drop-shadow-[0_0_4px_rgba(255,82,82,0.5)]"
                    aria-label="hot"
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collation_count} ads use this creative and text</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {/* 💾 Save buttons */}
      <div className="absolute -top-1 right-12 pt-1.5">
        <div className="flex gap-1">
          <AdminTrendButton ad={ad} className="" />
          <SubscriptionAccessGuard>
            <SaveAdButton ad={ad} />
          </SubscriptionAccessGuard>
        </div>
      </div>

      {/* ⚙️ Options button - hidden in compact mode */}
      {<AdOptions ad={ad} />}

      <CardContent
        className={`flex flex-grow flex-col justify-between px-0.5 py-0 ${
          compact ? "mt-2" : "mt-10"
        }`}
      >
        <div className="flex flex-grow flex-col justify-between">
          <div className="space-y-2.5">
            {/* 📅 Date and EU transparency row - hidden in compact mode */}
            {!compact && (
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span>{dateDisplay}</span>
                </div>

                {/* 🇪🇺 EU transparency indicator */}
                {is_aaa_eligible && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                          <Image
                            src="/flags/european_union.svg"
                            alt="EU"
                            width={20}
                            height={20}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>EU Transparency</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {/* ⚡ Status and Platform row - Platforms hidden in compact mode */}

            <div className="flex items-center justify-between px-2">
              {/* Status indicator */}
              <div className="flex items-center gap-1">
                <div className={statusStyles.className}>
                  {statusStyles.icon}
                  <span className="text-sm">{statusStyles.text}</span>
                </div>
              </div>

              {/* Platform icons */}
              {!compact && (
                <div className="flex items-center">{platformIcons}</div>
              )}
            </div>

            {/* 📄 Page name */}
            <div className="px-2">
              <PageNameWithPopover snapshot={snapshot} />
            </div>

            {/* 🖼️ Media carousel */}
            <RenderMedia snapshot={snapshot} compact={compact} />
          </div>

          {/* Analytics section - hidden in compact mode */}
          {!compact && (
            <div>
              {/* Divider */}
              <hr className="m-0.5 border-t border-gray-200 dark:border-gray-700" />

              {/* Pixel, Platform, Payment info */}
              {/* <SubscriptionAccessGuard>
                <DisplayPixelPlatformPayment
                  url={snapshot?.link_url || undefined}
                  usePuppeteer={true}
                  keepBrowserOpen={true}
                  useCache={true}
                  dynamicTimeout={1000}
                  autoDetect={false}
                />
              </SubscriptionAccessGuard> */}
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer - hidden in compact mode */}
      {!compact && (
        <SubscriptionAccessGuard>
          <CardFooter className="m-0 p-1">
            <AdDetails ad={ad} />
          </CardFooter>
        </SubscriptionAccessGuard>
      )}
    </Card>
  );
});

// 🏷️ Display name for better debugging
AdCard.displayName = "AdCard";

export { AdCard };

// @/components/adLibrary/AdCard.tsx
import React from "react";
import Image from "next/image";
import {
  CircleCheck,
  CircleX,
  Facebook,
  Flame,
  Info,
  Instagram,
  MessageCircle,
  MoreVertical,
} from "lucide-react";

import { AdData } from "@/types/ad";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AdDetails } from "./AdDetails";
import { SaveAdButton } from "./collections/SaveAdButton";
import { AdOptions } from "./microComponents/AdOptions";
import DisplayPixelPlatformPayment from "./microComponents/DisplayPixelPlatformPayment";
import PageNameWithPopover from "./microComponents/PageNameWithPopover";
import RenderMedia from "./microComponents/renderMedia";

interface AdCardProps {
  ad: AdData;
  compact?: boolean;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, compact = false }) => {
  const {
    ad_archive_id,
    start_date,
    end_date,
    publisher_platform,
    is_active,
    snapshot,
    collation_count,
    is_aaa_eligible,
  } = ad;

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderPlatformIcons = () => {
    const icons: { [key: string]: React.ReactNode } = {
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
    };

    return publisher_platform?.map((platform) => (
      <span key={platform} className="mr-1 cursor-pointer" title={platform}>
        {icons[platform.toLowerCase()] || <></>}
      </span>
    ));
  };

  const renderDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDateObj = start_date ? new Date(start_date * 1000) : null;
    const endDateObj = end_date ? new Date(end_date * 1000) : null;

    if (!startDateObj || !endDateObj) {
      return "N/A";
    }

    if (endDateObj < startDateObj || endDateObj >= yesterday) {
      return `Started on ${formatDate(start_date)}`;
    }

    return `${formatDate(start_date)} - ${formatDate(end_date)}`;
  };

  return (
    <Card className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Collation count - No margin/padding, direct in corner */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="absolute left-0 top-0 flex items-center rounded-br-2xl bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-4 py-1.5 text-white transition-colors duration-300 hover:from-[#5455E0] hover:to-[#A866E7]">
            <span className="font-semibold">{collation_count || 0}</span>
            <span className="ml-1 text-sm">ADS</span>
            {collation_count && collation_count >= 5 && (
              <span className="ml-2 animate-pulse">🔥</span>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{collation_count} ads use this creative and text</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Options button in top right */}
      <AdOptions ad_archive_id={ad.ad_archive_id} snapshot={snapshot} />

      <CardContent className="mt-10 flex flex-grow flex-col justify-between px-0.5 py-0">
        <div className="flex flex-grow flex-col justify-between">
          <div className="space-y-2.5">
            {/* First row: EU transparency and Save button */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center">
                {is_aaa_eligible && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
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
              <SaveAdButton ad={ad} />
            </div>

            {/* Second row: Status and Platform */}
            <div className="flex items-center justify-between px-2">
              {/* Active/Inactive status with text */}
              <div className="flex items-center gap-1">
                <div
                  className={`flex h-7 items-center gap-1.5 rounded-full px-2 ${
                    is_active
                      ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300"
                  } transition-colors duration-300`}
                >
                  {is_active ? (
                    <CircleCheck className="h-4 w-4" />
                  ) : (
                    <CircleX className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Platform icons */}
              <div className="flex items-center">{renderPlatformIcons()}</div>
            </div>

            {/* Third row: Date */}
            <div className="flex items-center justify-end px-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{renderDate()}</span>
            </div>

            {/* Fourth row: Page name */}
            <div className="px-2">
              <PageNameWithPopover snapshot={snapshot} />
            </div>

            {/* Media carousel */}
            <RenderMedia snapshot={snapshot} />
          </div>

          <div>
            {/* Divider */}
            <hr className="m-0.5 border-t border-gray-200 dark:border-gray-700" />

            {/* Pixel, Platform, Payment info */}
            <DisplayPixelPlatformPayment
              url={snapshot?.link_url || undefined}
              usePuppeteer={true}
              keepBrowserOpen={true}
              useCache={true}
              dynamicTimeout={1000}
              autoDetect={false}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="m-0 p-1">
        <AdDetails ad={ad} />
      </CardFooter>
    </Card>
  );
};

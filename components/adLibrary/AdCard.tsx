// @/components/adLibrary/AdCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  CheckCircle,
  Circle,
  CircleCheck,
  CircleX,
  ExternalLink,
  Facebook,
  Flame,
  Globe,
  Heart,
  Info,
  Instagram,
  MessageCircle,
  MoreVertical,
  Play,
  Power,
  PowerOff,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { AdData } from "@/types/ad";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AdDetails } from "./AdDetails";
import { SaveAdButton } from "./collections/SaveAdButton";
import DisplayPixelPlatformPayment from "./microComponents/DisplayPixelPlatformPayment";
import ExpandableText from "./microComponents/expandableText";
import PageNameWithPopover from "./microComponents/PageNameWithPopover";

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
  const [showAdDetails, setShowAdDetails] = useState(false);

  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderMedia = () => {
    if (!snapshot) return null;

    const mediaItems = [
      ...(snapshot.cards || []),
      ...(snapshot.images || []),
      ...(snapshot.videos || []),
    ];

    if (mediaItems.length > 0) {
      return (
        <Carousel className="w-full rounded-lg bg-gray-50 dark:bg-gray-800">
          <CarouselContent>
            {mediaItems.map((item, index) => (
              <CarouselItem key={index}>
                {/* Media Image or Video */}
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  {item.resized_image_url && (
                    <Image
                      src={item.resized_image_url}
                      alt={item.title || `Ad image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  {item.video_preview_image_url && (
                    <>
                      {playingVideo === index ? (
                        <video
                          src={item.video_sd_url || undefined}
                          controls
                          autoPlay
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <Image
                            src={item.video_preview_image_url}
                            alt={`Video preview ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                          />
                          <Play
                            className="absolute inset-0 m-auto h-12 w-12 cursor-pointer text-white opacity-80 hover:opacity-100"
                            onClick={() => setPlayingVideo(index)}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Card Ad Title, Body and CTA */}
                <div className="flex flex-col items-center justify-center p-2">
                  <div>
                    {item.title && (
                      <>
                        <p className="text-sm font-bold">{item.title}</p>

                        {item.body && (
                          <ExpandableText text={item.body} maxLength={25} />
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    {item.link_url && (
                      <button className="group relative mt-1 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400">
                        <span className="relative rounded-md bg-white px-5 py-1 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                          <a
                            href={item.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.cta_text}
                          </a>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {mediaItems.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      );
    }
    return null;
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
    <Card className="relative flex h-full w-full max-w-sm flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Top section */}
      <div className="absolute left-0 right-0 top-0 flex h-12 w-full items-center justify-between">
        {/* Left: Collation count */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex h-full items-center rounded-br-2xl bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-5 py-2 text-white transition-colors duration-300 hover:from-[#5455E0] hover:to-[#A866E7]">
              <span className="font-semibold">{collation_count || 0}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collation_count} ads use this creative and text</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Center: Active status and EU transparency badge */}
        <div className="flex items-center justify-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    is_active
                      ? "bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300"
                  } transition-colors duration-300`}
                >
                  {is_active ? (
                    <CircleCheck className="h-5 w-5" />
                  ) : (
                    <CircleX className="h-5 w-5" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{is_active ? "Active" : "Inactive"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* EU transparency badge */}
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

        {/* Right: Save and More options */}
        <div className="flex items-center bg-transparent pr-2">
          <SaveAdButton ad={ad} />
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="flex flex-grow flex-col justify-between p-4">
        <div>
          {/* Page name */}
          <div className="mb-4 mt-12">
            <PageNameWithPopover snapshot={snapshot} />
          </div>

          {/* Media carousel */}
          {renderMedia()}

          {/* Divider */}
          <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />

          {/* Date and Platform information */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <span>{renderDate()}</span>
            </div>
            <div className="flex items-center">{renderPlatformIcons()}</div>
          </div>

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

        {/* Ad details button */}
        <div className="mt-4">
          <Button
            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#6566F1] to-[#B977F8] p-[2px] transition-all duration-300 hover:from-[#5455E0] hover:to-[#A866E7]"
            onClick={() => setShowAdDetails(true)}
          >
            <span className="relative flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-300 group-hover:bg-opacity-0 group-hover:text-white dark:bg-gray-900 dark:text-white">
              See ad details
              <Info className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </div>
      </CardContent>

      {/* Ad details modal */}
      {showAdDetails && (
        <AdDetails ad={ad} onClose={() => setShowAdDetails(false)} />
      )}
    </Card>
  );
};

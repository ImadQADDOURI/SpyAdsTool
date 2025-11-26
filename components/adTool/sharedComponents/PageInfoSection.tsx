import React from "react";
import Image from "next/image";
import {
  Calendar,
  DollarSign,
  GlobeIcon,
  Info,
  Instagram,
  MapPin,
  Target,
  ThumbsUp,
  Users,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FirefliesWrapper from "@/components/adTool/sharedComponents/FirefliesWrapper";

import { countryCodesAlpha2Flag } from "../search/filter-config";

export const PageInfoSection: React.FC<any> = ({
  about_text,
  admin_country_counts,
  history_items,
  total_spend,
  page_info,
  count,
}) => {
  // Normalize history_items to always be an array
  const historyItemsArray: (typeof history_items)[] = history_items
    ? Array.isArray(history_items)
      ? history_items
      : [history_items]
    : [];
  // extract the Creation date
  const creationDate = historyItemsArray.find(
    (item) => item?.item_type === "CREATION",
  )?.event_time;

  const adminLocations = admin_country_counts ?? [];

  const MetricItem = ({
    icon: Icon,
    value,
    tooltip,
    badge,
  }: {
    icon: any;
    value: string;
    tooltip: string;
    badge?: string;
  }) => (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger className="group relative flex items-center space-x-2.5 rounded-full bg-white/80 px-3.5 py-1.5 shadow-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md dark:bg-gray-800/80 dark:hover:bg-gray-800/90">
          <div className="absolute inset-px rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Icon className="h-4 w-4 text-[#6566F1] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#B977F8]" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {value}
          </span>
          {badge && (
            <Image
              src={badge}
              alt="Verified"
              width={16}
              height={16}
              className="transition-transform group-hover:scale-110"
              unoptimized
            />
          )}
        </TooltipTrigger>
        <TooltipContent side="top" className="z-50">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const AdminLocations = () => (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger className="group relative flex items-center space-x-2.5 rounded-full bg-white/80 px-3.5 py-1.5 shadow-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md dark:bg-gray-800/80 dark:hover:bg-gray-800/90">
          <div className="absolute inset-px rounded-full bg-gradient-to-r from-[#6566F1]/10 to-[#B977F8]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <MapPin className="h-4 w-4 text-[#6566F1] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#B977F8]" />
          <div className="flex items-center space-x-1">
            {adminLocations.slice(0, 3).map((location, index) => {
              const countryInfo = countryCodesAlpha2Flag.find(
                (c) => c.label === location.country.iso_name,
              );
              return countryInfo ? (
                <Image
                  key={index}
                  src={
                    typeof countryInfo.icon === "string"
                      ? countryInfo.icon
                      : "/icons/unknown.png"
                  }
                  alt={countryInfo.label}
                  width={18}
                  height={18}
                  className="rounded-sm transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                />
              ) : null;
            })}
            {adminLocations.length > 3 && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                +{adminLocations.length - 3}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="z-50">
          <p className="mb-1 font-semibold">Admin Locations:</p>
          {adminLocations.map((location, index) => (
            <p key={index} className="text-sm">
              {location.country.iso_name}: {location.count}
            </p>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <FirefliesWrapper intensity="medium">
      <div className="relative overflow-hidden py-2">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/15 to-[#B977F8]/15" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-white/40 p-5 shadow-sm backdrop-blur-sm dark:bg-gray-900/40">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Profile Image */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-md" />
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/90 bg-gray-100 shadow-lg dark:bg-gray-800">
                  <Image
                    src={page_info?.[0]?.profile_photo || "/icons/user.png"}
                    alt={page_info?.[0]?.page_name || "Profile"}
                    fill
                    style={{ objectFit: "contain" }}
                    className="transition-transform duration-300 hover:scale-105"
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center space-x-2 sm:justify-start">
                  <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-2xl font-bold text-transparent">
                    {page_info?.[0]?.page_name || "Unnamed Page"}
                  </h1>
                  {page_info?.[1]?.page_verification !== "NOT_VERIFIED" && (
                    <Image
                      src="/icons/verified-badge.png"
                      alt="Facebook Verified"
                      width={24}
                      height={24}
                      className="transition-transform duration-300 hover:scale-110"
                      unoptimized
                    />
                  )}
                </div>
                <div className="mt-1 text-sm font-medium text-[#6566F1] dark:text-[#B977F8]">
                  {page_info?.[1]?.page_category || "Uncategorized"}
                </div>
                {about_text && (
                  <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {about_text}
                  </p>
                )}
              </div>
            </div>

            {/* Metrics Section */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 border-t border-gray-200/50 pt-4 dark:border-gray-700/50 sm:justify-between">
              <div className="flex flex-wrap justify-center gap-2">
                <MetricItem
                  icon={ThumbsUp}
                  value={page_info?.[1]?.likes?.toLocaleString() || "0"}
                  tooltip="Facebook Likes"
                />
                {page_info?.[1]?.ig_username && (
                  <MetricItem
                    icon={Instagram}
                    value={
                      page_info?.[1]?.ig_followers?.toLocaleString() || "0"
                    }
                    tooltip="Instagram Followers"
                    badge={
                      page_info?.[1]?.ig_verification
                        ? "/icons/verified-badge.png"
                        : undefined
                    }
                  />
                )}
                <MetricItem
                  icon={Target}
                  value={count?.toString()}
                  tooltip="Total Ads"
                />
                <MetricItem
                  icon={DollarSign}
                  value={total_spend || "Unknown"}
                  tooltip="Total Ad Spend"
                />
                {creationDate && (
                  <MetricItem
                    icon={Calendar}
                    value={new Date(creationDate * 1000).toLocaleDateString()}
                    tooltip="Page Creation Date"
                  />
                )}
                {adminLocations.length > 0 && <AdminLocations />}
              </div>

              {/* Visit Button */}
              <a
                href={page_info?.[1]?.page_profile_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] p-[1px] shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex items-center space-x-2 rounded-full bg-white/90 px-3.5 py-1.5 transition-all duration-300 group-hover:bg-opacity-90 dark:bg-gray-900/90">
                  <GlobeIcon className="h-4 w-4 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Visit Page
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Decorative bottom line */}
          <div className="absolute bottom-2 left-1/2 h-0.5 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6566F1]/25 to-[#B977F8]/25 transition-all duration-300 ease-in-out group-hover:w-40">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/25 to-[#B977F8]/25 blur-sm" />
          </div>
        </div>
      </div>
    </FirefliesWrapper>
  );
};

export default PageInfoSection;

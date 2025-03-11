"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { AdData } from "@/types/ad";

import { AdCard } from "../AdCard";

interface AdCardGridProps {
  ads: AdData | AdData[];
}

export const AdCardGrid: React.FC<AdCardGridProps> = ({ ads }) => {
  const adArray = Array.isArray(ads) ? ads : [ads]; // Normalize to array

  // 🔍 Get search params to read filters
  const searchParams = useSearchParams();

  // 🔢 Get the current collation count from URL params, default to 1
  // 🔑 Note: We parse as int but also check if the param exists to support 0
  const collationCountParam = searchParams.get("collationCount");
  const collationCountFilter =
    collationCountParam !== null ? parseInt(collationCountParam, 10) : 1;

  // 🧮 Filter ads based on collation_count threshold
  const filteredAds = adArray.filter((ad) => {
    // Handle cases where collation_count might be null/undefined
    const adCollationCount = ad.collation_count ?? 0;
    return adCollationCount >= collationCountFilter;
  });

  return (
    <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,350px),1fr))] gap-4">
      {filteredAds.map((ad) => (
        <AdCard key={ad.ad_archive_id} ad={ad} />
      ))}
    </div>
  );
};

export default AdCardGrid;

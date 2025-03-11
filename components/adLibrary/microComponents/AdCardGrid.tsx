"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { AdData } from "@/types/ad";

import { AdCard } from "../AdCard";

interface AdCardGridProps {
  ads: AdData[];
}

export const AdCardGrid: React.FC<AdCardGridProps> = ({ ads }) => {
  // 🔍 Get search params to read filters
  const searchParams = useSearchParams();

  // 🔢 Get the current collation count from URL params, default to 1
  // 🔑 Note: We parse as int but also check if the param exists to support 0
  const collationCountParam = searchParams.get("collationCount");
  const collationCountFilter =
    collationCountParam !== null ? parseInt(collationCountParam, 10) : 1;

  // 🧮 Filter ads based on collation_count threshold
  const filteredAds = ads.filter((ad) => {
    // Handle cases where collation_count might be null/undefined
    const adCollationCount = ad.collation_count ?? 0;
    return adCollationCount >= collationCountFilter;
  });

  return (
    <div className="xs:grid-cols-1 mb-4 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {filteredAds.map((ad) => (
        <AdCard key={ad.ad_archive_id} ad={ad} />
      ))}
    </div>
  );
};

export default AdCardGrid;

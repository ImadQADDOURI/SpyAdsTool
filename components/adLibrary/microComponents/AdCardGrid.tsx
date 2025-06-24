"use client";

import React from "react";

import { AdData } from "@/types/ad";

import { AdCard } from "../AdCard";

interface AdCardGridProps {
  ads: AdData[] | null;
}

export const AdCardGrid: React.FC<AdCardGridProps> = ({ ads }) => {
  return (
    <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4">
      {ads?.map((ad) => <AdCard key={ad.ad_archive_id} ad={ad} />)}
    </div>
  );
};

export default AdCardGrid;

"use client";

import React, { useEffect, useState } from "react";
import { getCollectionById } from "@/actions/collection";
import { formatDate } from "@/utils/dateFormatting";
import { Clock, Folder } from "lucide-react";
import { toast } from "sonner";

import { AdCardGrid } from "@/components/adLibrary/microComponents/AdCardGrid";

import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import { Loading } from "./microComponents/Loading";
import { ScrollButtons } from "./microComponents/ScrollButtons";

interface CollectionDetailsProps {
  collectionId: string;
}

export function CollectionDetails({ collectionId }: CollectionDetailsProps) {
  const [collection, setCollection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionData = async () => {
      setIsLoading(true);
      try {
        const collectionData = await getCollectionById(collectionId);
        setCollection(collectionData);
      } catch (error) {
        toast.error("Failed to fetch collection details");
        console.error("Error fetching collection details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId]);

  if (isLoading) {
    return <Loading message="Fetching data..." size="large" />;
  }

  if (!collection) {
    return <div className="text-center text-red-500">Collection not found</div>;
  }

  const lastUpdated = new Date(
    Math.max(
      new Date(collection.lastSavedAt).getTime(),
      new Date(collection.updatedAt).getTime(),
    ),
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <FirefliesWrapper intensity="medium">
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            {/* Title with decorative line */}
            <div className="flex flex-col items-center space-y-2">
              <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
                {collection.name}
              </h1>
              <div className="relative">
                <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex items-center gap-6">
              <div className="group flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Updated {formatDate(lastUpdated)}
                </span>
              </div>

              <div className="group flex items-center space-x-2">
                <Folder className="h-5 w-5 text-[#6566F1] transition-transform duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {collection.savedAdsCount.toLocaleString()} saved ads
                </span>
              </div>
            </div>
          </div>

          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

      <div className="container mx-auto px-4 py-8">
        <AdCardGrid
          ads={collection.savedAds.map((savedAd: any) => savedAd.adData)}
        />
      </div>

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

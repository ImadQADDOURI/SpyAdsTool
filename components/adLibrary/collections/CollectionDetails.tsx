"use client";

import React, { useEffect, useState } from "react";
import { getCollectionById } from "@/actions/collection";
import { formatDate } from "@/utils/dateFormatting";
import { Clock, Folder } from "lucide-react";
import { toast } from "sonner";

import { AdCardGrid } from "@/components/adLibrary/microComponents/AdCardGrid";

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
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    );
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
        {collection.name}
      </h1>
      <div className="mb-4 flex items-center text-gray-600 dark:text-gray-300">
        <Clock className="mr-2 h-5 w-5" />
        <span>Updated {formatDate(lastUpdated)}</span>
      </div>
      <div className="mb-6 flex items-center text-gray-600 dark:text-gray-300">
        <Folder className="mr-2 h-5 w-5" />
        <span>{collection.savedAdsCount} saved ads</span>
      </div>
      <AdCardGrid
        ads={collection.savedAds.map((savedAd: any) => savedAd.adData)}
      />
    </div>
  );
}

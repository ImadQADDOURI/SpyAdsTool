"use client";

import React, { useEffect, useState } from "react";
import { getUserCollections } from "@/actions/collection";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CollectionCard } from "./collections/CollectionCard";
import { CreateCollectionButton } from "./collections/CreateCollectionButton";
import FirefliesWrapper from "./microComponents/FirefliesWrapper";
import { Loading } from "./microComponents/Loading";
import { ScrollButtons } from "./microComponents/ScrollButtons";

export function UserCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const userCollections = await getUserCollections();
      setCollections(userCollections);
    } catch (error) {
      toast.error("Failed to fetch collections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCollectionCreated = (newCollection: {
    id: string;
    name: string;
  }) => {
    setCollections((prevCollections) => [newCollection, ...prevCollections]);
  };

  const handleCollectionUpdate = () => {
    fetchCollections();
  };

  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-800">
      <FirefliesWrapper intensity={"medium"}>
        {/* Title */}
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
              My Collections
            </h1>

            <div className="relative">
              <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

      <div className="flex items-center justify-end px-8 pt-4">
        <CreateCollectionButton onCollectionCreated={handleCollectionCreated} />
      </div>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <Loading message="Fetching data..." size="large" />
        ) : collections.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              You don&apos;t have any collections yet.
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Create a new collection to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                allCollections={collections}
                onUpdate={handleCollectionUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll buttons */}
      <ScrollButtons />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { getUserCollections } from "@/actions/collection";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Loading } from "../microComponents/Loading";
import { CollectionCard } from "./CollectionCard";
import { CreateCollectionButton } from "./CreateCollectionButton";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
            My Collections
          </h1>
          <CreateCollectionButton
            onCollectionCreated={handleCollectionCreated}
          />
        </div>

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
    </div>
  );
}

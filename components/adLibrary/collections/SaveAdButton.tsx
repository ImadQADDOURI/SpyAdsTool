import React, { useCallback, useEffect, useState } from "react";
import { checkAdSaveStatus, saveAd, unsaveAd } from "@/actions/ad";
import {
  getUserCollections,
  updateCollectionImageUrl,
} from "@/actions/collection";
import { ChevronDown, Heart, Plus, Search, X } from "lucide-react";

import { AdData } from "@/types/ad";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { CreateCollectionButton } from "./CreateCollectionButton";

interface SaveAdButtonProps {
  ad: AdData;
}

interface CollectionWithSaveStatus {
  id: string;
  name: string;
  isSaved: boolean;
  imageUrl: string | null;
}

const COLLECTIONS_PER_PAGE = 10;

export function SaveAdButton({ ad }: SaveAdButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionWithSaveStatus[]>(
    [],
  );
  const [filteredCollections, setFilteredCollections] = useState<
    CollectionWithSaveStatus[]
  >([]);
  const [displayedCollections, setDisplayedCollections] = useState<
    CollectionWithSaveStatus[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdSaved, setIsAdSaved] = useState(false);
  const [unsaveConfirmation, setUnsaveConfirmation] = useState<{
    isOpen: boolean;
    collectionId: string | null;
  }>({ isOpen: false, collectionId: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      await fetchCollectionsAndSaveStatus();
    } else {
      setSearchTerm("");
      setPage(1);
    }
    setIsOpen(open);
  };

  const fetchCollectionsAndSaveStatus = async () => {
    setIsLoading(true);
    try {
      const [collectionsResult, saveStatusResult] = await Promise.all([
        getUserCollections(),
        checkAdSaveStatus(ad.ad_archive_id),
      ]);

      if (collectionsResult) {
        const collectionsWithSaveStatus: CollectionWithSaveStatus[] =
          collectionsResult.map((collection) => ({
            ...collection,
            isSaved: saveStatusResult.savedCollectionIds.includes(
              collection.id,
            ),
          }));
        setCollections(collectionsWithSaveStatus);
        setFilteredCollections(collectionsWithSaveStatus);
        setDisplayedCollections(
          collectionsWithSaveStatus.slice(0, COLLECTIONS_PER_PAGE),
        );
      } else {
        throw new Error("Failed to fetch collections");
      }

      setIsAdSaved(saveStatusResult.isSaved);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAd = async (collectionId: string) => {
    setIsLoading(true);
    try {
      const result = await saveAd(ad, collectionId);
      if (result.success) {
        await updateCollectionImageUrl(collectionId);
        toast({
          title: "Ad saved successfully",
          description: `The ad has been saved to your collection.`,
        });
        updateCollectionSaveStatus(collectionId, true);
        setIsAdSaved(true);
      } else {
        throw new Error(result.message || "Failed to save ad");
      }
    } catch (error) {
      toast({
        title: "Error saving ad",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsaveAd = async (collectionId: string) => {
    setIsLoading(true);
    try {
      const result = await unsaveAd(ad.ad_archive_id, collectionId);
      if (result.success) {
        await updateCollectionImageUrl(collectionId);
        toast({
          title: "Ad unsaved successfully",
          description: `The ad has been removed from your collection.`,
        });
        updateCollectionSaveStatus(collectionId, false);
      } else {
        throw new Error(result.message || "Failed to unsave ad");
      }
    } catch (error) {
      toast({
        title: "Error unsaving ad",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUnsaveConfirmation({ isOpen: false, collectionId: null });
    }
  };

  const updateCollectionSaveStatus = (
    collectionId: string,
    isSaved: boolean,
  ) => {
    const updatedCollections = collections.map((c) =>
      c.id === collectionId ? { ...c, isSaved } : c,
    );
    setCollections(updatedCollections);
    setFilteredCollections(
      updatedCollections.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setIsAdSaved(updatedCollections.some((c) => c.isSaved));
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      const filtered = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCollections(filtered);
      setDisplayedCollections(filtered.slice(0, COLLECTIONS_PER_PAGE));
      setPage(1);
    },
    [collections],
  );

  const loadMoreCollections = () => {
    const nextPage = page + 1;
    const nextCollections = filteredCollections.slice(
      0,
      nextPage * COLLECTIONS_PER_PAGE,
    );
    setDisplayedCollections(nextCollections);
    setPage(nextPage);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleNewCollectionCreated = (newCollection: {
    id: string;
    name: string;
    imageUrl: string | null;
  }) => {
    const updatedCollections = [
      { ...newCollection, isSaved: true },
      ...collections,
    ];
    setCollections(updatedCollections);
    setFilteredCollections(updatedCollections);
    setDisplayedCollections(updatedCollections.slice(0, COLLECTIONS_PER_PAGE));
    setIsAdSaved(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full transition-all duration-200 hover:scale-110 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:hover:bg-purple-900"
            aria-label={isAdSaved ? "Unsave ad" : "Save ad"}
          >
            <Heart
              className={`h-5 w-5 ${
                isAdSaved
                  ? "fill-current text-pink-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl bg-white shadow-lg transition-all duration-200 dark:bg-gray-800 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Manage Ad in Collections
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-full border-2 border-gray-300 bg-transparent py-2 pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:border-gray-700"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CreateCollectionButton
                ad={ad}
                onCollectionCreated={handleNewCollectionCreated}
              />
            </div>
            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
              {displayedCollections.map((collection) => (
                <Button
                  key={collection.id}
                  onClick={() =>
                    collection.isSaved
                      ? setUnsaveConfirmation({
                          isOpen: true,
                          collectionId: collection.id,
                        })
                      : handleSaveAd(collection.id)
                  }
                  className="w-full justify-between rounded-full transition-all duration-200 hover:shadow-md"
                  disabled={isLoading}
                  variant={collection.isSaved ? "destructive" : "default"}
                >
                  <span className="flex items-center">
                    {collection.imageUrl && (
                      <img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className="mr-2 h-6 w-6 rounded-full object-cover"
                      />
                    )}
                    {collection.name}
                  </span>
                  {collection.isSaved ? (
                    <X className="ml-2 h-4 w-4" />
                  ) : (
                    <Plus className="ml-2 h-4 w-4" />
                  )}
                </Button>
              ))}
              {filteredCollections.length > displayedCollections.length && (
                <Button
                  onClick={loadMoreCollections}
                  variant="outline"
                  className="w-full rounded-full transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900"
                >
                  Load More <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={unsaveConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setUnsaveConfirmation({ ...unsaveConfirmation, isOpen })
        }
      >
        <AlertDialogContent className="rounded-xl bg-white shadow-lg transition-all duration-200 dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Confirm Unsave
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to unsave this ad from the collection?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
              onClick={() =>
                unsaveConfirmation.collectionId &&
                handleUnsaveAd(unsaveConfirmation.collectionId)
              }
            >
              Confirm Unsave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

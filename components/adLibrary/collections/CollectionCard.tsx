import React, { useState } from "react";
import Link from "next/link";
import {
  deleteCollection,
  moveAllAds,
  renameCollection,
} from "@/actions/collection";
import { formatDate } from "@/utils/dateFormatting";
import {
  Check,
  Clock,
  Folder,
  MoreVertical,
  Move,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

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
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    savedAdsCount: number;
    lastSavedAt: Date;
    updatedAt: Date;
    imageUrl: string | null;
  };
  allCollections: { id: string; name: string }[];
  onUpdate: () => void;
}

export function CollectionCard({
  collection,
  allCollections,
  onUpdate,
}: CollectionCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(collection.name);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null,
  );
  const [isMoveLoading, setIsMoveLoading] = useState(false);

  const lastUpdated = new Date(
    Math.max(
      new Date(collection.lastSavedAt).getTime(),
      new Date(collection.updatedAt).getTime(),
    ),
  );

  const handleRename = async () => {
    try {
      await renameCollection(collection.id, newName);
      toast.success("Collection renamed successfully");
      setIsRenaming(false);
      onUpdate();
    } catch (error) {
      toast.error("Failed to rename collection");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCollection(collection.id);
      toast.success("Collection deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete collection");
    }
  };

  const handleMoveAllAds = async () => {
    if (!selectedDestination) {
      toast.error("Please select a destination collection");
      return;
    }

    setIsMoveLoading(true);
    try {
      const result = await moveAllAds(collection.id, selectedDestination);
      if (result.success) {
        toast.success("Ads moved successfully");
        setIsMoving(false);
        setSelectedDestination(null);
        onUpdate();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error("Failed to move ads");
    } finally {
      setIsMoveLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800">
      <Link href={`/collections/${collection.id}`} passHref>
        <div className="cursor-pointer">
          <div className="relative h-48">
            {collection.imageUrl ? (
              <img
                src={collection.imageUrl}
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                <Folder className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
              {collection.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-2 h-4 w-4" />
              <span>{formatDate(lastUpdated)} </span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Folder className="mr-2 h-4 w-4" />
              <span>{collection.savedAdsCount} saved ads</span>
            </div>
          </CardContent>
        </div>
      </Link>

      <div
        className="absolute right-2 top-2"
        onClick={(e) => e.preventDefault()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 transition-all duration-200 hover:bg-white hover:shadow-md dark:bg-gray-800/80 dark:hover:bg-gray-800"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => setIsRenaming(true)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleting(true)}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsMoving(true)}
              className="cursor-pointer"
            >
              <Move className="mr-2 h-4 w-4" /> Move All Ads
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={isRenaming} onOpenChange={setIsRenaming}>
        <AlertDialogContent className="rounded-xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Rename Collection
            </AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for the collection
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New collection name"
            className="rounded-full border-2 border-gray-300 bg-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700"
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRename}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent className="rounded-xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Delete Collection
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isMoving} onOpenChange={setIsMoving}>
        <AlertDialogContent className="rounded-xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Move All Ads
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a destination collection to move all ads
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto">
            {allCollections
              .filter((c) => c.id !== collection.id)
              .map((c) => (
                <Button
                  key={c.id}
                  onClick={() => setSelectedDestination(c.id)}
                  className={`mb-2 w-full justify-between rounded-full ${
                    selectedDestination === c.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {c.name}
                  {selectedDestination === c.id && (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-full"
              onClick={() => setSelectedDestination(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMoveAllAds}
              disabled={!selectedDestination || isMoveLoading}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              {isMoveLoading ? "Moving..." : "Move Ads"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

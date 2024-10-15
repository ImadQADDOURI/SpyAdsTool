import React, { useState } from "react";
import {
  deleteCollection,
  moveAllAds,
  renameCollection,
} from "@/actions/collection";
import { formatDate } from "@/utils/dateFormatting";
import {
  Clock,
  Folder,
  MoreVertical,
  Move,
  Pencil,
  Trash2,
} from "lucide-react";

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
import { useToast } from "@/components/ui/use-toast";

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    savedAdsCount: number;
    lastSavedAt: string | Date;
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
  const { toast } = useToast();

  const handleRename = async () => {
    try {
      await renameCollection(collection.id, newName);
      toast({ title: "Collection renamed successfully" });
      setIsRenaming(false);
      onUpdate();
    } catch (error) {
      toast({ title: "Failed to rename collection", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCollection(collection.id);
      toast({ title: "Collection deleted successfully" });
      onUpdate();
    } catch (error) {
      toast({ title: "Failed to delete collection", variant: "destructive" });
    }
  };

  const handleMoveAllAds = async (destinationId: string) => {
    try {
      await moveAllAds(collection.id, destinationId);
      toast({ title: "Ads moved successfully" });
      onUpdate();
    } catch (error) {
      toast({ title: "Failed to move ads", variant: "destructive" });
    }
  };

  return (
    <Card className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800">
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
        <div className="absolute right-2 top-2">
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
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
          {collection.name}
        </h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="mr-2 h-4 w-4" />
          <span>Updated {formatDate(collection.lastSavedAt)}</span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Folder className="mr-2 h-4 w-4" />
          <span>{collection.savedAdsCount} saved ads</span>
        </div>
      </CardContent>

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full rounded-full">
                Select Destination
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {allCollections
                .filter((c) => c.id !== collection.id)
                .map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onSelect={() => handleMoveAllAds(c.id)}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

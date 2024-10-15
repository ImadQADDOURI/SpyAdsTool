import React, { useState } from "react";
import { saveAd } from "@/actions/ad";
import { createCollection } from "@/actions/collection";
import { Loader2, Plus } from "lucide-react";

import { AdData } from "@/types/ad";
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

interface CreateCollectionButtonProps {
  ad?: AdData;
  onCollectionCreated?: (newCollection: { id: string; name: string }) => void;
}

export function CreateCollectionButton({
  ad,
  onCollectionCreated,
}: CreateCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a collection name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCollection(newCollectionName);
      if (result) {
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Collection created successfully",
        });

        if (onCollectionCreated) {
          onCollectionCreated({
            id: result.id,
            name: result.name,
          });
        }

        if (ad) {
          // If an ad is provided, save it to the new collection
          await saveAd(ad, result.id);
          // No need to Update the collection's image URL it's handled in the save ad server action
          toast({
            title: "Success",
            description: "Ad saved to the new collection",
          });
        }

        setNewCollectionName("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full transition-all duration-200 hover:bg-purple-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:hover:bg-purple-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl bg-white shadow-lg transition-all duration-200 dark:bg-gray-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
            Create New Collection
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateCollection} className="space-y-4">
          <Input
            placeholder="Enter collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="rounded-full border-2 border-gray-300 bg-transparent transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:border-gray-700"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-200 hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Collection"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

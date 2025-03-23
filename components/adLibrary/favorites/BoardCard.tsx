"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Clock,
  Heart,
  MoreHorizontal,
  MoveRight,
  Pencil,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Board } from "./SavedAdsContext";
import { useSavedAdsActions } from "./useSavedAdsActions";

type BoardCardProps = {
  board: Board;
  onUpdate?: () => void;
};

export default function BoardCard({ board, onUpdate }: BoardCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [newName, setNewName] = useState(board.name);
  const [targetBoard, setTargetBoard] = useState("");

  const { rename, deleteBoard, moveAds, boards } = useSavedAdsActions();

  // Available boards (excluding current)
  const otherBoards = boards.filter((b) => b.name !== board.name);

  // Format last updated time - handle both string and Date objects
  const lastUpdatedText = board.lastUpdated
    ? formatDistanceToNow(
        typeof board.lastUpdated === "string"
          ? new Date(board.lastUpdated)
          : board.lastUpdated,
        { addSuffix: true },
      )
    : "No ads yet";

  // Handle rename board
  const handleRename = async () => {
    if (!newName.trim() || newName.trim() === board.name) {
      setRenameOpen(false);
      return;
    }

    const success = await rename(board.name, newName.trim());
    if (success) {
      if (onUpdate) onUpdate();
    }
    setRenameOpen(false);
  };

  // Handle delete board
  const handleDelete = async () => {
    const success = await deleteBoard(board.name);
    if (success) {
      if (onUpdate) onUpdate();
    }
    setDeleteOpen(false);
  };

  // Handle merge boards
  const handleMerge = async () => {
    if (!targetBoard) {
      toast.error("Please select a target board");
      return;
    }

    const success = await moveAds(board.name, targetBoard);
    if (success) {
      if (onUpdate) onUpdate();
    }
    setMergeOpen(false);
  };

  // Safely get cover image URL
  const coverImageUrl = board.coverImage || null;

  return (
    <>
      <Card className="group relative aspect-square overflow-hidden transition-all duration-300 hover:shadow-lg">
        <Link href={`/favorites/${encodeURIComponent(board.name)}`}>
          <div className="relative h-full w-full">
            {/* Background Image/Gradient */}
            <div className="absolute inset-0">
              {coverImageUrl ? (
                <>
                  <img
                    src={coverImageUrl}
                    alt={board.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#6566F1] to-[#B977F8] opacity-90" />
              )}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              {/* Top Section - Ad Count Badge */}
              <div className="flex justify-end">
                <div className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  {board.count} {board.count === 1 ? "ad" : "ads"}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="space-y-2">
                <h3 className="line-clamp-2 text-xl font-bold text-white drop-shadow-sm">
                  {board.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-200">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{lastUpdatedText}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-8 w-8 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white active:scale-95"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white/95 backdrop-blur-md dark:bg-gray-900/95"
                    >
                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 focus:bg-gray-100/80 dark:focus:bg-gray-800/80"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setRenameOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">Rename</span>
                          <span className="text-xs text-gray-500">
                            Change board name
                          </span>
                        </div>
                      </DropdownMenuItem>

                      {otherBoards.length > 0 && (
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 focus:bg-gray-100/80 dark:focus:bg-gray-800/80"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMergeOpen(true);
                          }}
                        >
                          <MoveRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium">
                              Merge Board
                            </span>
                            <span className="text-xs text-gray-500">
                              Combine with another board
                            </span>
                          </div>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />

                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">Delete</span>
                          <span className="text-xs text-red-500/80">
                            Remove this board
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename board</DialogTitle>
            <DialogDescription>
              Enter a new name for "{board.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Board name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleRename}
              className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] hover:opacity-90"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{board.name}"? This will remove
              all {board.count} saved ads from this board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Merge board</DialogTitle>
            <DialogDescription>
              Choose a board to merge "{board.name}" into. Duplicate ads will be
              skipped.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {otherBoards.map((b) => (
                <div
                  key={b.name}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50",
                    targetBoard === b.name && "bg-gray-50 dark:bg-gray-800/50",
                  )}
                  onClick={() => setTargetBoard(b.name)}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center overflow-hidden rounded-md",
                      !b.coverImage &&
                        "bg-gradient-to-br from-[#6566F1] to-[#B977F8] opacity-90",
                    )}
                  >
                    {b.coverImage ? (
                      <img
                        src={b.coverImage}
                        alt={b.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Heart className="h-4 w-4 text-white" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{b.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {b.count} {b.count === 1 ? "ad" : "ads"}
                    </span>
                  </div>

                  {targetBoard === b.name && (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleMerge}
              disabled={!targetBoard}
              className={cn(
                "bg-gradient-to-r from-[#6566F1] to-[#B977F8]",
                "hover:opacity-90 disabled:opacity-50",
              )}
            >
              Merge boards
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

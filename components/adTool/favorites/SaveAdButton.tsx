// src/components/SaveAdButton.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Heart, Loader2, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useSavedAds } from "./SavedAdsContext";
import { useSavedAdsActions } from "./useSavedAdsActions";

type SaveAdButtonProps = {
  ad: AdData;
  variant?: "icon" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function SaveAdButton({
  ad,
  variant = "icon",
  size = "md",
  className,
}: SaveAdButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 🚀 Optimized: Use direct data from context (no redundant calls)
  const { boards, isLoading: contextLoading } = useSavedAds();
  const { saveAd, removeAd, isAdSaved, getAdBoards } = useSavedAdsActions();

  const ad_archive_id = ad.ad_archive_id || "";

  // 🎯 Optimized: Use memoized calculations to prevent re-renders
  const savedBoards = useMemo(
    () => getAdBoards(ad_archive_id),
    [getAdBoards, ad_archive_id],
  );
  const isSaved = useMemo(
    () => isAdSaved(ad_archive_id),
    [isAdSaved, ad_archive_id],
  );
  const savedBoardsSet = useMemo(() => new Set(savedBoards), [savedBoards]);

  // 🔍 Optimized: Memoized filtered boards to prevent recalculation
  const filteredBoards = useMemo(
    () =>
      boards.filter((board) =>
        board.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [boards, searchTerm],
  );

  // 🎯 Optimized: Use useCallback to prevent function recreation
  const handleCreateBoard = useCallback(async () => {
    const name = newBoardName.trim();
    if (!name) {
      toast.error("Please enter a board name");
      return;
    }

    setIsLoading(true);
    setLoadingAction("create");

    const success = await saveAd(ad_archive_id, name, ad);
    if (success) {
      setDialogOpen(false);
      setNewBoardName("");
    }

    setIsLoading(false);
    setLoadingAction(null);
  }, [newBoardName, saveAd, ad_archive_id, ad]);

  // 🎯 Optimized: Use useCallback for board actions
  const handleSaveToBoard = useCallback(
    async (boardName: string) => {
      setIsLoading(true);
      setLoadingAction(boardName);

      const success = savedBoardsSet.has(boardName)
        ? await removeAd(ad_archive_id, boardName)
        : await saveAd(ad_archive_id, boardName, ad);

      setIsLoading(false);
      setLoadingAction(null);
      if (success) setIsOpen(false);
    },
    [savedBoardsSet, removeAd, saveAd, ad_archive_id, ad],
  );

  // 🎮 Focus management (unchanged but optimized)
  useEffect(() => {
    if (dialogOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (isOpen && boards.length > 10 && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, boards.length]);

  // 🎨 Size classes (memoized)
  const sizeClasses = useMemo(
    () => ({
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }),
    [],
  );

  const isMainLoading = contextLoading || isLoading;

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isMainLoading}
            className={cn(
              "rounded-full transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30",
              sizeClasses[size],
              isSaved && "text-purple-700 dark:text-purple-400",
              isMainLoading && "cursor-not-allowed opacity-70",
            )}
            aria-label={isSaved ? "Saved" : "Save ad"}
          >
            {isMainLoading && !loadingAction ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "h-5 w-5 transition-all",
                  isSaved
                    ? "fill-pink-600 stroke-none dark:fill-pink-400"
                    : "stroke-current",
                )}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2 text-sm font-medium">
            Save to board {savedBoards.length > 0 && `(${savedBoards.length})`}
          </div>

          {/* 🔍 Search optimization: Only show for large lists */}
          {boards.length > 8 && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search boards..."
                  className="h-8 pl-8 text-sm"
                />
              </div>
            </div>
          )}

          {/* 📋 Optimized board list */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredBoards.length === 0 && searchTerm ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No boards found matching &quot;{searchTerm}&quot;
              </div>
            ) : (
              filteredBoards.map((board) => {
                const isBoardSaved = savedBoardsSet.has(board.name);
                const isBoardLoading = loadingAction === board.name;

                return (
                  <DropdownMenuItem
                    key={board.name}
                    className={cn(
                      "group relative flex cursor-pointer items-center gap-2 py-3 transition-colors",
                      isBoardSaved && "bg-purple-200/70 dark:bg-purple-800/40",
                      isBoardSaved
                        ? "hover:bg-red-300/80 hover:text-red-800 dark:hover:bg-red-800/50 dark:hover:text-red-200"
                        : "hover:bg-green-300/80 hover:text-green-800 dark:hover:bg-green-800/50 dark:hover:text-green-200",
                      isBoardLoading && "opacity-70",
                    )}
                    disabled={isBoardLoading}
                    onClick={() =>
                      !isBoardLoading && handleSaveToBoard(board.name)
                    }
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center overflow-hidden rounded-md",
                        !board.coverImage &&
                          "bg-purple-300 dark:bg-purple-700/50",
                      )}
                    >
                      {board.coverImage ? (
                        <img
                          src={board.coverImage}
                          alt={board.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Heart className="h-4 w-4 text-purple-800 dark:text-purple-300" />
                      )}
                    </div>
                    <div className="flex-1 truncate">{board.name}</div>
                    <div className="text-xs text-gray-500">{board.count}</div>
                    {isBoardLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isBoardSaved ? (
                      <>
                        <Check className="h-4 w-4 text-purple-800 group-hover:hidden dark:text-purple-300" />
                        <X className="hidden h-4 w-4 text-red-800 group-hover:block dark:text-red-300" />
                      </>
                    ) : (
                      <Plus className="hidden h-4 w-4 text-green-800 group-hover:block dark:text-green-300" />
                    )}
                  </DropdownMenuItem>
                );
              })
            )}
          </div>

          <DropdownMenuSeparator />

          {/* Create new board */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2 py-3"
                onSelect={(e) => {
                  e.preventDefault();
                  setDialogOpen(true);
                  setSearchTerm("");
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
                  <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">Create new board</div>
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create new board</DialogTitle>
                <DialogDescription>
                  Enter a name for your new collection
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-2 pt-4">
                <div className="grid flex-1 gap-2">
                  <Input
                    ref={inputRef}
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Board name"
                    className="h-10"
                    disabled={loadingAction === "create"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && loadingAction !== "create") {
                        handleCreateBoard();
                      }
                    }}
                  />
                </div>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={loadingAction === "create"}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleCreateBoard}
                  disabled={loadingAction === "create"}
                  className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] hover:opacity-90 disabled:opacity-50"
                >
                  {loadingAction === "create" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

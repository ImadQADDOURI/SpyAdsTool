// src/components/SaveAdButton.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Heart, Plus, X } from "lucide-react";
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
  const [checkingSaveStatus, setCheckingSaveStatus] = useState(false);
  const [savedBoards, setSavedBoards] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { boards } = useSavedAds();
  const { saveAd, removeAd, isAdSaved, getAdBoards } = useSavedAdsActions();

  const ad_archive_id = ad.ad_archive_id || "";

  // 💾 Check save status only when dropdown opens (optimization)
  const checkSaveStatus = () => {
    if (!checkingSaveStatus && ad_archive_id) {
      setCheckingSaveStatus(true);
      setSavedBoards(getAdBoards(ad_archive_id));
    }
  };

  // 🎯 Handle dropdown open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      checkSaveStatus();
    }
  };

  // ➕ Handle new board creation
  const handleCreateBoard = async () => {
    const name = newBoardName.trim();
    if (!name) {
      toast.error("Please enter a board name");
      return;
    }

    const success = await saveAd(ad_archive_id, name, ad);
    if (success) {
      setSavedBoards([...savedBoards, name]);
      setDialogOpen(false);
      setNewBoardName("");
    }
  };

  // 💾 Save to existing board
  const handleSaveToBoard = async (board: string) => {
    if (savedBoards.includes(board)) {
      // Remove from board if already saved
      const success = await removeAd(ad_archive_id, board);
      if (success) {
        setSavedBoards(savedBoards.filter((b) => b !== board));
      }
    } else {
      // Save to board
      const success = await saveAd(ad_archive_id, board, ad);
      if (success) {
        setSavedBoards([...savedBoards, board]);
      }
    }
    setIsOpen(false);
  };

  // 🎮 Focus input when dialog opens
  useEffect(() => {
    if (dialogOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [dialogOpen]);

  // 🎨 Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  // 🎯 Check if ad is saved to any board
  const isSaved = savedBoards.length > 0;

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30",
              sizeClasses[size],
              isSaved && "text-purple-700 dark:text-purple-400",
            )}
            aria-label={isSaved ? "Saved" : "Save ad"}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all",
                isSaved && "fill-purple-600 dark:fill-purple-400",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2 text-sm font-medium">Save to board</div>

          {/* Existing boards */}
          <div className="max-h-[300px] overflow-y-auto">
            {boards.map((board) => {
              const isBoardSaved = savedBoards.includes(board.name);
              return (
                <DropdownMenuItem
                  key={board.name}
                  className={cn(
                    "group relative flex cursor-pointer items-center gap-2 py-3 transition-colors",
                    // Stronger background for saved items
                    isBoardSaved && "bg-purple-200/70 dark:bg-purple-800/40",
                    // More vibrant hover states with increased opacity
                    isBoardSaved
                      ? "hover:bg-red-300/80 hover:text-red-800 dark:hover:bg-red-800/50 dark:hover:text-red-200"
                      : "hover:bg-green-300/80 hover:text-green-800 dark:hover:bg-green-800/50 dark:hover:text-green-200",
                  )}
                  onClick={() => handleSaveToBoard(board.name)}
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
                  <div className="flex-1">{board.name}</div>
                  {isBoardSaved ? (
                    <>
                      <Check className="h-4 w-4 text-purple-800 group-hover:hidden dark:text-purple-300" />
                      <X className="hidden h-4 w-4 text-red-800 group-hover:block dark:text-red-300" />
                    </>
                  ) : (
                    <Plus className="hidden h-4 w-4 text-green-800 group-hover:block dark:text-green-300" />
                  )}
                </DropdownMenuItem>
              );
            })}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateBoard();
                      }
                    }}
                  />
                </div>
                <DialogClose asChild>
                  <Button type="button" variant="outline" size="icon">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleCreateBoard}
                  className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] hover:opacity-90"
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

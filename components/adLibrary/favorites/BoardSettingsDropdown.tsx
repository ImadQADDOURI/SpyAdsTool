// src/components/board/BoardSettingsDropdown.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Edit, Settings, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import { useSavedAdsActions } from "./useSavedAdsActions";

type BoardSettingsDropdownProps = {
  boardName: string;
};

export default function BoardSettingsDropdown({
  boardName,
}: BoardSettingsDropdownProps) {
  const router = useRouter();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState(boardName);
  const inputRef = useRef<HTMLInputElement>(null);

  const { rename, deleteBoard } = useSavedAdsActions();

  // ✏️ Handle board rename
  const handleRename = async () => {
    if (newBoardName.trim() === "") return;

    const success = await rename(boardName, newBoardName);
    if (success) {
      setRenameDialogOpen(false);
      router.push(`/favorites/${encodeURIComponent(newBoardName)}`);
    }
  };

  // 🗑️ Handle board deletion
  const handleDelete = async () => {
    const success = await deleteBoard(boardName);
    if (success) {
      setDeleteDialogOpen(false);
      router.push("/favorites");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex cursor-pointer items-center space-x-2 rounded-full bg-gray-200/70 px-4 py-1.5 transition-all hover:bg-gray-300/50 dark:bg-gray-700/50 dark:hover:bg-gray-600/50">
            <Settings className="h-5 w-5 text-gray-600 transition-all duration-300 group-hover:scale-110 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Settings
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border border-gray-200 bg-white/90 p-1 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90 dark:backdrop-blur-sm"
        >
          <DropdownMenuItem
            className="flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setRenameDialogOpen(true)}
          >
            <Edit className="h-4 w-4 text-[#6566F1] dark:text-[#B977F8]" />
            <span>Rename board</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem
            className="flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span>Delete board</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Rename Board
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Enter a new name for your board
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              ref={inputRef}
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name"
              className="rounded-lg border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="rounded-lg border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleRename}
              className="rounded-lg bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-6 shadow-lg transition-all hover:shadow-[0_10px_25px_-5px_rgba(101,102,241,0.3)]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Board
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete &quot;{boardName}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="rounded-lg border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="rounded-lg bg-red-600 px-6 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Delete Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

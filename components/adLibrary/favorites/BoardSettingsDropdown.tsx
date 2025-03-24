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
          <div className="group flex cursor-pointer items-center space-x-2">
            <Settings className="h-5 w-5 text-[#6566F1] transition-all duration-300 group-hover:scale-110 dark:text-[#B977F8]" />
            <span className="text-sm font-medium text-gray-600 group-hover:text-[#6566F1] dark:text-gray-300 dark:group-hover:text-[#B977F8]">
              Settings
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <DropdownMenuItem
            className="flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setRenameDialogOpen(true)}
          >
            <Edit className="h-4 w-4 text-[#6566F1] dark:text-[#B977F8]" />
            <span>Rename board</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />
          <DropdownMenuItem
            className="flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span>Delete board</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
            <DialogDescription>
              Enter a new name for your board
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              ref={inputRef}
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Board
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete `&quot;`{boardName}`&quot;`? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDelete} variant="destructive">
              Delete Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

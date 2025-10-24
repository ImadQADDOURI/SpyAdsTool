"use client";

import { useEffect, useState } from "react";
import { fetchTrendBoards } from "@/actions/savedAds";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BoardSelectorProps {
  selectedBoard: string | null;
  onBoardSelect: (board: string | null) => void;
}

export default function BoardSelector({
  selectedBoard,
  onBoardSelect,
}: BoardSelectorProps) {
  const [boards, setBoards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // show only 4 boards, rest go into "More"
  const visibleCount = 10;

  useEffect(() => {
    fetchTrendBoards().then((response) => {
      if (!("error" in response)) setBoards(response.boards);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || boards.length === 0) return null;

  const visibleBoards = boards.slice(0, visibleCount);
  const hiddenBoards = boards.slice(visibleCount);

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* All Button */}
        <BoardButton
          label="All"
          selected={selectedBoard === null}
          onClick={() => onBoardSelect(null)}
        />

        {/* Visible Boards */}
        {visibleBoards.map((board) => (
          <BoardButton
            key={board}
            label={board}
            selected={selectedBoard === board}
            onClick={() => onBoardSelect(board)}
          />
        ))}

        {/* More Dropdown */}
        {hiddenBoards.length > 0 && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center rounded-2xl border-purple-500 bg-white px-4 text-gray-700 shadow-sm transition-all hover:bg-gray-100 dark:border-purple-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:px-4"
              >
                <span>More</span>

                {/* Vertical divider */}
                <span className="mx-2 h-5 border-l border-purple-500 dark:border-purple-700" />

                {/* Chevron with rotation animation */}
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              {hiddenBoards.map((board) => (
                <DropdownMenuItem
                  key={board}
                  onClick={() => onBoardSelect(board)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedBoard === board
                      ? "bg-purple-600 text-white hover:bg-purple-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {board}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

/* 🎨 Reusable Button Component */
function BoardButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 font-medium transition-all duration-200 sm:px-6 ${
        selected
          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md hover:from-purple-700 hover:to-purple-600"
          : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </Button>
  );
}

// @/components/adLibrary/favorites/BoardSelector.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchTrendBoards } from "@/actions/savedAds";

import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    fetchTrendBoards().then((response) => {
      if (!("error" in response)) {
        setBoards(response.boards);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading || boards.length === 0) return null;

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {/* "All" Button */}
        <Button
          size="sm"
          onClick={() => onBoardSelect(null)}
          className={`max-w-[8rem] truncate rounded-lg px-4 py-2 transition-all duration-200 ${
            selectedBoard === null
              ? "bg-purple-600 text-white shadow-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              : "border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          } `}
        >
          All
        </Button>

        {boards.map((board) => (
          <Button
            key={board}
            size="sm"
            onClick={() => onBoardSelect(board)}
            className={`max-w-[8rem] truncate rounded-lg px-4 py-2 transition-all duration-200 ${
              selectedBoard === board
                ? "bg-purple-600 text-white shadow-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                : "border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            } `}
          >
            {board}
          </Button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FirefliesWrapper from "../microComponents/FirefliesWrapper";
import SearchFilters from "./search-filters";

interface AdaptiveSearchFiltersProps {
  onSearch: () => void;
  isLoading: boolean;
  displayMode: "full" | "compact";
}

export default function AdaptiveSearchFilters({
  onSearch,
  isLoading,
  displayMode,
}: AdaptiveSearchFiltersProps) {
  // State for dialog open/close in compact mode
  const [dialogOpen, setDialogOpen] = useState(false);

  // Render based on display mode
  if (displayMode === "full") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=""
      >
        <div className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-r from-[#6566F1]/25 to-[#B977F8]/25 p-2 shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)] transition-all duration-300 ease-in-out hover:scale-[1.01] dark:bg-[#6566F1]/10 dark:shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)]">
          <SearchFilters onSearch={onSearch} isLoading={isLoading} />
        </div>
      </motion.div>
    );
  }

  // Compact mode with dialog
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="relative h-9 rounded-full bg-white/70 px-2.5 text-gray-700 transition-all duration-300 hover:bg-white/90 hover:shadow-sm dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800/90"
      >
        <SlidersHorizontal className="h-5 w-5 text-purple-500" />
        <span className="sr-only">Open filters</span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-r from-[#6566F1]/25 to-[#B977F8]/25 p-2 shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)] transition-all duration-300 ease-in-out hover:scale-[1.01] dark:bg-[#6566F1]/10 dark:shadow-[0_4px_20px_-4px_rgba(101,102,241,0.25)]">
          <SearchFilters
            onSearch={() => {
              onSearch();
              setDialogOpen(false);
            }}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

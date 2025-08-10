"use client";

import { useTransition } from "react";
import { refreshActiveConfigsCache } from "@/actions/Meta-GraphQL-config-rotation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

// ✨ Simplified Refresh Button Component
export default function RefreshConfigsButton() {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        await refreshActiveConfigsCache();
        toast.success("✅ Active config cache refreshed!");
      } catch (error) {
        console.error("💥 Failed to refresh cache:", error);
        toast.error("❌ Failed to refresh cache");
      }
    });
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Refreshing..." : "Refresh Cache"}
    </Button>
  );
}

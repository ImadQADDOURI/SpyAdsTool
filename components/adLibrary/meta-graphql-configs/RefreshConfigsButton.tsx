// @/components/admin/RefreshConfigsButton.tsx
"use client";

import { useState, useTransition } from "react";
import { refreshActiveConfigsCache } from "@/actions/Meta-GraphQL-config-rotation"; // Import server action

import { RefreshCw } from "lucide-react"; // Icon

import { Button } from "@/components/ui/button"; // Assuming Shadcn/UI Button

// ✨ REFRESH ACTIVE CONFIGS CACHE BUTTON =======================================
export default function RefreshConfigsButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  // 🚀 ACTION HANDLER =========================================================
  const handleRefresh = () => {
    setStatus({ type: "idle" }); // Reset status
    startTransition(async () => {
      try {
        await refreshActiveConfigsCache();
        setStatus({
          type: "success",
          message: "✅ Active config cache refreshed!",
        });
      } catch (error) {
        console.error("💥 Failed to refresh cache:", error);
        setStatus({
          type: "error",
          message: "❌ Failed to refresh cache. Check server logs.",
        });
      }
      // Clear status message after a delay
      setTimeout(() => setStatus({ type: "idle" }), 3000);
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        onClick={handleRefresh}
        disabled={isPending}
        variant="outline" // Example styling
        size="sm" // Example sizing
      >
        <RefreshCw
          className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
        />
        {isPending ? "Refreshing..." : "Refresh Active Config Cache"}
      </Button>
      {status.message && (
        <p
          className={`text-sm ${
            status.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}

// @/components/adLibrary/subscription/SubscriptionPageGuard
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react"; // 🔒 Lock icon from Lucide React

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { useSubscription } from "@/components/adLibrary/subscription/SubscriptionProvider";

type SubscriptionPageGuardProps = {
  children: React.ReactNode;
  requireSubscription?: boolean; // 🔒 Whether to protect the page
  loadingMessage?: string; // 💬 Custom loading message
  loadingSize?: "small" | "medium" | "large"; // 📏 Size of the loading spinner
};

// 🛑 UpgradeDialog Component: displays an upgrade prompt instead of redirecting
const UpgradeDialog: React.FC = () => {
  const router = useRouter();

  // Handles navigation to the pricing page
  const handleUpgradeClick = () => {
    router.push("/pricing");
  };

  // Handles "back" action (Maybe Later)
  const handleMaybeLater = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <div>
          <h2 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-center text-xl font-bold text-transparent">
            Premium Feature
          </h2>
          <p className="pt-2 text-center text-gray-700 dark:text-gray-300">
            Upgrade to our Pro plan to unlock this and many more premium
            features.
          </p>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-gradient-to-br from-[#6566F1]/10 to-[#B977F8]/10 p-4">
            <Lock className="h-10 w-10 text-[#6566F1]" />
          </div>
          <div className="mt-2 w-full space-y-4">
            <button
              onClick={handleUpgradeClick}
              className="w-full rounded bg-gradient-to-r from-[#6566F1] to-[#B977F8] px-4 py-2 font-bold text-white shadow transition-all hover:opacity-90"
            >
              Upgrade Now
            </button>
            <button
              onClick={handleMaybeLater}
              className="w-full rounded border border-gray-300 px-4 py-2 font-bold text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 🛡️ Guards page access based on subscription status.
 *
 * - Refreshes subscription data on mount.
 * - Displays a loading spinner while checking.
 * - If the user lacks access, shows an upgrade dialog blocking the guarded content.
 */
export function SubscriptionPageGuard({
  children,
  requireSubscription = true,
  loadingMessage = "Verifying subscription...",
  loadingSize = "medium",
}: SubscriptionPageGuardProps) {
  const { hasAccess, isLoading, refresh } = useSubscription();
  const router = useRouter();
  const hasRefreshed = React.useRef(false);
  const DEBUG = process.env.NEXT_PUBLIC_DEBUG_SUBSCRIPTION === "true";

  // Refresh subscription on mount (only once)
  useEffect(() => {
    if (!hasRefreshed.current) {
      if (DEBUG)
        console.log(
          "🚀 [SubscriptionPageGuard] Mounted. Triggering refresh...",
        );
      refresh()
        .then(() => {
          if (DEBUG)
            console.log("✅ [SubscriptionPageGuard] Refresh completed.");
        })
        .catch((err) =>
          console.error("❌ [SubscriptionPageGuard] Refresh failed:", err),
        );
      hasRefreshed.current = true;
    }
  }, [refresh, DEBUG]);

  // Log subscription state updates (for debugging)
  useEffect(() => {
    if (DEBUG) {
      console.log(
        "🔎 [SubscriptionPageGuard] State update -> isLoading:",
        isLoading,
        ", hasAccess:",
        hasAccess,
      );
    }
  }, [isLoading, hasAccess, DEBUG]);

  // While loading, show the spinner
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <Loading message={loadingMessage} size={loadingSize} />
      </div>
    );
  }

  // If subscription is required and user doesn't have access, show the upgrade dialog
  if (!hasAccess && requireSubscription) {
    return <UpgradeDialog />;
  }

  // User has access (or subscription not strictly required): render the guarded content.
  return <>{children}</>;
}

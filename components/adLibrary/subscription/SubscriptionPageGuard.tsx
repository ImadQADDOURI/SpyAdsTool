"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { useSubscription } from "@/components/adLibrary/subscription/SubscriptionProvider";

type SubscriptionPageGuardProps = {
  children: React.ReactNode;
  fallbackUrl?: string; // 🔄 Where to redirect if no access
  requireSubscription?: boolean; // 🔒 Whether to fully block or just refresh data
  loadingMessage?: string; // 💬 Custom loading message
  loadingSize?: "small" | "medium" | "large"; // 📏 Size of the loading spinner
};

/**
 * 🛡️ Guards page access based on subscription status
 * Can either block access completely or just refresh subscription data
 */
export function SubscriptionPageGuard({
  children,
  fallbackUrl = "/pricing", // Default redirect to pricing page
  requireSubscription = true, // Complete protection by default
  loadingMessage = "Verifying subscription...",
  loadingSize = "medium",
}: SubscriptionPageGuardProps) {
  const { hasAccess, isLoading, refresh } = useSubscription();
  const router = useRouter();

  // 🔄 Always refresh subscription data when guard is mounted
  // Using a ref to ensure we only refresh once
  const hasRefreshed = React.useRef(false);

  useEffect(() => {
    if (!hasRefreshed.current) {
      refresh();
      hasRefreshed.current = true;
    }
  }, [refresh]);

  // 🚪 Redirect if no access and full protection is required
  useEffect(() => {
    if (!isLoading && !hasAccess && requireSubscription) {
      router.push(fallbackUrl);
    }
  }, [hasAccess, isLoading, requireSubscription, router, fallbackUrl]);

  // ⏳ Show loading spinner while checking subscription
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <Loading message={loadingMessage} size={loadingSize} />
      </div>
    );
  }

  // 🚫 For complete protection, don't render anything while redirecting
  if (!hasAccess && requireSubscription) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <Loading
          message="Redirecting to subscription page..."
          size={loadingSize}
        />
      </div>
    );
  }

  // ✅ Either the user has access or we're just refreshing data
  return <>{children}</>;
}

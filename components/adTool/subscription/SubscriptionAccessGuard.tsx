// @components\adLibrary\subscription\SubscriptionAccessGuard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscription } from "@/components/adTool/subscription/SubscriptionProvider";

{
  /*

Usage Examples
# Wrapping Protected Content
<SubscriptionAccessGuard>
  <YourPremiumFeature />
</SubscriptionAccessGuard>

# With content hiding enabled
<SubscriptionAccessGuard hideContent>
  <YourSensitivePremiumFeature />
</SubscriptionAccessGuard>

# With lock icon overlay
<SubscriptionAccessGuard showIcon>
  <YourPremiumFeature />
</SubscriptionAccessGuard>

# Combined: blur + icon
<SubscriptionAccessGuard hideContent showIcon>
  <YourSensitivePremiumFeature />
</SubscriptionAccessGuard>

# Checking Subscription Status in Components
const { hasAccess, subscription, isLoading } = useSubscription();
// Conditional rendering based on subscription
if (hasAccess) {
  return <PremiumFeature />;
}

  */
}

type SubscriptionAccessGuardProps = {
  children: React.ReactNode;
  hideContent?: boolean; // 🔒 Toggle for strong blur to hide content from non-subscribers
  showIcon?: boolean; // 🔓 Show lock/unlock icon to indicate premium feature
  className?: string;
};

export default function SubscriptionAccessGuard({
  children,
  hideContent = false,
  showIcon = false,
  className,
}: SubscriptionAccessGuardProps) {
  const { hasAccess, isLoading } = useSubscription();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 🎯 If user has access or content is still loading, show the actual content
  if (hasAccess || isLoading) {
    return <>{children}</>;
  }

  // 🔒 Handle upgrade navigation
  const handleUpgradeClick = () => {
    setDialogOpen(false);
    router.push("/pricing");
  };

  return (
    <>
      {/* 🔒 Clickable protected content */}
      <div
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-md",
          className,
        )}
        onClick={() => setDialogOpen(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={cn("pointer-events-none", hideContent && "blur-md")}>
          {children}
        </div>

        {/* Light purple overlay when hideContent is enabled */}
        {hideContent && (
          <div
            className={cn(
              "absolute inset-0 bg-purple-200/30 backdrop-blur-sm transition-opacity duration-200",
              isHovering ? "opacity-60" : "opacity-40",
            )}
          />
        )}

        {/* Lock icon overlay when showIcon is enabled */}
        {showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "rounded-full bg-white/70 p-2 shadow-lg transition-all duration-200 dark:bg-gray-900/70",
                "h-[min(20%,4rem)] min-h-8 w-[min(20%,4rem)] min-w-8",
                isHovering
                  ? "scale-110 bg-white/95 dark:bg-gray-900/95"
                  : "scale-100",
              )}
            >
              <LockIcon className="h-full w-full text-[#6566F1] opacity-80" />
            </div>
          </div>
        )}
      </div>

      {/* ✨ Upgrade dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white p-6 dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-center text-xl font-bold text-transparent">
              Premium Feature
            </DialogTitle>
            <DialogDescription className="pt-2 text-center">
              Upgrade to our Pro plan to unlock this and many more premium
              features.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-gradient-to-br from-[#6566F1]/10 to-[#B977F8]/10 p-4">
              <LockIcon className="h-10 w-10 text-[#6566F1]" />
            </div>

            <div className="mt-2 w-full space-y-4">
              <Button
                onClick={handleUpgradeClick}
                className="w-full bg-gradient-to-r from-[#6566F1] to-[#B977F8] text-white transition-all hover:opacity-90"
              >
                Upgrade Now
              </Button>

              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="w-full border-gray-300 dark:border-gray-700"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

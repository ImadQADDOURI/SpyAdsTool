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
import { useSubscription } from "@/components/adLibrary/subscription/SubscriptionProvider";

{
  /*

Usage Examples
# Wrapping Protected Content
<SubscriptionAccessGuard>
  <YourPremiumFeature />
</SubscriptionAccessGuard>


# Using Minimal UI for Small Elements
<SubscriptionAccessGuard minimalUI>
  <SmallPremiumWidget />
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
  minimalUI?: boolean; // 🔄 Toggle for simpler UI on smaller elements
  className?: string;
};

export default function SubscriptionAccessGuard({
  children,
  minimalUI = false,
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
        {/* 🌫️ Original content with light blur effect */}
        <div className="pointer-events-none opacity-90 blur-[2px] filter">
          {children}
        </div>

        {/* 🔮 Premium overlay with lighter purple gradient and lock icon */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-gradient-to-br from-[#6566F1]/40 to-[#B977F8]/40",
            "transition-all duration-300",
            isHovering ? "opacity-90" : "opacity-75",
          )}
        >
          <LockIcon
            className={cn(
              "text-white drop-shadow-md transition-all",
              isHovering ? "scale-110" : "scale-100",
              minimalUI ? "h-5 w-5" : "h-8 w-8",
            )}
          />
        </div>
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

"use client";

import { useEffect } from "react";

import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";
import { useSubscription } from "@/components/adLibrary/subscription/SubscriptionProvider";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";

export default function AccountSettingsPage() {
  const { refresh, subscription, isLoading } = useSubscription();

  return (
    <SubscriptionPageGuard requireSubscription={false}>
      <div className="space-y-6">
        <DashboardHeader
          heading="Account Settings"
          text="Manage your account security and data deletion options."
        />

        <div className="space-y-8">
          {isLoading ? (
            <div className="animate-pulse rounded-md bg-gray-100 p-6 dark:bg-gray-800">
              Loading subscription data...
            </div>
          ) : (
            subscription && (
              <DeleteAccountSection subscriptionPlan={subscription} />
            )
          )}
        </div>
      </div>
    </SubscriptionPageGuard>
  );
}

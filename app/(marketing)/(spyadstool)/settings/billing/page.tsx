// @app\(marketing)\settings\billing\page.tsx

"use client";

import { useEffect } from "react";

import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";
import { useSubscription } from "@/components/adLibrary/subscription/SubscriptionProvider";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";

export default function BillingSettingsPage() {
  const { refresh, subscription, isLoading } = useSubscription();

  return (
    <SubscriptionPageGuard requireSubscription={false}>
      <div className="space-y-6">
        <DashboardHeader
          heading="Billing & Subscription"
          text="Manage your subscription plan, payment methods, and billing history."
        />

        <div className="space-y-8">
          {isLoading ? (
            <div className="animate-pulse rounded-md bg-gray-100 p-6 dark:bg-gray-800">
              Loading subscription data...
            </div>
          ) : (
            subscription && <BillingInfo userSubscriptionPlan={subscription} />
          )}
        </div>
      </div>
    </SubscriptionPageGuard>
  );
}

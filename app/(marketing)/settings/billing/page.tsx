import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";

export default async function BillingSettingsPage() {
  // 🔐 Auth check - fetch user data at page level
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  // 💰 Get subscription details
  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Billing & Subscription"
        text="Manage your subscription plan, payment methods, and billing history."
      />

      <div className="space-y-8">
        <BillingInfo userSubscriptionPlan={subscriptionPlan} />
      </div>
    </div>
  );
}

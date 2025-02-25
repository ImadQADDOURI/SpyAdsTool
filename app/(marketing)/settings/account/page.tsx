import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function AccountSettingsPage() {
  // 🔐 Auth check - fetch user data at page level
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  // 💰 Get subscription details for account deletion checks
  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Account Settings"
        text="Manage your account security and data deletion options."
      />

      <div className="space-y-8">
        <DeleteAccountSection subscriptionPlan={subscriptionPlan} />
      </div>
    </div>
  );
}

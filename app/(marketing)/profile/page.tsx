// @app/(protected)/dashboard/settings/page.tsx
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
// import { UserRoleForm } from "@/components/forms/user-role-form"; // Uncomment if needed
import { BillingInfo } from "@/components/pricing/billing-info";

export default async function Profile() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <DashboardHeader
          heading="Profile"
          text="Manage account and your subscription plan. "
        />

        <div className="mt-8 space-y-8">
          <UserNameForm user={{ id: user.id, name: user.name || "" }} />
          {/* <UserRoleForm user={{ id: user.id, role: user.role }} /> */}
          <BillingInfo userSubscriptionPlan={subscriptionPlan} />
          <DeleteAccountSection subscriptionPlan={subscriptionPlan} />
        </div>
      </div>
    </div>
  );
}

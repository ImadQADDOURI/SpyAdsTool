import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";

export default async function ProfileSettingsPage() {
  // 🔐 Auth check - fetch user data at page level
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Profile Settings"
        text="Manage your personal profile information and preferences."
      />

      <div className="space-y-8">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />

        {/* <UserRoleForm user={{ id: user.id, role: user.role }} /> */}
      </div>
    </div>
  );
}

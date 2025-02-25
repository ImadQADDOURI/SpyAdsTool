import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  // Redirect to profile settings by default
  redirect("/settings/profile");
}

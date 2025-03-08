import { redirect } from "next/navigation";

import { SubscriptionResponse } from "types";
import { getCurrentUser } from "@/lib/session";
import { SubscriptionProvider } from "@/components/adLibrary/subscription/SubscriptionProvider";

// 🔒 Protected layout that requires authentication and loads subscription data
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👤 Server-side authentication check
  const user = await getCurrentUser();

  // 🚪 Redirect to login if user is not authenticated
  if (!user?.id) {
    redirect("/login");
  }

  // 🚀 Pre-fetch subscription data server-side for faster initial render
  let subscriptionData: SubscriptionResponse | null = null;

  try {
    // 📡 Fetch from our internal API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription?userId=${user.id}`,
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    );

    if (response.ok) {
      subscriptionData = await response.json();
    }
  } catch (error) {
    console.error("❌ Failed to prefetch subscription data:", error);
    // Continue without initial data - the client will fetch it
  }

  return (
    // 🧠 Hydrate the subscription context with server-fetched data
    <SubscriptionProvider initialData={subscriptionData}>
      <main className="flex min-h-screen flex-col">
        {/* 🎈 Render the protected route content */}
        {children}
      </main>
    </SubscriptionProvider>
  );
}

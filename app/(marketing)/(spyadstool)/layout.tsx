// @app\(marketing)\(spyadstool)\layout.tsx
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { SavedAdsProvider } from "@/components/adLibrary/favorites/SavedAdsContext";
import { SubscriptionProvider } from "@/components/adLibrary/subscription/SubscriptionProvider";

// 🔒 Protected layout that requires authentication
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

  return (
    // 🧠 SubscriptionProvider will now fetch its own data on the client
    <SubscriptionProvider>
      <SavedAdsProvider>
        <main className="relative flex min-h-screen flex-col">
          {/* 🎈 Render the protected route content */}
          {children}
        </main>
      </SavedAdsProvider>
    </SubscriptionProvider>
  );
}

// @app/trend/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";

import AdArchive from "@/components/adTool/AdArchive";
import { Loading } from "@/components/adTool/sharedComponents/Loading";
import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";

export const metadata: Metadata = {
  title: "Trending Ads",
  description:
    "Search, filter, and discover trending ads from the global database.",
};

export default function TrendingPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense
        fallback={<Loading message="Loading content..." size="large" />}
      >
        <AdArchive />
      </Suspense>
    </SubscriptionPageGuard>
  );
}

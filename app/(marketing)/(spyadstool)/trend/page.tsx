// app/trend/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";

import TrendAds from "@/components/adLibrary/favorites/TrendAds";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";

export const metadata: Metadata = {
  title: "Trending Ads",
  description: "Discover trending and popular ads curated by our team",
};

export default function TrendingPage() {
  return (
    <SubscriptionPageGuard>
      <Suspense
        fallback={<Loading message="Loading content..." size="large" />}
      >
        <TrendAds />
      </Suspense>
    </SubscriptionPageGuard>
  );
}

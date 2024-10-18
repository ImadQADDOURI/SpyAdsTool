// app/trend/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";

import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { TrendAds } from "@/components/adLibrary/TrendAds";

export const metadata: Metadata = {
  title: "Trending Ads",
  description: "Explore the latest trending ads curated by our experts.",
};

export default function TrendPage() {
  return (
    <Suspense fallback={<Loading message="Loading content..." size="large" />}>
      <TrendAds />
    </Suspense>
  );
}

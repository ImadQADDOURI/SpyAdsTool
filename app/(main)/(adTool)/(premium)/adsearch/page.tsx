// /app/dashboard/adlibrary/page.tsx
import { Suspense } from "react";

import AdBrowser from "@/components/adTool/AdBrowser";
import { Loading } from "@/components/adTool/sharedComponents/Loading";
import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";

interface SearchParams {
  pageId?: string;
}

export default function AdLibraryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const pageId = searchParams?.pageId;

  return (
    <SubscriptionPageGuard requireSubscription={false}>
      <Suspense
        fallback={<Loading message="Loading content..." size="large" />}
      >
        <AdBrowser />
      </Suspense>
    </SubscriptionPageGuard>
  );
}

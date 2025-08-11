// app/dashboard/ad-library/[pageId]/page.tsx
import { Suspense } from "react";

import { Loading } from "@/components/adTool/microComponents/Loading";
import PageAdBrowser from "@/components/adTool/PageAdBrowser";
import { SubscriptionPageGuard } from "@/components/adTool/subscription/SubscriptionPageGuard";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default function PageAdLibraryPage({ params }: PageProps) {
  return (
    <SubscriptionPageGuard>
      <Suspense
        fallback={<Loading message="Loading content..." size="large" />}
      >
        <PageAdBrowser pageId={params.pageId} />
      </Suspense>
    </SubscriptionPageGuard>
  );
}

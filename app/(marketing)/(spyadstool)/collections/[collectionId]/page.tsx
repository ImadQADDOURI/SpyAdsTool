// app/collections/[collectionId]/page.tsx
import { Suspense } from "react";

import { CollectionDetails } from "@/components/adLibrary/CollectionDetails";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import { SubscriptionPageGuard } from "@/components/adLibrary/subscription/SubscriptionPageGuard";

interface CollectionPageProps {
  params: {
    collectionId: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <SubscriptionPageGuard>
      <Suspense
        fallback={<Loading message="Loading content..." size="large" />}
      >
        <CollectionDetails collectionId={params.collectionId} />
      </Suspense>
    </SubscriptionPageGuard>
  );
}
